<template>
  <div id="deviateDialog">
    <div class="selectBox">
      <span class="fl-l">筛选：</span>
      <el-date-picker
        v-model="sDate"
        type="date"
        placeholder="创建日期"
        value-format="yyyy-MM-dd"
        class="fl-l"
      ></el-date-picker>
      <el-select v-model="mine" placeholder="选择矿点" style="width: 180px" class="fl-l">
        <el-option v-for="(item, i) in mineData" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span class="fl-l searchBtn" @click="getMineList">查找</span>
      <span class="fl-r" @click="addMine">+&nbsp;新增矿点围栏</span>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :stripe="stripe"
      :border="border"
    >
      <el-table-column label="序号" width="120">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column prop="mines" label="矿点名称"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="点击关闭"
            placement="right-start"
            v-if="scope.row.status === '开启'"
          >
            <span class="statusBtn close" @click="editorStatus(scope.row)">已开启</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="点击开启" placement="right-start" v-else>
            <span class="statusBtn start" @click="editorStatus(scope.row)">已关闭</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="editorBtn fc-g" @click="editor(scope.row, scope.$index)">修改</span>
          <span class="deleteBtn fc-r" @click="deleteFn(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px;"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="total"
      @current-change="getMineList"
    ></el-pagination>

    <el-dialog :visible.sync="isShow" title="新增围栏" class="deviateDialog" @close="dialogClose">
      <div class="po-re">
        <baidu-map
          class="map"
          :center="mapPoint"
          :zoom="zoom"
          :style="{width: width,height: height}"
          :scroll-wheel-zoom="true"
          @click="paintPolyline"
        >
          <bm-marker v-for="(item, i) of markerPointArr" :position="item" :key="i"></bm-marker>
          <bm-polyline :path="polyline.paths"></bm-polyline>
        </baidu-map>

        <span
          v-if="polyline.editing"
          class="po-ab positionDiv"
          @click="mapPosition, toggle('polyline')"
        >结束</span>
        <span v-else class="po-ab positionDiv" @click="mapPosition, toggle('polyline')">绘制</span>

        <span class="po-ab backDiv" @click="back" title="撤销">
          <!-- <img src="../../assets/images/mapToolIcon/back.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/back-c.png" alt />
        </span>

        <span v-if="zoomState" class="po-ab narrowDiv" @click="narrow">
          <!-- <img src="../../assets/images/mapToolIcon/narrow.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/narrow-c.png" title="缩放地图" alt />
        </span>

        <span v-else class="po-ab enlargeDiv" @click="enlarge">
          <!-- <img src="../../assets/images/mapToolIcon/enlarge.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/enlarge-c.png" title="缩放地图" alt />
        </span>

        <span class="po-ab reset" @click="cleanMapOverlay">
          <!-- <img src="../../assets/images/mapToolIcon/enlarge.png" alt />
          <img src="../../assets/images/mapToolIcon/enlarge-c.png" alt />-->
          <img src="../../assets/images/mapToolIcon/reset.png" title="删除围栏" alt width="30px;" />
        </span>
        <span class="po-ab done" @click="commit">
          <!-- <img src="../../assets/images/mapToolIcon/commit.png" alt width="80px;" />
          <img src="../../assets/images/mapToolIcon/commit-c.png" alt width="80px;" />-->
          提交
        </span>
        <!-- <img src="../../assets/images/mapToolIcon/enlarge.png" alt />
        <img src="../../assets/images/mapToolIcon/enlarge-c.png" alt />-->
        <!-- 保存 -->

        <div class="mapAboveSearch po-ab" v-if="operationType === 'add'">
          <el-select v-model="mapMine" placeholder="选择矿点" class="fl-l">
            <el-option
              v-for="(item, i) in mineData"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            class="carNumber"
            placeholder="输入所选矿点经纬度，并用','分隔"
            v-model="addressOrPoint"
            clearable
            @change="addrOrPoint"
          ></el-input>
        </div>
      </div>
      <!-- <div class="btn">
        <input type="buttom" value="确定" class @click="endPainting" />
        <input type="buttom" value="取消" class="cancel" @click="cleanMapOverlay"/>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import { constants } from "crypto";
