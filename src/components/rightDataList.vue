<template>
  <!-- 右边数据列表 -->
  <div class="rightBox">
    <div class="tabNavBg"></div>
    <ul class="navBox">
      <li
        v-for="(item, index) in rightNav"
        :key="index"
        @click="tabFn(index)"
        :class="{active: tabI == index}"
      >{{item}}</li>
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
        <right-list :pageType="pageType"></right-list>
      </div>
    </div>
  </div>
</template>

<script>
import RightList from "./rightList";
import { mapState, mapMutations } from "vuex";
export default {
  props: ["pageType"],
  data() {
    return {
      rightNav: ["矿点分类", "供应单位分类"],
      tabI: 0,
      date: "",
      mineralI: -1,
      a: ""
    };
  },
  components: {
    RightList
  },
  computed: mapState({
    _venderLoginId: state => state._venderLoginId
  }),
  methods: {
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
  .tabNavBg {
    background: #f0f4ff;
    height: 46px;
    border-bottom: solid 1px #ccc;
  }
  .navBox {
    z-index: 2;
    overflow: hidden;
    position: relative;
    top: -44px;
    li {
      display: block;
      float: left;
      text-align: center;
      height: 32px;
      line-height: 32px;
      position: relative;
      margin-top: 12px;
      cursor: pointer;
      &:first-child {
        width: 42%;
        margin-left: 4%;
      }
      &:last-child {
        width: 54%;
      }
      &.active {
        background: white;
        border-radius: 3px;
        border: solid 1px #ccc;
        border-bottom: none;
      }
    }
  }
  .tabC {
    margin-top: -20px;
    .title {
      color: white;
      text-align: center;
      height: 36px;
      line-height: 36px;
      font-size: 18px;
      margin-top: 0;
      cursor: pointer;
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
