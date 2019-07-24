<template>
  <div>
    <div class="selectBox">
      <span class="fl-l">筛选：</span>
      <el-date-picker
        v-model="sDate"
        type="date"
        placeholder="日期"
        value-format="yyyy-MM-dd"
        class="fl-l"
      ></el-date-picker>
      <el-select v-model="mine" placeholder="选择矿点" style="width: 180px" class="fl-l">
        <el-option
          v-for="(item, i) in mineData"
          :key="i"
          :label="item.label"
          :value="item.value"
        ></el-option>
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
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.hasRead == '已读'"></span>
          <span v-else @click="operationread(scope.row, scope.$index)">修改</span>
          <span @click="operationInfo(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px;"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="dataLength"
      @current-change="getData"
    ></el-pagination>

    <el-dialog :visible.sync="isShow" title="新增围栏" class="deviateDialog">
      <div class="po-re">
        <baidu-map
          :class="{isShow: isShow}"
          class="map"
          :center="mapPoint"
          :zoom="zoom"
          :style="{width: width,height: height}"
          :scroll-wheel-zoom="true"
          @click="paintPolyline"
          @rightclick="newPolyline"
        >
          <bm-marker v-for="(item, i) of markerPointArr" :position="item" :key="i"></bm-marker>
          <bm-polyline :path="path" v-for="(path, i) of polyline.paths" :key="i"></bm-polyline>
        </baidu-map>

        <span class="po-ab positionDiv" @click="mapPosition, toggle('polyline')">
          <!-- <img src="../../assets/images/mapToolIcon/position.png" alt />
          <img src="../../assets/images/mapToolIcon/position-c.png" alt />-->
        </span>

        <span
          v-if="polyline.editing"
          class="po-ab positionDiv"
          @click="mapPosition, toggle('polyline')"
        >结束</span>
        <span v-else class="po-ab positionDiv" @click="mapPosition, toggle('polyline')">绘制</span>

        <span class="po-ab backDiv" @click="back">
          <!-- <img src="../../assets/images/mapToolIcon/back.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/back-c.png" alt />
        </span>

        <span v-if="zoomState" class="po-ab narrowDiv" @click="narrow">
          <!-- <img src="../../assets/images/mapToolIcon/narrow.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/narrow-c.png" alt />
        </span>

        <span v-else class="po-ab enlargeDiv" @click="enlarge">
          <!-- <img src="../../assets/images/mapToolIcon/enlarge.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/enlarge-c.png" alt />
        </span>

        <span class="po-ab reset" @click="cleanMapOverlay">
          <!-- <img src="../../assets/images/mapToolIcon/enlarge.png" alt />
          <img src="../../assets/images/mapToolIcon/enlarge-c.png" alt />-->
          <img src="../../assets/images/mapToolIcon/reset.png" alt width="30px;" />
        </span>
        <span class="po-ab done" style="background: none;" @click="commit">
          <img src="../../assets/images/mapToolIcon/commit.png" alt width="80px;" />
          <img src="../../assets/images/mapToolIcon/commit-c.png" alt width="80px;" />
        </span>
        <!-- <img src="../../assets/images/mapToolIcon/enlarge.png" alt />
        <img src="../../assets/images/mapToolIcon/enlarge-c.png" alt />-->
        <!-- 保存 -->

        <div class="mapAboveSearch po-ab">
          <el-select v-model="mine" placeholder="选择矿点" class="fl-l">
            <el-option
              v-for="item in mineData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
      dataLength: null,
      stripe: true,
      border: true,
      tableData: [],
      zoomState: true,
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
      sDate: this.PF.getToDay(),
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
      }
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
    commit() {
      var str = "";
      this.polyline.paths[0].forEach((el, i) => {
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
        venderName: "云到收费",
        mines: this.mine,
        polygon: str
      });
      this.ajax
        .post("/monitorApi/addOrUpdateVenderMinesEnclosure", param)
        .then(res => {
          if (res.data.errorCode == 200) {
            this.$alert("添加成功").then(res => {
              this.isShow = false;
            });
          }
        });
    },
    getMines() {
      let param = this.qs.stringify({
        vendername: "云到收费",
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
      this.polyline.paths = [];
      this.markerPointArr = [];
    },
    toggle(name) {
      if (this.mine == "") {
        this.$alert("请选择矿点");
        return;
      }
      this[name].editing = !this[name].editing;
      if (!this[name].editing) {
        this.polyline.paths[0].push(this.polyline.paths[0][0]);
        this.markerPointArr = [];
      }
    },
    newPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        paths.push([]);
      }
      const path = paths[paths.length - 1];
      path.pop();
      if (path.length) {
        paths.push([]);
      }
    },
    paintPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      !paths.length && paths.push([]);
      this.markerPointArr.push(e.point);
      paths[paths.length - 1].push(e.point);
    },
    handleSelectionChange() {},
    addMine() {
      this.isShow = true;
    },
    getData(a) {
      this.read = this.read === 2 ? "" : this.read;
      this.sortDate = this.sortDate === 0 ? "" : this.sortDate;
      this.warning = this.warning === 0 ? "" : this.warning;
      let param = this.qs.stringify({
        venderId: this._venderLoginId,
        hasRead: this.read,
        driverNumber: this.driverNumber,
        startDate: this.startDate,
        endDate: this.endDate,
        waringType: this.warning,
        sortBy: this.sortDate,
        pagesNo: a ? a - 1 : 0
      });
      this.ajax.post("monitorApi/getWaringList", param).then(res => {
        console.log(res);
        res.data.body.result.forEach(el => {
          el.appointmentDate = el.appointmentDate
            ? this.PF.parseDate(el.appointmentDate)
            : "-";
          el.hasread = el.hasread ? "已读" : "未读";
        });
        this.dataLength = res.data.body.size;
        this.tableData = res.data.body.result;
      });
    },
    mapPosition() {},
    back() {
      if (!this.polyline.editing) {
        return;
      }
      this.polyline.paths[0].pop();
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
        pagesNo: a ? a : 0,
        mines: this.mine
      });
      this.ajax
        .post("/monitorApi/getVenderMinesEnclosureList", param)
        .then(res => {
          this.tableData = res.data.body.list;
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
    }
  },
  computed: mapState({
    _venderLoginId: state => state._venderLoginId,
    _globalVenderName: state => state.globalVenderName
  })
};
</script>

<style lang="less">
.deviateDialog {
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
  .el-select {
    width: 630px;

    margin: 0 auto;
    display: block;
    float: inherit;
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
  width: 660px;
  height: 60px;
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 50%;
  margin-left: -377px;
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
  bottom: 80px;
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
}
</style>
