<template>
  <div class="montioring">
    <div class="map po-re">
      <div class="info bc-g po-ab">
        <span>
          预报卸货
          <span class="text">{{_this_data.supplynum}}</span>辆
        </span>
        <span>
          预约卸货
          <span class="text">{{_this_data.appointnum}}</span>辆
        </span>
        <span>
          在途中
          <span class="text">{{_this_data.inRoad}}</span>辆
        </span>
        <span>
          排队中
          <span class="text">{{_this_data.queuenum}}</span>辆
        </span>
        <span>
          已近场
          <span class="text">{{_this_data.enteredfactory}}</span>辆
        </span>

        <span>
          围栏内
          <span class="text">{{_this_data.inCircle}}</span>辆
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
        <bm-marker
          v-for="(el, i) of _this_carList"
          :key="i"
          :position="{lng: el.lon,lat: el.lat}"
          @click="infoWindowOpen"
          :show="_this_carLabelState"
        >
          <bm-info-window :show="_this_carLabelState" :title="el.divernumber" @clickclose="infoWindowClose">
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

    <right-data-list
      :pageType="pageType"
    ></right-data-list>
  </div>
</template>

<script>
import { log } from "util";
import RightDataList from "../components/rightDataList";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 6,
      city: "",
      width: "100%",
      height: "896px",
      pageType: "monitoring",
      data: {},
      carLabelIndex: 0,
      markerState: false
    };
  },
  components: {
    RightDataList
  },
  computed: mapState({
    _this_data: state => state._mon,
    _this_carList: state => state._carList,
    _this_carLabelState: state => state._carLabelState
  }),
  mounted() {},
  methods: {
    infoWindowOpen(){
      this.markerState = this._this_carList.length > 1 ? false : true
      this._changeCarLabelState();
    },
    infoWindowClose(){
      this.markerState = false;
      this._changeCarLabelState()
    },
    handlemapE({ BMap, map }) {
      this.height = `${document.documentElement.clientHeight}`;
      this.center.lng = 116.404;
      this.center.lat = 39.915;
      this.zoom = 6;
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
    _changeCarLabelState(){
      this.$store.commit("_changeCarLabelState", this.markerState);
    },
    getData() {
      let postData = this.qs.stringify({
        venderId: "001",
        type: "1"
      });
      this.ajax
        .post("monitorApi/monitorInTransitAndLocation", postData)
        .then(res => {
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
    }
  },
  created() {
    this.getData();
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
        font-size: 26px;
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