import { mapState } from "vuex";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 0,
      total: null,
      stripe: true,
      border: true,
      tableData: [],
      zoomState: true,
      addressOrPoint: "",
      mineData: [
        {
          label: "请选择报警类型",
          value: 0
        },
        {
          label: "路线偏离",
          value: 9
        },
        {
          label: "停车超时",
          value: 10
        },
        {
          label: "断电报警",
          value: 2
        },
        {
          label: "温度过高",
          value: 5
        },
        {
          label: "GPS故障",
          value: 11
        }
      ],
      markerPointArr: [],
      mine: "",
      mapMine: "",
      sDate: "",
      isShow: false,
      mapPoint: {
        lat: 39,
        lng: 114
      },
      width: "100%",
      height: "778px",
      zoom: 12,
      polyline: {
        editing: false,
        paths: []
      },
      operationType: "add",
      editorId: ""
    };
  },
  mounted() {
    // this.markerPointArr.push(this.mapPoint);
    const arr = [131, 6, 2, 4, 12, 52, 31, 42, 51, 424, 13213];
    this.getMineList();
    this.getMines();
    // console.log(this.quickSort(arr));
  },
  methods: {
    addrOrPoint() {
      if (this.addressOrPoint == "") {
        return;
      }
      let reg = /^[\u4e00-\u9fa5]+$/;
      if (reg.test(this.addressOrPoint)) {
        this.$alert("请输入经纬度");
        return;
      }
      if (this.addressOrPoint.indexOf(",") < 0) {
        this.$alert("经纬度用','号分隔");
        return;
      }
      let searchPoint = {
        lng: this.addressOrPoint.split(",")[0],
        lat: this.addressOrPoint.split(",")[1]
      };
      this.mapPoint = searchPoint;
      this.markerPointArr.push(searchPoint);
    },
    dialogClose() {
      this.polyline.editing = false;
      this.polyline.paths = [];
      this.markerPointArr = [];
      this.mapMine = "";
    },
    editorStatus(a) {
      let param = this.qs.stringify({
        id: a.id,
        status: a.status == "开启" ? 0 : 1
      });
      this.ajax
        .post("/monitorApi/updateVenderMinesEnclosureStatus", param)
        .then(res => {
          if (res.data.errorCode == 200) {
            this.$alert("修改成功").then(res => {
              this.getMineList();
            });
          }
        });
    },
    editor(a) {
      this.operationType = "editor";
      this.isShow = true;
      this.polyline.paths = this.parsePath(a.enclosure);
      this.mapPoint = this.polyline.paths[0];
      this.mapMine = a.mines;
      this.editorId = a.id;
      // console.log(this.mapPoint)
      // this.zoom = 10;
      // this.mapPoint.lng = this.polyline.paths[0].lng;
      // this.mapPoint.lat = this.polyline.paths[0].lat;
    },
    deleteFn(a) {
      let param = this.qs.stringify({
        id: a.id
      });
      this.ajax
        .post("/monitorApi/deleteVenderMinesEnclosure", param)
        .then(res => {
          if (res.data.errorCode == 200) {
            this.$alert("删除成功").then(res => {
              this.getMineList();
            });
          }
        });
    },
    commit() {
      if (this.polyline.paths.length == 0) {
        this.$alert("请先绘画围栏");
        return;
      }
      if (this.polyline.editing) {
        this.$alert("请先结束绘画");
        return;
      }
      if (this.operationType == "add") {
        this.editorId = "";
      }
      var str = "";
      this.polyline.paths.forEach((el, i) => {
        for (let i in el) {
          if (i == "lng" || i == "lat") {
            if (i == "lng") {
              str += el[i] + "_";
            } else {
              str += el[i] + ",";
            }
          }
        }
      });
      str = str.substring(0, str.lastIndexOf(","));
      let param = this.qs.stringify({
        venderId: this._venderLoginId,
        //this._globalVenderName
        venderName: this._globalVenderName,
        mines: this.mapMine,
        polygon: str,
        id: this.editorId
      });
      this.ajax
        .post("/monitorApi/addOrUpdateVenderMinesEnclosure", param)
        .then(res => {
          if (res.data.errorCode == 200) {
            if (this.operationType == "add") {
              this.$alert("添加成功").then(res => {
                this.getMineList();
                this.isShow = false;
              });
            } else {
              this.$alert("修改成功").then(res => {
                this.getMineList();
                this.isShow = false;
              });
            }
          }
        });
    },
    getMines() {

      console.log(this._globalVenderName);
      
      let param = this.qs.stringify({
        vendername: this._globalVenderName,
        status: 1
      });
      this.mineData = [];
      this.ajax.post("/monitorApi/query_venderMineral", param).then(res => {
        res.data.body.resultList.forEach((el, i) => {
          var obj = {};
          obj.label = el.mineralName;
          obj.value = el.mineralName;
          this.mineData.push(obj);
        });
      });
    },
    cleanMapOverlay() {
      this.polyline.editing = false;
      this.polyline.paths = [];
      this.markerPointArr = [];
    },
    toggle(name) {
      if (this.mapMine == "") {
        if (this.operationType == "editor") {
        } else {
          this.$alert("请选择矿点");
          return;
        }
      }

      if (this.operationType == "editor" && this.polyline.paths.length != 0) {
        if (!this.polyline.editing) {
          this.$alert("请先删除围栏，再绘制");
          return;
        }
      }

      if (this.operationType == "add" && this.polyline.paths.length != 0) {
        if (!this.polyline.editing) {
          this.$alert("请先删除围栏，再绘制");
          return;
        }
      }
      this[name].editing = !this[name].editing;
      if (!this[name].editing) {
        this.polyline.paths.push(this.polyline.paths[0]);
        this.markerPointArr = [];
      }
    },
    paintPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      this.markerPointArr.push(e.point);
      this.polyline.paths.push(e.point);
    },
    handleSelectionChange() {},
    addMine() {
      this.operationType = "add";
      this.isShow = true;
    },
    mapPosition() {},
    back() {
      if (!this.polyline.editing) {
        return;
      }
      this.polyline.paths.pop();
      this.markerPointArr.pop();
    },
    enlarge() {
      if (this.zoom >= 18) {
        this.zoomState = true;
        return;
      }
      this.zoom += 2;
    },
    narrow() {
      if (this.zoom <= 2) {
        this.zoomState = false;
        return;
      }
      this.zoom -= 2;
    },
    getMineList(a) {
      let param = this.qs.stringify({
        venderId: this._venderLoginId,
        createDate: this.sDate,
        pagesNo: typeof a == "number" ? a - 1 : 0,
        mines: this.mine
      });
      this.ajax
        .post("/monitorApi/getVenderMinesEnclosureList", param)
        .then(res => {
          res.data.body.list.forEach((el, i) => {
            el.status = el.status == 1 ? "开启" : "关闭";
          });
          this.tableData = res.data.body.list;

          this.total = res.data.body.allcount;
        });
    },
    quickSort(arr) {
      if (arr.length <= 1) {
        return arr;
      }
      var midI = Math.floor((arr.length - 1) / 2);
      var mid = arr.splice(midI, 1)[0];
      var left = [];
      var right = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] < mid) {
          left.push(arr[i]);
        } else {
          right.push(arr[i]);
        }
      }
      return this.quickSort(left).concat([mid], this.quickSort(right));
    },
    parsePath(a) {
      let path = a.split(",");
      var parseAfterPath = [];
      path.forEach(el => {
        var obj = {};
        obj.lng = el.split("_")[0];
        obj.lat = el.split("_")[1];
        parseAfterPath.push(obj);
      });
      return parseAfterPath;
    }
  },
  computed: mapState({
    _venderLoginId: state => state._venderLoginId,
    _globalVenderName: state => state.globalVenderName
  })
};
</script>

