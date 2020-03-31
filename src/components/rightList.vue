<template>
  <!-- 右边数据列表 -->
  <div>
    <div v-if="pageType == 'trajectory'" style="overflow: hidden">
      <p class="fl-l" style="margin-right: 16px;margin-left: 12px;">选择预约时间</p>
      <el-date-picker
        style="margin-top:6px;"
        v-model="date"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        class="fl-l"
      ></el-date-picker>
    </div>
    <ul class="venderListBox" v-if="pageType == 'dataStatistics'">
      <li
        :class="{navI: navIndex == i}"
        v-for="(el, i) of _venderList"
        :key="i"
        @click="selectVender(el, i)"
      >{{el}}</li>
    </ul>
    <ul v-else class="dataList" :class="{trag: pageType == 'trajectory'}">
      <li v-for="(item, index) in _list" :key="index" @click.stop="mineral(index, item)">
        <div class="partInfo" v-if="mineralI != index">
          <p
            v-if="item.companyname.length > 15"
            class="name"
          >{{item.companyname.replace(item.companyname.slice(15), "...")}}</p>
          <p v-else class="name">{{item.companyname}}</p>
          <p class="fc-r fl-r">共{{item.carList.length}}车</p>
        </div>
        <div class="mainIn" v-else>
          <p class="mainTitle">
            <span>{{item.companyname}}</span>
            <span class="fl-r">共{{item.carList.length}}车</span>
          </p>
          <ul class="carListBox">
            <li
              v-for="(item, i) in item.carList"
              :key="i"
              @click.stop="_changeCarLabelState(item, i)"
              :class="{traje: pageType == 'trajectory', carListActive: carListActive == i}"
            >
              <div class="number">
                <span>{{i+1}}</span>
              </div>
              <div class="carInfo">
                <p class="carNumber fc-r">{{item.divernumber}}</p>
                <p v-if="pageType == 'trajectory'">{{item.name}}</p>
                <p
                  v-else
                  class="address"
                  style="text-align: center"
                >{{item.address ? item.address : "--"}}</p>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { stat } from "fs";
import { constants } from "crypto";
export default {
  props: ["pageType"],
  data() {
    return {
      date: this.PF.getToDay(),
      mineralI: -1,
      navIndex: -1,
      carListActive: this.parentState
    };
  },
  computed: {
    ...mapState({
      _list: state => state._mon.resultList,
      _this_tabType: state => state._tabType,
      _venderList: state => state._venderList,
      _parentEventState: state => state._parentEventState,
      _venderLoginId: state => state._venderLoginId
    })
  },
  watch: {
    _parentEventState() {
      this.navIndex = -10;
    },
    date(a) {
      this.date = a;
      this.getTrajectoryData();
    },
    _this_tabType() {
      if (this.pageType == "trajectory") {
        this.getTrajectoryData();
      }
    }
  },
  methods: {
    ...mapMutations([
      "_changeMon",
      "_changeCarPoint",
      "_changeCarLabelState",
      "_selectVender",
      "_changeDiverInfo",
      "_changeCarLabelIndex",
      "_trajectoryInit"
    ]),
    _changeMon(data) {
      this.$store.commit("_changeMon", data);
    },
    _changeCarPoint(data) {
      this.$store.commit("_changeCarPoint", data);
    },
    _changeDiverInfo(a) {
      this.$store.commit("_changeDiverInfo", a);
    },
    _changeCarLabelIndex(a) {
      this.$store.commit("_changeCarLabelIndex", a);
    },
    _trajectoryInit(a) {
      this.$store.commit("_trajectoryInit", a);
    },
    _changeCarLabelState(data, i) {
      //车是个列表，点击单个车的时候，xuyy
      let o = [];
      if (data.lat == "") {
        // return;
      } else {
        o.push(data);
      }
      this.carListActive = i;
      if (this.pageType == "trajectory") {
        let param = this.qs.stringify({
          venderId: this._venderLoginId,
          diverNumber: data.divernumber,
          appointmentId: data.id,
          period: 2
        });

        this.ajax
          .post("/monitorApi/orbitOfAppointmentDriverNumber", param)
          .then(res => {
            this._trajectoryInit(true);
            this._changeDiverInfo(res.data.body);
            let pathARR = this.PF.parsePath(res.data.body.content);
            this.$store.commit("_changePath", pathARR);
          });
        return;
      }


      this._changeCarLabelIndex(i);
      this.$store.commit("_changeCarPoint", o);
    },
    mineral(i, item) {
      
      this.$store.commit("CLICK_MINERAL", -1);
      this.carListActive = -1;
      this.mineralI = i;
      if(this.pageType == "monitoring"){
      let filterCar = item.carList.filter(el => {
        return el.lat !== "";
      });
      this._changeCarPoint(filterCar);
      }
    },
    selectVender(name, i) {
      this.navIndex = i;
      this.$store.commit("_selectVender", name);
    },
    getTrajectoryData() {
      let param = this.qs.stringify({
        venderId: this._venderLoginId,
        searchdate: this.date,
        type: this._this_tabType
      });
      this.ajax.post("/monitorApi/orbitOfMinesOrCompany", param).then(res => {
        this.$emit("sendTotal", res.data.body.totalquantity ? res.data.body.totalquantity : 0);
        this._trajectoryInit(false);
        this._changeMon(res.data.body);
      });
    }
  },
  mounted() {
    if (this.pageType == "trajectory") {
      this.getTrajectoryData();
    }
  }
};
</script>

