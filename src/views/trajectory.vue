<template>
  <div class="montioring">
    <div class="map po-re">
      <div class="info po-ab" :class="{closeState: closeState}">
          <div class="carN">

          </div>
          <div class="date">
              开始时间：<span class="startDate"></span>
              <img src="../assets/images/topjt-b.png" alt="">
              结束时间：<span class="endDate"></span>
          </div>
          <div class="gjhf">
              轨迹回放：<img style="width: 26px;margin-top:16px;" @click='videoEvent' v-if="!play" src="../assets/images/video-play.png" alt=""> <img style="width: 26px;margin-top:16px;" @click='videoEvent' v-else src="../assets/images/video-stop.png" alt="">
          </div>
          
          <el-button class="moregj" type="text" @click="dialogVisible = true">更多轨迹</el-button>
          <div class="shrink"><img src="" alt="">
            <div v-if="shrink" class="open shrink_btn" @click="shrinkFn">
              <img src="../assets/images/open-active.png" alt="">
              <img src="../assets/images/open-h.png" alt="">
            </div>
            <div v-else class="close shrink_btn" @click="shrinkFn">
              <img src="../assets/images/close-active.png" alt="">
              <img src="../assets/images/close-h.png" alt="">
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
          <bm-marker :position="startPoint" :icon="{url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: {width: 300, height: 157}}"></bm-marker>
          <bm-marker :position="endPoint" :icon="satrticon"></bm-marker>
        <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="8"></bm-polyline>
        <bml-lushu @stop="reset" :path="path" :icon="icon" :play="play" :rotation="true"></bml-lushu>
      </baidu-map>
    </div>
    <!-- 右边数据列表 -->
    <right-data-list @pullData="receiveData" :pageType="pageType"></right-data-list>

    <el-dialog
  title="历史轨迹"
  :visible.sync="dialogVisible"
  width="30%">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
  </span>
</el-dialog>


  </div>
</template>

<script>
import { log } from "util";
import RightDataList from "../components/rightDataList";
import { BmlLushu } from "vue-baidu-map";
import { wgs84tobd09 } from "../assets/coordinate";
const pathArr = require("../assets/path.json");
export default {
  data() {
    return {
      width: "100%",
      height: "896px",
      childData: {},
      pageType: "trajectory",
      play: false,
      dialogVisible: false,
      startPoint: {lng: 0, lat: 0},
      satrticon: {
        url: "../assets/images/car.png",
        size: { width: 52, height: 26 },
        opts: { anchor: { width: 27, height: 13 } }
      },
      closeState: false,
      shrink: false,
      endPoint: {lng: 0, lat: 0},
      path: [],
      icon: {
        url: "http://api.map.baidu.com/library/LuShu/1.2/examples/car.png",
        size: { width: 52, height: 26 },
        opts: { anchor: { width: 27, height: 13 } }
      }
    };
  },
  components: {
    RightDataList,
    BmlLushu
  },
  mounted() {
  },
  methods: {
    shrinkFn(){
      this.shrink = !this.shrink;
      this.closeState = !this.closeState;
    },
    reset() {
      this.play = false;
    },
    videoEvent(){
        this.play = !this.play
    },
    handleSearchComplete(res) {
        // this.path = res.getPlan(0).getRoute(0).getPath()
      var scopePath = [];
      pathArr.forEach((el, i) => {
        var pathobj = wgs84tobd09(el.lon / 600000, el.lat / 600000);
        scopePath.push(pathobj);
      });
      this.path = scopePath;
      this.startPoint = this.path[0];
      this.endPoint = this.path[this.path.length - 1];
      console.log(this.startPoint);
      console.log(this.endPoint)
    },
    receiveData(data) {
      this.childData = data;
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
      left: 0;
      height: 60px;
      z-index: 2;
      width: 100%;
      background: white;
      border-bottom: solid 1px #ccc;
      transition: width .2s, height .8s, left .2s;
      .carN{
          width: 160px;
          height: 50px;
          background: url("../assets/images/carBg.png") no-repeat 0 0;
          background-size: 100% 100%;
          margin-top: 4px;
      }
      .gjhf{
        color: #028445;
          img{
              cursor: pointer;
          }
      }
      .shrink{
        .shrink_btn{
          &:hover img{
            &:nth-child(1){
              display: block;
            }
            &:nth-child(2){
              display: none;
            }
          }
          img{
            width: 12px;
            height: 12px;
            cursor: pointer;
            &:nth-child(1){
              display: none;
            }
            &:nth-child(2){
              display: block;
            }
          }
        }
      }
    }
    .closeState{
      width: 36px;
      height: 26px;
      left: 50%;
      margin-left: -10px;
      border-radius: 0 0 3px 3px;
      .shrink_btn{
        margin-top: -14px;
      }
.carN{
  display: none;
}
.date{
  display: none;
}
.gjhf{
  display: none;
}
.moregj{
  display: none;
}
    }
  }
}
</style>
