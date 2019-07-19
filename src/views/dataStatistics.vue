<template>
  <div>
    <div class="dataInfo fl-l" :style="{width: leftWidth}">
      <div class="top">
        <img class="fl-l" src="../assets/images/flag.png" alt width="19px" height="29px;" />
        <span class="fl-l selectDate">选择日期</span>
        <el-date-picker
          class="fl-l dateInput"
          v-model="date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="dateFn"
        ></el-date-picker>
        <span class="fl-r fc-r">
          <img
            src="../assets/images/tips.png"
            alt
            width="14px;"
            height="14px;"
            style="position:relative;top: 3px;"
          />
          小提醒，请选择时间，用来查询数据
        </span>
      </div>
      <div class="table">
        <p class="title">{{_this_venderName ? _this_venderName : "当日全部矿点"}}</p>

        <div class="dataList">
          <p>当日预报</p>
          <div>
            <div class="fl-l">
              <span class="number">{{tabData.notice.carN}}</span>
              <span class="type">车数</span>
            </div>
            <div class="fl-r">
              <span class="number">{{tabData.notice.tons}}</span>
              <span class="type">吨数</span>
            </div>
          </div>
        </div>

        <div class="dataList">
          <p>当日预约</p>
          <div>
            <div class="fl-l">
              <span class="number">{{tabData.appointment.carN}}</span>
              <span class="type">车数</span>
            </div>
            <div class="fl-r">
              <span class="number">{{tabData.appointment.tons}}</span>
              <span class="type">吨数</span>
            </div>
          </div>
        </div>

        <div class="dataList">
          <p>在途中</p>
          <div>
            <div class="fl-l">
              <span class="number">{{tabData.onroad.carN}}</span>
              <span class="type">车数</span>
            </div>
            <div class="fl-r">
              <span class="number">{{tabData.onroad.tons}}</span>
              <span class="type">吨数</span>
            </div>
          </div>
        </div>

        <div class="dataList">
          <p>排队中</p>
          <div>
            <div class="fl-l">
              <span class="number">{{tabData.onqueue.carN}}</span>
              <span class="type">车数</span>
            </div>
            <div class="fl-r">
              <span class="number">{{tabData.onqueue.tons}}</span>
              <span class="type">吨数</span>
            </div>
          </div>
        </div>

        <div class="dataList">
          <p>已进厂</p>
          <div>
            <div class="fl-l">
              <span class="number">{{tabData.enteredfactory.carN}}</span>
              <span class="type">车数</span>
            </div>
            <div class="fl-r">
              <span class="number">{{tabData.enteredfactory.tons}}</span>
              <span class="type">吨数</span>
            </div>
          </div>
        </div>

        <div class="dataList">
          <p>围栏内</p>
          <div>
            <div class="fl-l">
              <span class="number">{{tabData.inCircle.carN}}</span>
              <span class="type">车数</span>
            </div>
            <div class="fl-r">
              <span class="number">{{tabData.inCircle.tons}}</span>
              <span class="type">吨数</span>
            </div>
          </div>
        </div>
      </div>
      <div class="charts">
        <div class="fl-l">
          <p class="title">数据统计及走势图(当日全部矿点)</p>
          <v-chart
            class="chart1 fl-l"
            ref="chart1"
            :options="orgOptions"
            :auto-resize="true"
            style="height: 340px;margin-top: 20px;"
          ></v-chart>
          <div class="options fl-l">
            <input
              type="button"
              v-for="(nav, i) of options"
              :key="i"
              :value="nav"
              @click="echartOption(i)"
              :class="{inpActive: inpI == i}"
            />
          </div>
          <div style="clear:both; width: 100%">数据日期：{{date}}</div>
        </div>
        <div class="fl-r">
          <p class="title">当日数据比例图</p>
          <v-chart :options="polar" style="margin-top: 20px;height: 340px"></v-chart>
          <div style="clear:both">数据日期：{{date}}</div>
        </div>
      </div>
    </div>
    <right-data-list style="float: right" :pageType="pageType" @allData="getData" :total="total"></right-data-list>
  </div>
