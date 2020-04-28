<template>
  <div class="montioring trajectory">
    <div class="map po-re" :style="{width: mapWidth}">
      <div v-if="_trajectoryState" class="info po-ab" :class="{closeState: closeState}">
        <div class="carN">{{_saveDiverInfo.diverNumber}}</div>
        <div class="date">
          开始时间：
          <span class="startDate">{{_saveDiverInfo.startDate}}</span>
          <img src="../assets/images/topjt-b.png" alt="开始结束时间" style="margin: 0 16px;" />
          结束时间：
          <span class="endDate">{{_saveDiverInfo.endDate}}</span>
        </div>
        <div class="gjhf">
          <span>轨迹回放：</span>
          <img
            style="width: 26px;margin-top:16px;"
            @click="videoEvent"
            v-if="!play"
            src="../assets/images/video-play.png"
            alt
          />
          <img
            style="width: 26px;margin-top:16px;"
            @click="videoEvent"
            v-else
            src="../assets/images/video-stop.png"
            alt
          />
        </div>
        <el-button class="moregj" type="text" @click="addpl">添加路线偏离</el-button>
        <el-button class="moregj" type="text" @click="more">更多轨迹</el-button>

        <div class="shrink">
          <div v-if="shrink" class="open shrink_btn" @click="shrinkFn">
            <img src="../assets/images/open-active.png" alt />
            <img src="../assets/images/open-h.png" alt />
          </div>
          <div v-else class="close shrink_btn" @click="shrinkFn">
            <img src="../assets/images/close-active.png" alt />
            <img src="../assets/images/close-h.png" alt />
          </div>
        </div>
      </div>

      <baidu-map
        class="map"
        :center="startPoint"
        :zoom="11"
        :style="{width: width,height: height}"
        :scroll-wheel-zoom="true"
        @ready="handleSearchComplete"
      >
        <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
        <!-- 跳动 -->
        <!--  animation="BMAP_ANIMATION_BOUNCE" -->
        <bm-marker
          v-if="path.length > 2"
          :position="startPoint"
          :icon="satrticon"
          :zIndex="marker1"
        ></bm-marker>
        <bm-marker v-if="path.length > 2" :position="endPoint" :icon="endicon" :zIndex="marker2"></bm-marker>
        <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="8"></bm-polyline>
        <bml-lushu
          @stop="reset"
          :path="path"
          :icon="icon"
          :play="play"
          :rotation="true"
          :zIndex="lushuZIndex"
        ></bml-lushu>
      </baidu-map>
    </div>
    <!-- 右边数据列表 -->
    <right-data-list :pageType="pageType" :total="total"></right-data-list>

    <el-dialog title="历史轨迹" :visible.sync="dialogVisible" width="60%">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="appointmentdate" label="预约时间" width="180"></el-table-column>
        <el-table-column prop="create_date" label="轨迹开始时间"></el-table-column>
        <el-table-column prop="mines" label="预约矿点"></el-table-column>
        <el-table-column prop="create_date" label="状态">已进厂</el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="lockPath(scope.$index, tableData)"
              type="text"
              size="small"
            >查看轨迹</el-button>
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
        @current-change="tabmore"
      ></el-pagination>
    </el-dialog>

    <el-dialog title=" 添加路线偏离" :visible.sync="pathdialog" width="30%" @close="addPathDialogClose">
      <div class="plBox">
        <div class="selectMine">
          <span>选择矿点：</span>
          <el-select v-model="SelectMine" placeholder="选择矿点" class="fl-l">
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
      <el-button
        type="primary"
        @click.native.prevent="addPlSubmit"
        style="display: block;
    margin: 0 auto;"
      >确认添加</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { log } from "util";
import RightDataList from "../components/rightDataList";
import { BmlLushu } from "vue-baidu-map";
const carIcon = require("../assets/images/car.png");
const iconStart = require("../assets/images/icon-start.png");
const iconEnd = require("../assets/images/icon-end.png");

import { mapState, mapMutations } from "vuex";
import { constants } from "crypto";

