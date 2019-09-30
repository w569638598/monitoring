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
        <el-option value>查询矿点</el-option>
        <el-option v-for="(item, i) in mineData" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span class="fl-l searchBtn" @click="getMineList">查找</span>
      <span class="fl-r" @click="addMine">+&nbsp;新增矿点路线</span>
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
      <el-table-column prop="mine" label="矿点名称"></el-table-column>
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
          <span class="editorBtn fc-g" @click="editor(scope.row, scope.$index)">查看</span>
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

    <el-dialog :visible.sync="isShow" title="新增路线" class="deviateDialog" @close="dialogClose">
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
          <bm-marker
            @click=" toggle('polyline', false)"
            :position="venderAddress.coord"
            :icon="endicon"
          >
            <bm-label
              v-if="venderAddress.address != ''"
              :content="venderAddress.address"
              :offset="{width: -35, height: 30}"
            />
          </bm-marker>
          <bm-marker
            @click=" toggle('polyline', true)"
            :position="mineAddress.coord"
            :icon="satrticon"
          >
            <bm-label
              v-if="mineAddress.address != ''"
              :content="mineAddress.address"
              :offset="{width: -35, height: 30}"
            />
          </bm-marker>
          <bm-polyline :path="polyline.paths"></bm-polyline>
        </baidu-map>

        <span v-if="operationType != 'editor'" class="po-ab backDiv" @click="back" title="撤销">
          <!-- <img src="../../assets/images/mapToolIcon/back.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/back-c.png" alt />
        </span>

        <span v-if="zoomState" class="po-ab narrowDiv" @click="narrow">
          <img src="../../assets/images/mapToolIcon/narrow-c.png" title="缩放地图" alt />
        </span>

        <span v-else class="po-ab enlargeDiv" @click="enlarge">
          <img src="../../assets/images/mapToolIcon/enlarge-c.png" title="缩放地图" alt />
        </span>

        <span v-if="operationType != 'editor'" class="po-ab reset" @click="cleanMapOverlay">
          <img src="../../assets/images/mapToolIcon/reset.png" title="删除围栏" alt width="30px;" />
        </span>
        <span v-if="operationType != 'editor'" class="po-ab done" @click="commit">提交</span>
      </div>
      <!-- <div class="btn">
        <input type="buttom" value="确定" class @click="endPainting" />
        <input type="buttom" value="取消" class="cancel" @click="cleanMapOverlay"/>
      </div>-->
    </el-dialog>

    <el-dialog :visible.sync="addmineTC" title="新增围栏" class="addmineTC" @close="dialogClose">
      <div class="venderA tcList">
        <p class="title">厂家位置</p>
        <p>
          厂家位置：
          <span>{{venderAddress.address}}</span>
        </p>
      </div>

      <div class="venderA tcList">
        <p class="title">选择矿点</p>
        <div>
          <div class="selectMine">
            <span>选择矿点：</span>
            <el-select v-model="TCSelectMine" placeholder="选择矿点" style="width: 180px" class="fl-l">
              <el-option
                v-for="(item, i) in mineData"
                :key="i"
                :label="item.label"
                :value="item"
                :disabled="item.hasRoute == 1"
              ></el-option>
            </el-select>
          </div>
          <div class="mineAddress">
            <span>矿点地址：</span>
            {{mineAddress.address}}
          </div>
        </div>
      </div>
      <p style="text-align: center;margin: 80px 0;font-size: 12px;">
        <span style="color: red;">温馨提醒：</span>为了能更准确的定位车辆位置，描绘时请多描绘些坐标点；描绘起点一定从所选择矿点位置，终点是厂家位置。
      </p>
      <input @click="newAddFn" class="tcaddBtn" type="button" value="确认新增" />
    </el-dialog>
  </div>
</template>

