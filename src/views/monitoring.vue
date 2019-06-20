<template>
  <div class="montioring">
    <div class="map po-re">
      <div class="info bc-g po-ab">
        <span>
          预报到场
          <em></em>辆
        </span>
        <span>
          预约卸货
          <em></em>辆
        </span>
        <span>
          在途中
          <em></em>辆
        </span>
        <span>
          排队中
          <em></em>辆
        </span>
        <span>
          已近场
          <em></em>辆
        </span>

        <span>
          围栏内
          <em></em>辆
        </span>
      </div>
      <baidu-map
        class="bm-view"
        @ready="handlemapE"
        :style="{width: width,height: height}"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        @dragend="dragstart()"
      >
        <bm-marker
          :position="center1"
          :dragging="true"
          animation="BMAP_ANIMATION_BOUNCE"
          :icon="{url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: {width: 300, height: 157}}"
        >
          <bm-label
            content="我爱北京天安门"
            class="label"
            :labelStyle="{fontSize: '16px',color: 'orange',padding: '5px 20px',background: 'white'}"
            :offset="{width: -80, height: 30}"
          />
        </bm-marker>

        <bm-marker
          :position="center2"
          :dragging="true"
          animation="BMAP_ANIMATION_BOUNCE"
          :icon="{url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: {width: 300, height: 157}}"
        >
          <bm-label
            content="我爱北京天安门"
            class="label"
            :labelStyle="{fontSize: '16px',color: 'orange',padding: '5px 20px',background: 'white'}"
            :offset="{width: -80, height: 30}"
          />
        </bm-marker>

        <bm-marker
          :position="center3"
          :dragging="true"
          animation="BMAP_ANIMATION_BOUNCE"
          :icon="{url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: {width: 300, height: 157}}"
        >
          <bm-label
            content="我爱北京天安门"
            class="label"
            :labelStyle="{fontSize: '16px',color: 'orange',padding: '5px 20px',background: 'white'}"
            :offset="{width: -80, height: 30}"
          />
        </bm-marker>

        <bm-driving
          start="天通苑北"
          end="宋家庄地铁站"
          :auto-viewport="true"
          policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
          :panel="false"
          location="北京"
          :waypoints="['西二旗']"
        ></bm-driving>
      </baidu-map>
    </div>

    <!-- 右边数据列表 -->
    
    <right-data-list @pullData="receiveData" :pageType="pageType"></right-data-list>
  </div>
</template>

<script>
import { log } from "util";
import RightDataList from "../components/rightDataList";

export default {
  data() {
    return {
      center: { lng: 0, lat: 0 },
      center1: { lng: 0, lat: 0 },
      center2: { lng: 0, lat: 0 },
      center3: { lng: 0, lat: 0 },
      zoom: 3,
      city: "",
      width: "100%",
      height: "896px",
      childData: {},
      pageType: "monitoring"
    };
  },
  components: {
      RightDataList
  },
  mounted() {},
  methods: {
    handlemapE({ BMap, map }) {
      this.height = `${document.documentElement.clientHeight}`;
      this.center.lng = 116.404;
      this.center.lat = 39.915;
      this.center1.lng = 116.404;
      this.center1.lat = 39.915;
      this.center2.lng = 116.5;
      this.center2.lat = 39.4;
      this.center3.lng = 116.6;
      this.center3.lat = 39.6;
      this.zoom = 15;
    },
    position() {
      this.center = this.city;
    },
    dragstart(a, b, c) {
      // console.log(a, b, c)
    },
    receiveData(data){
      this.childData = data;
      console.log(data)
      console.log(this.childData)
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
      em {
        font-size: 26px;
      }
    }
  }
}
</style>