export default {
  data() {
    return {
      width: "100%",
      height: "896px",
      pageType: "trajectory",
      play: false,
      dialogVisible: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 0,
      page: 0,
      pathdialog: false,
      SelectMine: "",
      mineData: [],
      mineAddress: {
        coord: "",
        address: ""
      },
      startPoint: { lng: 116.4039539679, lat: 39.9150666134 },
      satrticon: {
        url: iconStart,
        size: { width: 32, height: 32 }
      },
      endicon: {
        url: iconEnd,
        size: { width: 32, height: 32 }
      },
      closeState: false,
      shrink: false,
      endPoint: { lng: 0, lat: 0 },
      path: [],
      icon: {
        url: carIcon,
        size: { width: 50, height: 19 }
      },
      marker2: 10,
      marker1: 20,
      lushuZIndex: 2,
      total: "",
      mapWidth: "80%"
    };
  },
  components: {
    RightDataList,
    BmlLushu
  },
  mounted() {},
  computed: mapState({
    _saveDiverInfo: state => state._saveDiverInfo,
    _lushuPath: state => state._lushuPath,
    _trajectoryState: state => state._trajectoryState,
    _venderLoginId: state => state._venderLoginId,
    _isShowRight: state => state._isShowRight,
    _globalVenderName: state => state.globalVenderName
  }),
  watch: {
    _lushuPath() {
      this.path = this._lushuPath;
      if (this.path.length < 2) {
        return;
      } else {
        this.startPoint = this.path[0];
        this.endPoint = this.path[this.path.length - 1];
      }
    },
    _trajectoryState() {
      if (!this._trajectoryState) {
        this.path = [];
      }
    },
    _isShowRight() {
      this.mapWidth = this._isShowRight ? "100%" : "80%";
    },
    SelectMine() {
      this.mineAddress.address = "";
      this.ajax
        .post(this.PF.towAPIUrl + "monitorApi/checkMinePositionHasExists", {
          venderId: this._venderLoginId,
          mine: this.SelectMine.value
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
  created() {
    this.getMines();
  },
  methods: {
    addPlSubmit() {
      if (this.SelectMine == "" || this.mineAddress.address == "") {
        this.$alert("请选择矿点");
        return;
      }


      
          let param = {
            venderId: this._venderLoginId,
            mine: this.SelectMine.value,
            routeInfo: this.path
          };
          this.ajax
            .post(this.PF.towAPIUrl + "monitorApi/inserRoute", param)
            .then(res => {
              if (res.data.errorCode == 200) {
                this.$alert("添加成功");
              } else {
                this.$alert(res.data.msg);
              }
              this.addPathDialogClose();
              this.pathdialog = false;
            });
        
      // if()
    },
    addPathDialogClose() {
      (this.SelectMine = ""), (this.mineAddress.address = "");
      this.token = "";
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
    tabmore(a) {
      this.dialogVisible = true;
      let param = this.qs.stringify({
        venderId: this._venderLoginId,
        diverNumber: this._saveDiverInfo.diverNumber,
        pagesNo: a - 1
      });
      this.ajax
        .post("/monitorApi/orbitOfHistoryInFactoryList", param)
        .then(res => {
          if (res.data.errorCode == 200) {
            this.total = res.data.body.totalquantity;
            this.tableData = res.data.body.resultList;
            this.total = res.data.body.resultList.length;
            this.total = res.data.body.size;
          } else {
            this.total = 0;
          }
        });
    },
    lockPath(a, b) {
      let param = this.qs.stringify({
        venderId: this._venderLoginId,
        diverNumber: this._saveDiverInfo.diverNumber,
        appointmentId: b[a].id,
        period: 2
      });

      this.ajax
        .post("/monitorApi/orbitOfAppointmentDriverNumber", param)
        .then(res => {
          var pathARR = this.PF.parsePath(res.data.body.content);
          this.path.length;
          let diverInfo = {
            diverNumber: res.data.body.diverNumber,
            startDate: res.data.body.startDate,
            endDate: res.data.body.endDate
          };
          this.$store.commit("_changeDiverNumber", diverInfo);
          this.path = pathARR;
          this.startPoint = this.path[0];
          this.endPoint = this.path[this.path.length - 1];
          this.dialogVisible = false;
        });
    },
    addpl() {
      const self = this;
      const a = this.$prompt("请输入6位有效口令", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: async (a, b) => {
          if (b.inputValue == null || b.inputValue == "") {
            return;
          }
          let param = this.qs.stringify({
            venderId: this._venderLoginId,
            command: b.inputValue.toLowerCase()
          });
          var res = await self.ajax.post("/monitorApi/checkCommand", param);
          //123456
          if (res.data.errorCode == 200) {
            self.pathdialog = true;
          } else {
            if (a == "cancel") {
              return;
            } else {
              this.$alert("口令有误");
            }
          }
          if (a === "confirm") {
          }
        }
      });
    },
    more() {
      this.dialogVisible = true;
      let param = this.qs.stringify({
        venderId: this._venderLoginId,
        diverNumber: this._saveDiverInfo.diverNumber,
        pagesNo: 0
      });
      this.ajax
        .post("/monitorApi/orbitOfHistoryInFactoryList", param)
        .then(res => {
          if (res.data.errorCode == 200) {
            this.tableData = res.data.body.resultList;
            this.total = res.data.body.size;
          }
        });
    },
    shrinkFn() {
      this.shrink = !this.shrink;
      this.closeState = !this.closeState;
    },
    reset() {
      this.play = false;
    },
    videoEvent() {
      this.play = !this.play;
    },
    handleSearchComplete(res) {
      this.marker2 = 10;
      this.marker1 = 10;
      this.lushuZIndex = 2;
    }
  }
};
</script>
<style lang="less">
.trajectory {
  .el-dialog{
    margin-top: 28vh !important;
  }
  .el-dialog__body{
    min-height: 300px;
    .el-button{
      margin-top: 30px !important;
    }
  }
  .tokenBox {
    overflow: hidden;
    clear: both;
    margin: 20px 0;
  }
}
</style>
<style lang="less" scoped>
.plBox {
  overflow: hidden;
  & > div {
    span {
      width: 100px;
      text-align: right;
    }
  }
}
.selectMine,
.tokenBox,
.mineAddress {
  padding-left: 30px;
  overflow: hidden;
  margin: 30px 0;
  line-height: 50px;
  & > * {
    float: left;
  }
  span {
    margin-right: 12px;
  }
}
.operation {
  color: #1296db;
}
.montioring {
  overflow: hidden;
  width: 100%;
  & > * {
    float: left;
    display: block;
  }
  .map {
    width: 80%;
    transition: width 0.6s;
    .info {
      color: white;
      display: flex;
      justify-content: space-around;
      top: 0;
      left: 0;
      height: 60px;
      z-index: 2;
      width: 100%;
      background: white;
      border-bottom: solid 1px #ccc;
      transition: width 0.2s, height 0.8s, left 0.2s;
      overflow: hidden;
      color: #333;
      .carN {
        width: 160px;
        height: 50px;
        background: url("../assets/images/carBg.png") no-repeat 0 0;
        background-size: 100% 100%;
        margin-top: 4px;
        text-align: center;
        font-size: 22px;
        line-height: 50px;
        max-height: 50px;
      }
      .carN {
        opacity: 1;
        height: auto;
        transition: all 1.3s;
      }
      .date {
        opacity: 1;
        height: auto;
        transition: all 1.3s;
        line-height: 50px;
        span {
          font-size: 18px;
        }
      }
      .moregj {
        opacity: 1;
        height: auto;
        transition: all 0.3s;
        margin-right: 40px;
      }
      .gjhf {
        color: #028445;
        line-height: 59px;
        opacity: 1;
        height: auto;
        transition: all 1.3s;
        & > * {
          display: block;
          float: left;
        }
        span {
          margin-left: 12px;
        }
        img {
          cursor: pointer;
        }
      }
      .shrink {
        top: 96px;
        right: 430px;
        position: fixed;
        z-index: 10;
        .shrink_btn {
          &:hover img {
            &:nth-child(1) {
              display: block;
            }
            &:nth-child(2) {
              display: none;
            }
          }
          img {
            width: 12px;
            height: 12px;
            cursor: pointer;
            &:nth-child(1) {
              display: none;
            }
            &:nth-child(2) {
              display: block;
            }
          }
        }
      }
    }
    .closeState {
      width: 36px;
      height: 26px;
      left: 50%;
      margin-left: -10px;
      border-radius: 0 0 3px 3px;
      .shrink {
        right: 59.3%;
        top: 80px;
        position: fixed;
      }
      .carN {
        height: 0;
        opacity: 0;
      }
      .date {
        height: 0;
        opacity: 0;
      }
      .gjhf {
        height: 0;
        opacity: 0;
      }
      .moregj {
        height: 0;
        opacity: 0;
      }
    }
  }
}
</style>
