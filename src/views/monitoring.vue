<template>
  <div class="montioring">
    <audio id="audio">
      <source src="../assets/warningAudio.mp3" type="audio/mpeg" />
    </audio>
    <div class="map po-re" :style="{width: mapWidth}">
      <div class="info po-ab" :style="{backgroundSize: infoBgSize}">
        <span>
          预报卸货
          <span class="text">{{_this_data.supplynum ? _this_data.supplynum : 0}}</span>辆
        </span>
        <span>
          预约卸货
          <span class="text">{{_this_data.appointnum ? _this_data.appointnum : 0}}</span>辆
        </span>
        <span>
          在途中
          <span class="text">{{_this_data.inRoad ? _this_data.inRoad : 0}}</span>辆
        </span>
        <span>
          排队中
          <span class="text">{{_this_data.queuenum ? _this_data.queuenum : 0}}</span>辆
        </span>
        <span>
          已进厂
          <span class="text">{{_this_data.enteredfactory ? _this_data.enteredfactory : 0}}</span>辆
        </span>

        <span>
          围栏内
          <span class="text">{{_this_data.inCircle ? _this_data.inCircle : 0}}</span>辆
        </span>
      </div>
      <div class="po-ab warningBox" :class="{warningAn: warningTotal > 0}" @click="toWarningPage">
        <img src="../assets/images/warning-icon.png" alt />
        <span>{{warningTotal > 99 ? 99 + "+" : warningTotal}}</span>
      </div>
      <baidu-map
        class="bm-view"
        @ready="handlemapE"
        :style="{width: width,height: height}"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
      >
        <bm-marker v-if="venderCenter.lng" :position="venderCenter">
          <bm-label
            v-if="center.lng != 116.4039325102"
            :content="_venderName"
            :labelStyle="{color: 'red', fontSize : '12px', zInde: 99999999}"
            :offset="{width: 0, height: -25}"
          />
        </bm-marker>
        <bm-circle
          :clicking="false"
          :center="circlePath.center"
          :radius="Radius"
          fillColor="rgba(28,207,198,0.3)"
          stroke-color="rgba(28,207,198,1)"
          :stroke-opacity="0.1"
          :stroke-weight="4"
        ></bm-circle>
        <bm-polygon
          :path="polyline1"
          stroke-color="blue"
          :stroke-opacity="0.5"
          :stroke-weight="2"
          @lineupdate="updatePolygonPath"
        />
        <bm-polygon
          :path="polyline2"
          stroke-color="blue"
          :stroke-opacity="0.5"
          :stroke-weight="2"
          @lineupdate="updatePolygonPath"
        />
        <bm-polygon
          :path="polyline3"
          stroke-color="blue"
          :stroke-opacity="0.5"
          :stroke-weight="2"
          @lineupdate="updatePolygonPath"
        />

        <!-- 矿点 -->
        <bm-marker
          v-for="(el, index) of mineList"
          :key="index"
          :position="{lng: el.coord.split(',')[0],lat:  el.coord.split(',')[1]}"
          :icon="flagIcon"
          
        >
          <bm-label
            :content="el.mines"
            :labelStyle="{color: 'red', fontSize : '12px'}"
            :offset="{width: 30, height: -35}"
          />
        </bm-marker>

        <bm-marker
          v-for="(el, i) of _this_carList"
          :key="i"
          :position="{lng: el.lon,lat: el.lat}"
          @click="infoWindowOpen(i)"
          :icon="carIcon"
          :carLabelIndex="carLabelIndex"
          animation="BMAP_ANIMATION_BOUNCE"
        >
          <bm-label
            :content="el.divernumber"
            :labelStyle="{color: 'red', fontSize : '12px', zInde: 99999999}"
            :offset="{width: 30, height: -35}"
            :zIndex="labelIndex"
            animation="BMAP_ANIMATION_BOUNCE"
          />
          <bm-info-window
            :show="carLabelIndex == i"
            :title="el.divernumber"
            @clickclose="infoWindowClose"
            :offset="{width: 0, height: -25}"
          >
            <!-- <p class="carNum">{{el.divernumber}}<span class="fl-r" @click="infoWindowClose">X</span></p> -->
            <ul class="merkerInfo">
              <li>
                司机姓名：
                <span>{{el.name}}</span>
              </li>
              <li>
                司机电话：
                <span>{{el.mobile}}</span>
              </li>
              <li>
                预约时间：
                <span>{{el.appointmentdate.split(" ")[0]}}</span>
              </li>
              <li>
                预约矿点：
                <span>{{el.companyname}}</span>
              </li>
              <li>
                当前位置：
                <span>{{el.address}}</span>
              </li>
            </ul>
          </bm-info-window>
        </bm-marker>
      </baidu-map>
    </div>

    <!-- 右边数据列表 -->

    <right-data-list :pageType="pageType" :total="total"></right-data-list>
  </div>
