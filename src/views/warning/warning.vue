<template>
  <div class="warning">
    <div class>
      <div class="selectOption">
        <span style="float: left;line-height: 40px;">筛选：</span>
        <el-date-picker
          v-model="startDate"
          type="date"
          placeholder="开始时间"
          value-format="yyyy-MM-dd"
          class="fl-l"
        ></el-date-picker>

        <el-date-picker
          v-model="endDate"
          type="date"
          placeholder="结束时间日期"
          value-format="yyyy-MM-dd"
          class="fl-l"
        ></el-date-picker>

        <el-select v-model="read" placeholder="请选择阅读状态" style="width: 180px">
          <el-option
            v-for="item in readState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="warning" placeholder="报警类型" style="width: 180px">
          <el-option
            v-for="item in warningState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="sortDate" placeholder="选择倒序排列时间" style="width: 180px">
          <el-option
            v-for="item in sortDateState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input class="carNumber" placeholder="输入车牌号" v-model="driverNumber" clearable></el-input>
        <!-- <span>重置</span> -->
        <span @click="operationSome" style="cursor:pointer; color: #4596db">标记所选项为已读</span>
        <span style="font-size: 12px;" class="fl-r">
          <img
            src="../../assets/images/tips.png"
            alt
            width="16px;"
            height="16px;"
            style="position: relative;top: 4px;"
          />
          共{{dataLength}}条报警信息
        </span>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="selectFn"
        :stripe="stripe"
        :border="border"
        @select="selectFn"
        @select-all="selectFn"
      >
        <el-table-column type="selection" width="60"></el-table-column>
        <!-- <el-table-column label="序号" width="120">
          <template slot-scope="scope">{{scope.$index+1 }}</template>
        </el-table-column>-->
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column prop="platenum" label="车牌号"></el-table-column>
        <el-table-column prop="appointmentdate" label="预约卸货时间"></el-table-column>
        <el-table-column prop="mines" label="预约矿点"></el-table-column>
        <el-table-column prop="commandmsg" label="报警类型"></el-table-column>
        <el-table-column prop="eventtime" label="报警时间"></el-table-column>
        <el-table-column prop="hasread" label="已读状态" width="120"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.hasread == '已读'"></span>
            <span v-else @click="operationread(scope.row, scope.$index)">标记为已读</span>
            <span @click="operationInfo(scope.row)">详情</span>
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

      <el-dialog title="报警详情" :visible.sync="dialogVisible" width="60%" style="text-align: center;">
        <div class="box">
          <div>
            <p class="title">报警信息</p>
            <div>
              <div class="row first">
                <p>
                  <span>报警类型：</span>
                  {{infoData.commandmsg}}
                </p>
                <p>
                  <span>报警位置：</span>
                  <a href="#" @click="openMap(infoData)">点击查看</a>
                </p>
              </div>
              <div class="row">
                <p>
                  <span>报警时间：</span>
                  {{infoData.eventtime}}
                </p>
                <p>
                  <span>已读状态：</span>
                  {{infoData.hasread}}
                </p>
              </div>
              <div class="row" v-if="infoData.commandmsg == '停车超时'">
                <p>
                  <span>开始时间：</span>
                  {{infoData.bte}}
                </p>
                <p>
                  <span>结束时间：</span>
                  {{infoData.ete}}
                </p>
              </div>
              <div class="row" v-if="infoData.commandmsg == '停车超时'">
                <p>
                  <span>停车时长：</span>
                  {{infoData.parkMins}}分钟
                </p>
              </div>
            </div>
          </div>
          <div class="type-two">
            <p class="title">车辆信息</p>
            <div>
              <div class="row first">
                <p>
                  <span>车牌号：</span>
                  {{infoData.platenum}}
                </p>
                <p>
                  <span>司机姓名：</span>
                  {{infoData.appname}}
                </p>
              </div>

              <div class="row">
                <p>
                  <span>手机号：</span>
                  {{infoData.appmobile}}
                </p>
                <p>
                  <span>供应单位：</span>
                  {{infoData.companyname}}
                </p>
              </div>
              <div class="row">
                <p>
                  <span>货品名称：</span>
                  {{infoData.appointmentproduct}}
                </p>
                <p>
                  <span>预约矿点：</span>
                  {{infoData.mines}}
                </p>
              </div>

              <div class="row">
                <p>
                  <span>预约卸货时间：</span>
                  {{infoData.appointmentdate}}
                </p>
                <p>
                  <span>皮重（吨）：</span>
                  {{infoData.tare}}
                </p>
              </div>
              <div class="row">
                <p>
                  <span>毛重（吨）：</span>
                  {{infoData.rough}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="isShow" title="报警位置" style="text-align: center" @close="mapClose">
        <baidu-map
          :class="{isShow: isShow}"
          class="map"
          :center="mapPoint"
          :zoom="13"
          :style="{width: width,height: height}"
          :scroll-wheel-zoom="true"
        >
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
          ></bm-geolocation>
          <bm-marker :position="mapPoint" @click="infoWindowOpen">
            <bm-info-window
              :show="infoWindowState"
              :title="infoWindowDetails.divernumber"
              @clickclose="infoWindowClose"
              :offset="{width: 0, height: -15}"
            >
            <p v-if="rowDataType == '路线偏离'" style="color: red;"><img style="margin-left: 10px;" width="26px;" src="../../assets/images/warningIcon.png" alt="">&nbsp;&nbsp;&nbsp;偏离距离：<span style="font-size: 26px;">{{infoWindowDetails.version}}</span>米</p>
              <ul class="merkerInfo">
                <li>
                  <span style="display: inline-block;width: 80px;text-align: right; color: #666">车牌号：</span>
                  <span>{{infoWindowDetails.platenum}}</span>
                </li>
                <li>
                  <span style="display: inline-block;width: 80px;text-align: right; color: #666">报警时间：</span>
                  <span>{{infoWindowDetails.eventtime}}</span>
                </li>
                <li>
                  <span style="display: inline-block;width: 80px;text-align: right; color: #666">报警地址：</span>
                  <span>{{infoWindowDetails.address}}</span>
                </li>
              </ul>
            </bm-info-window>
          </bm-marker>
          <bm-marker v-if="startPoint.lng" :icon="satrticon" :position="startPoint"></bm-marker>
          <bm-marker v-if="endPoint.lng" :icon="endicon" :position="endPoint"></bm-marker>
          <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="8"></bm-polyline>
        </baidu-map>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const iconStart = require("../../assets/images/icon-start.png");
const iconEnd = require("../../assets/images/icon-end.png");
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 0,
      dialogVisible: false,
      stripe: true,
      border: true,
      dataLength: null,
      driverNumber: "",
      isShow: false,
      startPoint: "",
      endPoint: "",
      carLabelIndex: -1,
      mapPoint: {
        lat: 39.913828,
        lng: 116.403119
      },
      satrticon: {
        url: iconStart,
        size: { width: 32, height: 32 }
      },
      endicon: {
        url: iconEnd,
        size: { width: 32, height: 32 }
      },
      width: "100%",
      height: "500px",
      ids: [],
      infoData: [],
      idstr: "",
      startDate: this.PF.getToDay(),
      endDate: this.PF.getToDay(),
      readState: [
        {
          label: "请选择阅读状态",
          value: 2
        },
        {
          label: "已读",
          value: 1
        },
        {
          label: "未读",
          value: 0
        }
      ],
      read: "",
      warningState: [
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
          value: 12
        },
        {
          label: "断电报警",
          value: 2
        },
        {
          label: "GPS故障",
          value: 11
        }
      ],
      warning: "",
      sortDateState: [
        {
          label: "请选择倒序排列时间",
          value: 0
        },
        {
          label: "预约卸货时间",
          value: "appointmentdate"
        },
        {
          label: "报警时间",
          value: "eventtime"
        }
      ],
      sortDate: "",
      tableData: [],
      path: [],
      infoWindowState: false,
      infoWindowDetails: "",
      rowDataType: ""
    };
  },
  computed: mapState({
    _venderLoginId: state => state._venderLoginId
  }),
  methods: {
    indexMethod(index) {
      // console.log(index)
      return index + 1;
      // return index * 2;
    },
    infoWindowClose() {
      this.infoWindowState = false;
    },
    infoWindowOpen() {
      this.infoWindowState = true;
    },
    operationSome() {
      if (this.ids.length == 0) {
        this.$alert("请选择需要操作的数据");
        return;
      }
      this.operationread(this.ids.join(","));
    },
    selectFn(selection, row) {
      this.ids = [];
      selection.forEach(el => {
        this.ids.push(el.id);
      });
    },
    operationread(a, b) {
      var param;
      if (a.id) {
        param = this.qs.stringify({
          ids: a.id
        });
      } else {
        param = this.qs.stringify({
          ids: a
        });
      }
      this.ajax
        .post(this.PF.towAPIUrl + "/waringInfoApi/updateWaring", param)
        .then(res => {
          if (res.data.errorCode == 200) {
            this.$alert(res.data.msg);
            this.getData();
          }
        });
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
        pagesNo: a ? a : 1
      });
      this.ajax
        .post(this.PF.towAPIUrl + "/waringInfoApi/getWaringList", param)
        .then(res => {
          res.data.body.result.forEach(el => {
            el.appointmentdate = el.appointmentdate
              ? this.PF.parseDate(el.appointmentdate)
              : "-";
            el.hasread = el.hasread ? "已读" : "未读";
          });
          this.dataLength = res.data.body.size;
          this.tableData = res.data.body.result;
        });
    },
    operationInfo(data, i) {
      this.dialogVisible = true;
      this.infoData = data;

      // this.tableData = data;
    },
    openMap(a) {
      this.rowDataType = a.commandmsg;
      this.startPoint = "";
      this.endPoint = "";
      var _self = this;
      if (a.lat == "" || a.lng == "") {
        alert("查询不到位置信息");
        return;
      }
      this.infoWindowDetails = a;
      if(a.commandmsg == "路线偏离"){
        this.infoWindowState = true;
      }
      if (a.commandmsg == "路线偏离" || a.commandmsg == "停车超时") {
        console.log(a)
        this.path = [];
        let param = {
          venderId: this._venderLoginId,
          type: a.appointmentdate ? 2 : 1,
          mine: a.mines
        };
        this.ajax
          .post(this.PF.towAPIUrl + "waringInfoApi/waringRout", param)
          .then(res => {
            if (res.data.errorCode == 200) {
              console.log(res)
              setTimeout(() => {
                if(res.data.body.list.length <= 0){
                  return
                }
                _self.path = res.data.body.list;
                _self.startPoint = res.data.body.list[0];
                _self.endPoint =
                  res.data.body.list[res.data.body.list.length - 1];
                console.log(_self.startPoint);
              }, 100);
            } else {
              this.$alert(res.data.msg);
            }
          });
      }
      setTimeout(() => {
        _self.mapPoint = {
          lng: a.lng,
          lat: a.lat
        };
      }, 100);
      this.isShow = true;
    },
    mapClose() {
      this.infoWindowState = false;
      this.path = [];
    }
  },
  watch: {
    currentPage() {
      debugger
      console.log(this.pageSize * this.currentPage)
      this.indexMethod(this.pageSize * this.currentPage);
    },
    startDate() {
      this.getData();
    },
    endDate() {
      this.getData();
    },
    read() {
      this.getData();
    },
    warning() {
      this.getData();
    },
    sortDate() {
      this.getData();
    },
    driverNumber() {
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="less">

@media(max-width: 1660px){

}
.warning {
  .el-table td,
  th {
    text-align: center;
    font-size: 17px;
    color: #000
  }
}
.el-dialog__body {
  padding-top: 20px;
}
</style>
<style lang="less" scoped>
.first {
  margin-top: 20px;
}
.type-two {
  margin-top: 30px;
}
.box {
  padding: 0 20px;
  text-align: left;
  .title {
    border-bottom: solid 1px #ccc;
    padding-left: 12px;
    position: relative;
    height: 52px;
    line-height: 52px;
    font-size: 18px;
    margin: 0;
    &::before {
      content: "";
      display: block;
      width: 4px;
      height: 20px;
      background: #4caff0;
      position: absolute;
      top: 16px;
      left: 0px;
    }
  }
  .row {
    overflow: hidden;
    p {
      width: 50%;
      float: left;
      font-weight: bold;
      font-size: 16px;
      span {
        font-weight: normal;
        margin-right: 26px;
        width: 120px;
        text-align: right;
        display: inline-block;
      }
    }
  }
}
td {
  span {
    color: cornflowerblue;
    margin-right: 16px;
    cursor: pointer;
  }
}
.left {
  width: 210px;
  .active {
    background: white;
  }
  .title {
    text-align: center;
    height: 66px;
    line-height: 66px;
    margin: 0;
  }
  li {
    text-align: center;
    background: #ece4d9;
    border-bottom: solid 1px #ccc;
    width: 100%;
    height: 66px;
    line-height: 66px;
    cursor: pointer;
  }
}
.right {
  width: calc(100% - 250px);
  margin: 0 20px;
  .carNumber {
    width: 12%;
  }
  input {
    width: 120px !important;
  }
  .selectOption {
    margin-bottom: 30px;
    & > * {
      margin-right: 12px;
    }
  }
}
.el-table .cell {
  text-align: center;
}
</style>
