<template>
  <!-- 右边数据列表 -->
  <div class="rightBox" :style="{right: right}">
    <!-- <div class="tabNavBg"></div> -->
    <ul class="navBox" :style="{right: rightNavposition}">
      <li
        v-for="(item, index) in rightNav"
        :key="index"
        @click="tabFn(index)"
        :class="{active: tabI == index}"
      >
        {{item}}
        <span v-if="tabI == index && (total !== ''|| total)">{{total}}</span>
      </li>
    </ul>
    <div class="tabC">
      <div v-if="tabI == 0">
        <p
          v-if="pageType == 'monitoring' || pageType == 'dataStatistics'"
          class="title bc-b"
          @click="getAllData(a)"
        >全部矿点</p>
        <right-list :pageType="pageType"></right-list>
      </div>
      <div v-else>
        <p
          v-if="pageType == 'monitoring' || pageType == 'dataStatistics'"
          class="title bc-b"
          @click="getAllData(a)"
        >全部供应单位</p>
        <right-list :pageType="pageType" @sendTotal="getTotal"></right-list>
      </div>
    </div>
  </div>
</template>

<script>
import RightList from "./rightList";
import { mapState, mapMutations } from "vuex";
import { constants } from "crypto";
export default {
  props: ["pageType", "total"],
  data() {
    return {
      rightNav: ["矿点分类", "供应单位分类", ">>"],
      tabI: 0,
      date: "",
      mineralI: -1,
      a: "",
      right: "0",
      rightNavposition: "20%",
      isShowRight: this._isShowRight
    };
  },
  components: {
    RightList
  },
  created() {
    if (this.pageType === "dataStatistics") {
      this.rightNav.pop();
    }
  },
  computed: mapState({
    _venderLoginId: state => state._venderLoginId,
    _isShowRight: state => state._isShowRight
  }),
  methods: {
    getTotal(a) {
      console.log("--------");
      console.log(a);
    },
    ...mapMutations([
      "_changeMon",
      "_changeCarPoint",
      "_warchType",
      "_parentEvent"
    ]),
    _changeMon(data) {
      this.$store.commit("_changeMon", data);
    },
    _changeCarPoint(data) {
      this.$store.commit("_changeCarPoint", data);
    },
    _warchType(type) {
      this.$store.commit("_warchType", type);
    },
    getAllData(type) {
      this.loading();
      this.$store.commit("_parentEvent", "allData");
      if (this.pageType == "monitoring") {
        let postData = this.qs.stringify({
          venderId: this._venderLoginId,
          type: type ? type : 1
        });
        this.ajax
          .post("monitorApi/monitorInTransitAndLocation", postData)
          .then(res => {
            this._changeMon(res.data.body);
            var carList = [];
            this.total = res.data.body.totalquantity;
            res.data.body.resultList.forEach((el, i) => {
              for (let i = 0; i < el.carList.length; i++) {
                if (el.carList[i].lat == "") {
                } else {
                  carList.push(el.carList[i]);
                }
              }
            });
            this._changeCarPoint(carList);
            this.loading().close();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.$emit("allData", "event");
      }
    },
    tabFn(i) {
      if (i === 2) {
        this.isShowRight = !this.isShowRight;
        this.right = this.isShowRight ? "-20%" : "0";
        this.rightNavposition = this.isShowRight ? "0" : "20%";
        this.$store.commit("_changeRightState", this.isShowRight);
        this.rightNav[2] = this.isShowRight ? "<<" : ">>";
        return;
      }
      if (this.pageType === "dataStatistics") {
        
      } else {
        this.isShowRight = false;
        this.right = this.isShowRight ? "-20%" : "0";
        this.rightNavposition = this.isShowRight ? "0" : "20%";
        this.$store.commit("_changeRightState", this.isShowRight);
        this.rightNav[2] = this.isShowRight ? "<<" : ">>";
      }
      this.$store.commit("_parentEvent", "allData");
      this.tabI = i;
      this.a = i;
      this.a++;
      if (this.pageType == "monitoring") {
        this.getAllData(this.a);
        return;
      }

      this._warchType(this.a);
    }
  }
};
</script>

<style lang="less" scoped>
.rightBox {
  width: 20%;
  height: 896px;
  overflow: auto;
  position: fixed;
  transition: right 0.6s;
  top: 72px;
  .tabNavBg {
    background: #f0f4ff;
    height: 46px;
    border-bottom: solid 1px #ccc;
  }
  .navBox {
    z-index: 2;
    // position: relative;
    position: fixed;
    // word-wrap: ;
    transition: right 0.6s;
    top: 142px;
    // top: -44px;
    li {
      writing-mode: tb-rl;
      cursor: pointer;
      width: 40px;
      text-align: center;
      line-height: 40px;
      height: 180px;
      background: #cfcfcfff;
      border-radius: 5px 0 0 5px;
      color: #666666ff;
      font-size: 18px;
      letter-spacing: 3px;
      position: relative;
      &:nth-child(3) {
        writing-mode: horizontal-tb;
        height: 100px;
        line-height: 100px;
        letter-spacing: 0;
        font-size: 18px;
        color: #0671af;
        background: rgba(0, 0, 0, 0.15);
        margin-top: 50px !important;
        letter-spacing: -3px;
      }
      &:nth-child(3){
        font-weight: bold;
      }
      &:nth-child(3),
      &:nth-child(2) {
        // width: 54%;
        margin-top: 50px;
      }
      &.active {
        background: #01a7f7ff;
        color: white;
        font-size: 22px;
      }
      span {
        position: absolute;
        writing-mode: horizontal-tb;
        top: -18px;
        left: -14px;
        background: #0d597d;
        font-weight: bold;
        font-family: myfont;
        border-radius: 50px;
        height: 36px;
        width: 36px;
        line-height: 36px;
        letter-spacing: 0;
        display: block;
        font-size: 14px;
      }
    }
  }
  .tabC {
    margin: 24px auto;
    .title {
      color: white;
      text-align: center;
      height: 36px;
      line-height: 36px;
      font-size: 18px;
      margin-top: 0;
      cursor: pointer;
      width: 86%;
      margin: 0 auto 20px;
      background: linear-gradient(90deg, #1dbfec, #0478d0);
      border-radius: 5px;
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
              background: #fbf9ea;
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
              margin-top: 38px;
            }
            .carInfo {
              width: 92%;
              .carNumber {
                text-align: center;
                font-weight: bold;
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
          }
          .fc-r {
            margin-top: 8x;
          }
        }
      }
    }
  }
}
</style>
