<template>
  <div class="montioring">
    <div class="map po-re">
      <div class="info bc-g po-ab">
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
      <baidu-map
        class="bm-view"
        @ready="handlemapE"
        :style="{width: width,height: height}"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
      >
        <bm-circle
          :clicking="false"
          :center="circlePath.center"
          :radius="Radius"
          fillColor="rgba(28,207,198,0.3)"
          stroke-color="rgba(28,207,198,1)"
          :stroke-opacity="0.1"
          :stroke-weight="4"
          @lineupdate="updateCirclePath"
        ></bm-circle>

        <!-- <bm-polyline :path="polyline1" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="8" @lineupdate="updatePolylinePath"></bm-polyline>
        <bm-polyline :path="polyline2" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="8" @lineupdate="updatePolylinePath"></bm-polyline>
        <bm-polyline :path="polyline3" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="8" @lineupdate="updatePolylinePath"></bm-polyline>-->
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

        <bm-marker
          v-for="(el, i) of _this_carList"
          :key="i"
          :position="{lng: el.lon,lat: el.lat}"
          @click="infoWindowOpen(i)"
          :icon="carIcon"
          :carLabelIndex="carLabelIndex"
        >
          <bm-label
            :content="el.divernumber"
            :labelStyle="{color: 'red', fontSize : '12px', zInde: 99999999}"
            :offset="{width: 0, height: -25}"
            :zIndex="labelIndex"
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
                <span>{{el.appointmentdate}}</span>
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

    <right-data-list :pageType="pageType"></right-data-list>
  </div>
</template>

<script>
import { log } from "util";
import RightDataList from "../components/rightDataList";
import { mapState, mapMutations } from "vuex";
import { constants } from "crypto";
import { truncate } from 'fs';
const carIcon = require("../assets/images/car3.png");
export default {
  data() {
    return {
      center: { lng: 0, lat: 0 },
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
      circlePath: {
        center: {
          lng: 0,
          lat: 0
        }
      },
      polyline1: [],
      polyline2: [],
      polyline3: []
    };
  },
  watch: {
    _MINERAL_ONCLICK(){
      this.carLabelIndex = -1;
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
    _MINERAL_ONCLICK: state => state.MINERAL_ONCLICK
  }),
  methods: {
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
    ...mapMutations(["_changeMon", "_changeCarPoint", "_changeCarLabelState"]),
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
      let postData = this.qs.stringify({
        venderId: "999",
        type: "1"
      });
      this.ajax
        .post("monitorApi/monitorInTransitAndLocation", postData)
        .then(res => {
          if (res.data.body.coord) {
            this.center = {
              lng: res.data.body.coord.location.split("_")[1],
              lat: res.data.body.coord.location.split("_")[0]
            };
            this.zoom = 10
            this.circlePath.center = this.center;
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
            carList.push(...el.carList);
          });
          this._changeCarPoint(carList);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    updateCirclePath(e) {
      // this.circlePath.center = e.target.getCenter();
      // console.log(this.circlePath.center, this.Radius)
      // this.Radius = e.target.getRadius();
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
  },
  created() {}
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

    .info {
      color: white;
      display: flex;
      justify-content: space-around;
      top: 0;
      height: 42px;
      z-index: 9999;
      width: 60%;
      left: 20%;
      border-radius: 0 0 36px 36px;
      span {
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
</style>