</template>

<script>
import ECharts from "vue-echarts/components/ECharts";

import "echarts";

import RightDataList from "../components/rightDataList";
import { mapState, mapMutations } from "vuex";
import { debuglog } from "util";
import { constants } from "crypto";
import BigNumber from "bignumber.js";

export default {
  data() {
    return {
      options: ["今日预约", "已进厂", "今日预报"],
      date: "",
      pageType: "dataStatistics",
      orgOptions: {},
      pieDataArr: [],
      Param: {},
      chartNoticeArr: [],
      inpI: 0,
      chartAppointmentArr: [],
      chartEnteredfactoryArr: [],
      venderList: [],
      copyData: {},
      venderName: "",
      tabData: {
        onroad: {
          carN: 0,
          tons: 0
        },
        onqueue: {
          carN: 0,
          tons: 0
        },
        enteredfactory: {
          carN: 0,
          tons: 0
        },
        inCircle: {
          carN: 0,
          tons: 0
        },
        notice: {
          carN: 0,
          tons: 0
        },
        appointment: { carN: 0, tons: 0 }
      },
      pieTypeArr: [
        "当日预报",
        "当日预约",
        "在途中",
        "排队中",
        "已进厂",
        "围栏内"
      ],
      polar: {},
      leftWidth: "76%",
      total: ''
    };
  },
  created() {
    // this.getData()
  },
  components: {
    RightDataList,
    "v-chart": ECharts
  },
  mounted() {
    this.date = this.PF.getToDay();
    this.getData();
  },
  computed: mapState({
    _this_tabType: state => state._tabType,
    _this_venderList: state => state._venderList,
    _this_venderName: state => state._venderName,
    _venderLoginId: state => state._venderLoginId,
    _isShowRight: state => state._isShowRight
  }),
  watch: {
    _this_tabType() {
      this.getData();
    },
    _isShowRight() {
      this.leftWidth = this._isShowRight ? "100%" : "76%";
    },
    _this_venderName() {
      for (let key in this.copyData) {
        for (let k in this.copyData[key]) {
          if (k == this._this_venderName) {
            this.initData();
            let a = this.copyData[key][k];
            let obj = {
              onroad: {
                carN: 0,
                tons: 0
              },
              onqueue: {
                carN: 0,
                tons: 0
              },
              enteredfactory: {
                carN: 0,
                tons: 0
              },
              inCircle: {
                carN: 0,
                tons: 0
              },
              notice: {
                carN: 0,
                tons: 0
              },
              appointment: {
                carN: 0,
                tons: 0
              }
            };

            obj.onroad.carN += parseFloat(a.onRoadNum);
            obj.onroad.tons += parseFloat(a.onRoadTons);

            obj.onqueue.carN += parseFloat(a.queuenums);
            obj.onqueue.tons += parseFloat(a.queuetons);

            obj.enteredfactory.carN += parseFloat(a.enteredfactory);
            obj.enteredfactory.tons += parseFloat(a.enteredfactorytons);

            obj.inCircle.carN += parseFloat(a.inCircle);
            obj.inCircle.tons += parseFloat(a.inCircleTons);

            obj.notice.carN += parseFloat(a.noticeVehicle);
            obj.notice.tons += parseFloat(a.noticeTons);

            obj.appointment.carN += parseFloat(a.totalVehicle);
            obj.appointment.tons += parseFloat(a.tons);
            for (let key in obj) {
              for (let s in obj[key]) {
                if (isNaN(obj[key][s])) {
                  obj[key][s] = "-";
                }
              }
            }

            this.tabData = obj;
          }
        }
      }
    }
  },
  methods: {
    setPie(arr) {
      this.polar = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: this.pieTypeArr
        },
        series: [
          {
            // name: "",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: arr
          }
        ]
      };
    },
    setEcharts(xData, yData) {
      this.orgOptions = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xData,
            axisTick: {
              alignWithLabel: true
            },

            axisLabel: {
              interval: 0,
              rotate: -40
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "车数",
            type: "bar",
            barWidth: "60%",
            data: yData
            // barMaxWidth: "20%"
          }
        ]
      };
    },
    dateFn(a) {
      this.date = a;
      this.getData();
    },
    initData() {
      this.tabData = {
        onroad: {
          carN: 0,
          tons: 0
        },
        onqueue: {
          carN: 0,
          tons: 0
        },
        enteredfactory: {
          carN: 0,
          tons: 0
        },
        inCircle: {
          carN: 0,
          tons: 0
        },
        notice: {
          carN: 0,
          tons: 0
        },
        appointment: {
          carN: 0,
          tons: 0
        }
      };
    },
    ...mapMutations(["_changeVender"]),
    _changeVender(a) {
      this.$store.commit("_changeVender", a);
    },
    parseData(data) {
      this.chartNoticeArr = [];
      this.chartAppointmentArr = [];
      this.chartEnteredfactoryArr = [];
      this.pieDataArr = [];
      let obj = {
        onroad: {
          carN: 0,
          tons: 0
        },
        onqueue: {
          carN: 0,
          tons: 0
        },
        enteredfactory: {
          carN: 0,
          tons: 0
        },
        inCircle: {
          carN: 0,
          tons: 0
        },
        notice: {
          carN: 0,
          tons: 0
        },
        appointment: {
          carN: 0,
          tons: 0
        }
      };
      data.forEach((el, i) => {
        for (let s in el) {
          this.chartNoticeArr.push(el[s].noticeVehicle);
          this.chartAppointmentArr.push(el[s].totalVehicle);
          this.chartEnteredfactoryArr.push(el[s].enteredfactory);

          obj.onroad.carN += el[s].onRoadNum * 10000;
          obj.onroad.tons += el[s].onRoadTons * 10000;
          obj.onqueue.carN += el[s].queuenums * 10000;
          obj.onqueue.tons += el[s].queuetons * 10000;
          obj.enteredfactory.carN += el[s].enteredfactory * 10000;
          obj.enteredfactory.tons += el[s].enteredfactorytons * 10000;
          obj.inCircle.carN += el[s].inCircle * 10000;
          obj.inCircle.tons += el[s].inCircleTons * 10000;
          obj.notice.carN += el[s].noticeVehicle * 10000;
          obj.notice.tons += el[s].noticeTons * 10000;
          obj.appointment.carN += el[s].totalVehicle * 10000;
          obj.appointment.tons += el[s].tons * 10000;
        }
      });
      obj.onroad.carN = obj.onroad.carN / 10000;
      obj.onroad.tons = obj.onroad.tons / 10000;
      obj.onqueue.carN = obj.onqueue.carN / 10000;
      obj.onqueue.tons = obj.onqueue.tons / 10000;
      obj.enteredfactory.carN = obj.enteredfactory.carN / 10000;
      obj.enteredfactory.tons = obj.enteredfactory.tons / 10000;
      obj.inCircle.carN = obj.inCircle.carN / 10000;
      obj.inCircle.tons = obj.inCircle.tons / 10000;
      obj.notice.carN = obj.notice.carN / 10000;
      obj.notice.tons = obj.notice.tons / 10000;
      obj.appointment.carN = obj.appointment.carN / 10000;
      obj.appointment.tons = obj.appointment.tons / 10000;
      this.pieDataArr.push(
        obj.notice.carN,
        obj.appointment.carN,
        obj.onroad.carN,
        obj.onqueue.carN,
        obj.enteredfactory.carN,
        obj.inCircle.carN
      );
      for (let key in obj) {
        for (let s in obj[key]) {
          if (isNaN(obj[key][s])) {
            obj[key][s] = "-";
          }
        }
      }
      var pieArr = [];
      for (let i = 0; i < this.pieDataArr.length; i++) {
        var pieObj = {};
        pieObj.value = this.pieDataArr[i];
        pieObj.name = this.pieTypeArr[i];
        pieArr.push(pieObj);
      }
      this.setPie(pieArr);
      this.setEcharts(
        this.PF.intercept(this._this_venderList, 5),
        this.chartEnteredfactoryArr
      );
      this.tabData = obj;
    },
    getData() {
      this.loading();
      var vl = [];
      let param = this.qs.stringify({
        venderId: this._venderLoginId,
        appointDate: this.date,
        type: this._this_tabType
      });
      this.ajax
        .post("/monitorApi/onRoadMonitorStatistics", param)
        .then(res => {
          this.initData();
          res.data.body.result.forEach((el, i) => {
            for (let s in el) {
              vl.push(s);
            }
          });
          vl = this.PF.intercept(vl, 15);
          this._changeVender(vl);
          let a = res.data.body.result;
          a.forEach((el, i) => {
            for (let k in el) {
              if (k.length > 15) {
                let s = el[k];
                let kk = k.replace(k.slice(15), "...");
                delete el[k];
                el[kk] = s;
              }
            }
          });
          this.copyData = res.data.body.result;
          this.parseData(res.data.body.result);
          this.loading().close();
        })
        .catch(err => {
          console.log(err);
        });
    },
    echartOption(type) {
      this.inpI = type;
      if (type == 0) {
        this.setEcharts(
          this.PF.intercept(this._this_venderList, 5),
          this.chartEnteredfactoryArr
        );
      } else if (type == 1) {
        this.setEcharts(
          this.PF.intercept(this._this_venderList, 5),
          this.chartAppointmentArr
        );
      } else {
        this.setEcharts(
          this.PF.intercept(this._this_venderList, 5),
          this.chartNoticeArr
        );
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-input__inner {
  border: solid 1px #1296db;
}
.dataInfo {
  width: 76%;
  margin-left: 4%;
  border-right: solid 1px #ccc;
  transition: width .6s;
  .top {
    height: 60px;
    border-bottom: dashed 1px #ccc;
    & > img {
      margin-top: 16px;
      margin-right: 30px;
    }
    span.fl-r {
      font-size: 12px;
    }
    .selectDate {
      line-height: 60px;
    }
    .dateInput {
      margin-top: 10px;
      margin-left: 18px;
    }
    .fl-r {
      line-height: 60px;
      margin-right: 120px;
    }
  }
  .table {
    overflow: hidden;
    .dataList {
      float: left;
      width: 28%;
      margin: 26px 3% 0 0;
      border: solid 1px #ccc;
      text-align: center;
      height: 136px;
      border-radius: 6px;
      & > div > div {
        width: 50%;
        text-align: center;
        span {
          display: block;
          font-size: 14px;
        }
        .number {
          font-size: 24px;
        }
      }
      & > div > .fl-l {
        position: relative;
        &::after {
          position: absolute;
          content: "";
          display: block;
          width: 1px;
          height: 20px;
          background: #ccc;
          right: 0;
          top: 50%;
        }
      }
    }
  }
  .charts {
    border-top: dashed 1px #ccc;
    margin-top: 20px;
    .fl-l {
      .options {
        input {
          clear: both;
          display: block;
          margin: 12px 0;
          width: 100px;
          background: white;
          border: solid 1px #ccc;
          border-radius: 3px;
          height: 32px;
          line-height: 32px;
          cursor: pointer;
          &:focus {
            background: #1296db;
            color: white;
            border: #1296db solid 1px;
          }
          &.inpActive {
            background: #1296db;
            color: white;
            border: #1296db solid 1px;
          }
        }
      }
    }
  }
  .title {
    position: relative;
    font-size: 22px;
    margin-left: 20px;
    color: #1296db;
    margin-bottom: 0;
    &::before {
      position: absolute;
      top: 4px;
      left: -20px;
      content: "";
      display: block;
      width: 6px;
      height: 26px;
      background: #1296db;
    }
  }
}
</style>