<script>
import { constants } from "crypto";
import { mapState } from "vuex";
import { setTimeout } from "timers";
const iconStart = require("../../assets/images/icon-start.png");
const iconEnd = require("../../assets/images/icon-end.png");

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
      satrticon: {
        url: iconStart,
        size: { width: 32, height: 32 }
      },
      endicon: {
        url: iconEnd,
        size: { width: 32, height: 32 }
      },
      markerPointArr: [],
      mine: "",
      sDate: "",
      isShow: false,
      mapPoint: {
        lat: 39,
        lng: 114
      },
      width: "100%",
      height: "100%",
      zoom: 12,
      polyline: {
        editing: false,
        paths: []
      },
      operationType: "add",
      editorId: "",
      venderAddress: {
        coord: "",
        address: ""
      },
      addmineTC: false,
      mineAddress: {
        coord: "",
        address: ""
      },
      TCSelectMine: ""
    };
  },
  watch: {
    TCSelectMine() {
      this.mineAddress.address = "";
      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/checkMinePositionHasExists", {
          venderId: this._venderLoginId,
          mine: this.TCSelectMine.value
        })
        .then(res => {
          if (res.data.errorCode != 200) {
            const t = confirm("矿点位置不存在，是否跳转设置页面？");
            if (t) {
              this.$router.push("/warning/set");
              return;
            }
          } else {
            this.mineAddress = res.data.body.info;
            this.mineAddress.coord = {
              lng: res.data.body.info.coord.split(",")[0],
              lat: res.data.body.info.coord.split(",")[1]
            };
          }
        });
    }
  },
  mounted() {
    // this.markerPointArr.push(this.mapPoint);
    const arr = [131, 6, 2, 4, 12, 52, 31, 42, 51, 424, 13213];
    this.getMineList();
    this.getMines();
    // console.log(this.quickSort(arr));
  },
  methods: {
    newAddFn() {
      if (this.TCSelectMine == "") {
        this.$alert("请选择矿点");
        return;
      }
      if (this.mineAddress.address == "") {
        this.$alert("请确认填写地址");
        return;
      }
      if (this.TCSelectMine.hasRoute == 1) {
        this.$alert("已有路线，请勿重复添加");
        return;
      }
      this.mapPoint = this.mineAddress.coord;
      this.addmineTC = false;
      this.isShow = true;
    },
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
      this.mineAddress.address = "";
    },
    editorStatus(a) {
      let param = {
        id: a.id,
        status: a.status == "开启" ? 0 : 1
      };
      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/updateStatus", param)
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

      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/getRouteDetail", {
          id: a.id
        })
        .then(res => {
          setTimeout(() => {
            this.polyline.paths = res.data.body.list;
            this.mineAddress.coord = this.polyline.paths[0];
            this.venderAddress.coord = this.polyline.paths[
              this.polyline.paths.length - 1
            ];
            this.mapPoint = this.polyline.paths[this.polyline.paths.length - 1];
          }, 50);
          this.venderAddress.address = "";
          this.mineAddress.address = "";
        });
    },
    deleteFn(a) {
      this.$confirm("确定删除此条数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {
            id: a.id
          };
          this.ajax
            .post(this.PF.towAPIUrl + "/monitorApi/deleteRoute", param)
            .then(res => {
              if (res.data.errorCode == 200) {
                this.$alert("删除成功").then(res => {
                  this.getMineList();
                });
              }
            });
        })
        .catch(() => {
          return;
        });
    },
    commit() {
      if (this.polyline.paths.length == 0) {
        this.$alert("请先绘画路径");
        return;
      }
      if (this.polyline.editing) {
        this.$alert("请先结束绘画");
        return;
      }
      if (this.operationType == "add") {
        this.editorId = "";
      }
      let param = {
        venderId: this._venderLoginId,
        mine: this.TCSelectMine.value,
        routeInfo: this.polyline.paths
      };
      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/inserRoute", param)
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
      let param = {
        vendername: this._globalVenderName,
        status: 1,
        venderId: this._venderLoginId
      };
      this.mineData = [];
      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/getMinesListByVenderId", param)
        .then(res => {
          res.data.body.list.forEach((el, i) => {
            var obj = {};
            obj.label = el.mineralname;
            obj.value = el.mineralname;
            obj.hasRoute = el.hasRoute;
            this.mineData.push(obj);
          });
        });
    },
    cleanMapOverlay() {
      this.polyline.editing = false;
      this.polyline.paths = [];
      this.markerPointArr = [];
    },
    toggle(name, state) {
      if (this.operationType == "editor") {
        this[name].editing = false;
        return;
      }
      if (!state) {
        this[name].editing = false;
        if (
          this.polyline.paths[this.polyline.paths.length - 1] ==
          this.venderAddress.coord
        ) {
          return;
        } else {
          this.polyline.paths.push(this.venderAddress.coord);
        }
        return;
      } else {
        this[name].editing = state;
      }
    },
    paintPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      if (this.polyline.paths.length % 1000 == 0) {
        var a = this.polyline.paths;
      }
      this.markerPointArr.push(e.point);
      this.polyline.paths.push(e.point);
    },
    handleSelectionChange() {},
    addMine() {
      this.getMines();
      this.TCSelectMine = "";
      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/checkVenderPositionHasExists", {
          venderId: this._venderLoginId
        })
        .then(res => {
          if (res.data.errorCode == 200) {
            this.venderAddress = res.data.body.info;
            var point = {
              lng: res.data.body.info.coord.split(",")[1],
              lat: res.data.body.info.coord.split(",")[0]
            };
            this.venderAddress.coord = point;
          } else {
            const conf = confirm("当前厂商位置不存在，是否跳转设置厂商位置？");
            if (conf) {
              this.$router.push("/warning/set");
              return;
            }
          }
        });
      this.operationType = "add";
      this.addmineTC = true;
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
      let param = {
        venderId: this._venderLoginId,
        createDate: this.sDate,
        pagesNo: typeof a == "number" ? a : 1,
        mine: this.mine ? this.mine : ""
      };
      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/getRouteList", param)
        .then(res => {
          res.data.body.list.records.forEach((el, i) => {
            el.status = el.status == 1 ? "开启" : "关闭";
          });
          this.tableData = res.data.body.list.records;
          this.total = res.data.body.list.total;
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
.addressinof {
  & > div {
    overflow: hidden;
    line-height: 36px;
    & > * {
      display: block;
      float: left;
    }
  }
}
.addmineTC {
  .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #303133;
    text-align: center;
    width: 100%;
    display: block;
  }
  .el-dialog__header {
    background: #fef3f3;
  }
  .el-dialog__header {
    padding: 10px;
  }
  .el-select {
    width: 360px !important;
  }
}
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
  .el-dialog__title {
    padding-left: 20px;
  }
  .el-dialog__body {
    height: 100%;
    .po-re {
      height: 100%;
    }
  }
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
    width: 100%;
    height: 100%;
    margin-top: 0vh !important;
    margin-bottom: 0 !important;
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
<style lang="less" scoped>
.tcaddBtn {
  width: 300px;
  height: 60px;
  background: linear-gradient(
    0deg,
    rgba(6, 113, 175, 1) 0%,
    rgba(29, 90, 203, 1) 100%
  );
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 24px;
  margin: 0 auto;
  display: block;
  margin-bottom: 30px;
}
.venderA {
  p {
    &:not(.title) {
      margin: 50px 0;
      text-align: center;
      font-size: 18px;
      color: #666;
      span {
        color: rgba(0, 0, 0, 1);
      }
    }
  }
}
.tcList {
  clear: both;
  overflow: hidden;
  .title {
    position: relative;
    padding-left: 20px;
    font-size: 16px;
    &::before {
      content: "";
      display: block;
      width: 3px;
      height: 16px;
      background: #1296db;
      position: absolute;
      left: 5px;
      top: 3px;
    }
  }
}
.selectMine,
.mineAddress {
  padding-left: 30px;
  overflow: hidden;
  float: left;
  line-height: 50px;
  & > * {
    float: left;
  }
  span {
    margin-right: 12px;
  }
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
  top: 110px;
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
  top: 200px;
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