<style lang="less" scoped>
.carListActive {
  background: #99DEF9FF;
}
.trag {
  margin-top: 18px;
}
.address {
  font-size: 12px;
}
.navI {
  background: #b2d9fd;
}
.el-input--prefix .el-input__inner {
  border: none;
}
.traje {
  p {
    float: left !important;
  }
  .carInfo {
    .carNumber {
      margin: auto !important;
      line-height: 53px;
      margin-right: 12px !important;
    }
  }
  .number {
    margin-top: 16px !important;
  }
}
.title {
  color: white;
  text-align: center;
  height: 36px;
  line-height: 36px;
  font-size: 18px;
  margin-top: 0;
}
.venderListBox {
  li {
    height: 52px;
    line-height: 52px;
    border-bottom: solid 1px #ccc;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: #b2d9fd;
    }
  }
}
.dataList {
  & > li {
    border: solid 1px #1296db;
    border-radius: 6px;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 10px;
    //   transform: boxShadow
    &:hover .partInfo {
      cursor: pointer;
      background: #fbf9ea;
    }
    .mainIn {
      .mainTitle {
        margin: 0;
        background: #1296db;
        color: white;
        height: 36px;
        line-height: 36px;
        padding: 0 12px;
        font-size: 18px;
      }
    }
    .carListBox {
      li {
        overflow: hidden;
        border-bottom: solid 1px #ccc;
        display: flex;
        justify-content: flex-start;
        & > * {
          display: block;
          float: left;
        }
        &:hover {
          background: #99DEF9FF;
          cursor: pointer;
        }
        .number {
          span {
            font-size: 14px;
            background: #1296db;
            border-radius: 100%;
            color: white;
            width: 24px;
            height: 24px;
            text-align: center;
            display: block;
            line-height: 24px;
          }
          width: 8%;
          margin: 0 6%;
          margin-top: 28px;
        }
        .carInfo {
          width: 92%;
          .carNumber {
            font-size: 16px;
            text-align: center;
            font-weight: bold;
            margin: 6px 0;
          }
        }
      }
    }
    &:nth-child(odd) {
      .partInfo {
        &:before {
          content: "";
          display: block;
          width: 8px;
          height: 100%;
          background: #1296db;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
    &:nth-child(even) {
      .partInfo {
        &:before {
          content: "";
          display: block;
          width: 8px;
          height: 100%;
          background: #54c0f8;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
    .partInfo {
      position: relative;
      height: 70px;
      padding: 0 12px;
      p {
        margin: 0;
      }
      .name {
        padding-top: 12px;
        margin-left: 8px;
        font-size: 18px;
      }
      .fc-r {
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }
}
</style>