</template>

<script>
import { log } from "util";
import RightDataList from "../components/rightDataList";
import { mapState, mapMutations } from "vuex";
import { constants } from "crypto";
import { truncate } from "fs";
import { setInterval } from "timers";
const carIcon = require("../assets/images/car3.png");
const flagIcon = require("../assets/images/flagMapIcon.png");
var monitoringAudio = document.getElementById("audio");
var oldwaringSize;
export default {
  data() {
    return {
      audio: {},
      center: { lng: 116.4039325102, lat: 39.9151612554 },
      zoom: 6,
      Radius: 7000,
      city: "",
      width: "100%",
      height: "896px",
      pageType: "monitoring",
      data: {},
      carLabelIndex: -1,
      markerState: false,
      labelIndex: 9999999999,
      carIcon: {
        url: carIcon,
        size: { width: 47, height: 18 }
      },
      flagIcon: {
        url: flagIcon,
        size: { width: 35, height: 35 }
      },
      circlePath: {
        center: {
          lng: 0,
          lat: 0
        }
      },
      polyline1: [],
      polyline2: [],
      polyline3: [],
      carArr: [],
      mapWidth: "80%",
      infoBgSize: "100% 100%",
      total: "",
      mineList: [],
      warningTotal: 0,
      venderCenter: ""
    };
  },
  watch: {
    _MINERAL_ONCLICK() {
      this.carLabelIndex = -1;
    },
    _this_carList() {
      if (this._this_carList.length == 1) {
        this.zoom = 13;
        this.center.lat = this._this_carList[0].lat;
        this.center.lng = this._this_carList[0].lon;
      }
    },
    _isShowRight() {
      this.mapWidth = this._isShowRight ? "100%" : "80%";
      this.infoBgSize = "100% 100%";
    },
    $route(to, from) {
      console.log("to" + to);
      // 对路由变化作出响应...
    }
  },
  components: {
    RightDataList
  },
  computed: mapState({
    _this_data: state => state._mon,
    _this_carList: state => state._carList,
    _this_carLabelState: state => state._carLabelState,
    _this_carLabelIndex: state => state._carLabelIndex,
    _MINERAL_ONCLICK: state => state.MINERAL_ONCLICK,
    _venderLoginId: state => state._venderLoginId,
    _venderName: state => state.globalVenderName,
    _isShowRight: state => state._isShowRight
  }),
  mounted() {
    var timer;
    var _self = this;
    if (this.$route.path == "/monitoring" || this.$route.path == "/") {
      timer = setInterval(() => {
        _self.getData();
      }, 180000);
    } else {
      clearInterval(timer);
    }
  },
  methods: {
    toWarningPage() {
      this.$router.push("/warning/warning");
    },
    autoGetData() {},
    infoWindowOpen(i) {
      this.carLabelIndex = i;
    },
    infoWindowClose() {
      this.carLabelIndex = -1;
    },
    handlemapE({ BMap, map }) {
      this.height = `${document.documentElement.clientHeight}`;
      this.getData();
    },
    position() {
      this.center = this.city;
    },
    ...mapMutations([
      "_changeMon",
      "_changeCarPoint",
      "_changeCarLabelState",
      "_changeGlobalVenderName"
    ]),
    _changeMon(data) {
      this.$store.commit("_changeMon", data);
    },
    _changeCarPoint(data) {
      this.$store.commit("_changeCarPoint", data);
    },
    _changeCarLabelState() {
      this.$store.commit("_changeCarLabelState", this.markerState);
    },
    getData() {
      this.loading();
      let postData = this.qs.stringify({
        venderId: this._venderLoginId,
        type: "1"
      });
      

      this.ajax
        .post("monitorApi/monitorInTransitAndLocation", postData)
        .then(res => {
          monitoringAudio = document.getElementById("audio");
          if (res.data.errorCode == 200) {
            var timerAudio;
            if (res.data.body.mineList.length > 0) {
              this.mineList = res.data.body.mineList;
            }
          if(!oldwaringSize){ //第一次
           if(res.data.body.waringSize > 0 ){
             monitoringAudio.setAttribute("loop","loop")
                monitoringAudio.play();
                oldwaringSize = res.data.body.waringSize;
                timerAudio = setTimeout(() => {
                    monitoringAudio.pause();
               monitoringAudio.removeAttribute("loop")
                }, 1000*60*60);
           }
          }else{
             if(res.data.body.waringSize > 0   ){
               //非第一次  并且告警次数不一致
               if(oldwaringSize < res.data.body.waringSize){
                 monitoringAudio.setAttribute("loop","loop");
                 monitoringAudio.play();
                  clearInterval(timerAudio)
                    monitoringAudio.play();
                    oldwaringSize = res.data.body.waringSize;
                  timerAudio = setTimeout(() => {
monitoringAudio.pause();
               monitoringAudio.removeAttribute("loop")       
                  }, 1000*60*60);
                 
               }
               
             }else{
               oldwaringSize = 0;
               monitoringAudio.removeAttribute("loop")
                clearInterval(timerAudio)
                monitoringAudio.pause();
             }

          }

           

            oldwaringSize = res.data.body.waringSize;
            this.warningTotal = res.data.body.waringSize;
            this.total = res.data.body.totalquantity;

            if (res.data.body.coord) {
              let point = {
                lng: res.data.body.coord.location.split("_")[1],
                lat: res.data.body.coord.location.split("_")[0]
              };
              this.center = point;
              this.venderCenter = point;
              this.zoom = 13;
              this.circlePath.center = point;
              this.Radius = Number(res.data.body.coord.radius);
              if (res.data.body.coord.enclosure1) {
                this.polyline1 = this.parseEnclosurePath(
                  res.data.body.coord.enclosure1
                );
              }

              if (res.data.body.coord.enclosure2) {
                this.polyline2 = this.parseEnclosurePath(
                  res.data.body.coord.enclosure2
                );
              }
              if (res.data.body.coord.enclosure3) {
                this.polyline3 = this.parseEnclosurePath(
                  res.data.body.coord.enclosure3
                );
              }
            }
            this.data = res.data.body;
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
            this._changeMon(res.data.body);
            this._changeCarPoint(carList);
          } else {
            this.total = 0;
            this.$alert(res.data.msg);
          }
          this.loading().close();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    updatePolygonPath(e) {
      this.polyline1 = e.target.getPath();
    },

    parseEnclosurePath(arr) {
      var newArr = [];
      var firstA = arr.split(",");
      for (let i = 0; i < firstA.length; i++) {
        let point = {};
        let a = firstA[i].split("_").reverse();
        point.lng = a[0];
        point.lat = a[1];
        newArr.push(point);
      }
      return newArr;
    }
  }
};
</script>
<style lang="less" scoped>
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
      height: 42px;
      z-index: 9;
      width: 1065px;
      left: 50%;
      margin-left: -526px;
      // margin: 0 auto;
      background-size: 100% 100%;
      background: url("../assets/images/top-bg.png") 0 center no-repeat;
      padding: 0 72px;
      & > span {
        display: inline;
      }
      .text {
        font-size: 24px;
      }
    }
  }
}
.merkerInfo {
  li {
    margin: 6px 0;
    font-size: 14px;
    span {
      margin-left: 12px;
    }
  }
}
.warningBox {
  right: 90px;
  top: 36px;
  z-index: 6;
  span {
    margin-top: -20px;
    display: inline-block;
    padding: 0 6px;
    background: red;
    color: white;
    border-radius: 100px;
    position: absolute;
    top: 9px;
    right: -10px;
  }
  cursor: pointer;
}
.warningAn {
  animation: warningAnimation 1s infinite;
}
@keyframes warningAnimation {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