<style lang="less">
#deviateDialog {
  .el-table th.is-leaf,
  .el-table__body td {
    text-align: center;
  }
  td span {
  margin: 0 35px;
  &:hover {
    cursor: pointer;
  }
}
}
.deviateDialog {
  .el-dialog__headerbtn {
    &:hover {
      top: 10px;
      .el-dialog__close {
        &:hover {
          font-size: 22px;
          color: #dd6f6f;
        }
      }
    }
    top: 15px;
  }
  .el-dialog {
    border-radius: 6px;
    overflow: hidden;
  }
  .el-dialog {
    width: 86%;
    height: 86%;
    margin-top: 6vh !important;
  }
  .el-dialog__header {
    background: #0671af;
    padding: 10px;
    .el-dialog__title,
    .el-dialog__close {
      color: white;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-input__inner {
    width: 330px;
  }
  .el-select,
  .carNumber {
    width: 330px;

    margin: 0 auto;

    line-height: 60px;

    .el-input__inner {
      height: 44px;
      font-size: 16px;
    }
    &::-webkit-input-placeholder {
      color: #333;
    }
  }
}
</style>
<style lang="less">
.mapAboveSearch {
  background: rgba(0, 0, 0, 0.2);
  width: 720px;
  height: 60px;
  top: 0;
  left: 28%;
  display: flex;
}
.selectBox {
  margin-bottom: 14px;
  overflow: hidden;
  background: rgba(222, 236, 245, 1);
  height: 63px;
  padding: 0 10px 0 50px;
  & > * {
    margin-right: 12px;
    line-height: 63px;
  }
  .searchBtn,
  .fl-r {
    color: #0671afff;
    cursor: pointer;
  }
  .fl-r {
    margin-right: 80px;
  }
}
.positionDiv {
  left: 20px;
  top: 110px;
  text-align: center;
  line-height: 72px;
  font-size: 20px;
  color: white;
  font-weight: bold;
}
.backDiv {
  left: 20px;
  top: 200px;
}
.enlargeDiv {
  left: 20px;
  top: 20px;
}
.narrowDiv {
  left: 20px;
  top: 20px;
}
.reset {
  left: 20px;
  top: 290px;
}
.done {
  left: 20px;
  bottom: 303px;
  color: white;
  background: #0671af !important;
  border-radius: 6px;
  font-weight: bold;
  & img {
    &:nth-child(1) {
      display: none;
    }
    &:nth-child(2) {
      display: block;
    }
  }
  &:hover img {
    &:nth-child(1) {
      display: block;
    }
    &:nth-child(2) {
      display: none;
    }
  }
}
.positionDiv,
.backDiv,
.enlargeDiv,
.narrowDiv,
.reset,
.done {
  background: #0671af;
  width: 72px;
  height: 72px;
  border-radius: 5px;
  text-align: center;
  line-height: 72px;
  font-size: 20px;
  transition: all 0.8s;
  &:hover {
    background: #074a71;
    cursor: pointer;
  }
  img {
    margin-top: 18px;
  }
}


.statusBtn {
  color: cornflowerblue;
  // text-decoration: underline;
}
</style>



<style lang="less" scoped>
.editorBtn {
  &:hover {
    color: #77cc9f;
  }
}
.deleteBtn {
  &:hover {
    color: #dd6262;
  }
}
.start {
  color: #0d0a31;
  &:hover {
    color: #61606e;
  }
}
.close {
  color: #f56c6c;
  &:hover {
    color: #d57e7e;
  }
}
.selectBox {
  .searchBtn,
  .fl-r {
    &:hover {
      color: #5f92b0;
    }
  }
}
</style>