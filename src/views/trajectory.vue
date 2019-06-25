<template>
  <div class="montioring">
    <div class="map po-re">
      <div class="info po-ab" :class="{closeState: closeState}">
        <div class="carN"></div>
        <div class="date">
          开始时间：
          <span class="startDate"></span>
          <img src="../assets/images/topjt-b.png" alt>
          结束时间：
          <span class="endDate"></span>
        </div>
        <div class="gjhf">
          轨迹回放：
          <img
            style="width: 26px;margin-top:16px;"
            @click="videoEvent"
            v-if="!play"
            src="../assets/images/video-play.png"
            alt
          >
          <img
            style="width: 26px;margin-top:16px;"
            @click="videoEvent"
            v-else
            src="../assets/images/video-stop.png"
            alt
          >
        </div>

        <el-button class="moregj" type="text" @click="dialogVisible = true">更多轨迹</el-button>
        <div class="shrink">
          <div v-if="shrink" class="open shrink_btn" @click="shrinkFn">
            <img src="../assets/images/open-active.png" alt>
            <img src="../assets/images/open-h.png" alt>
          </div>
          <div v-else class="close shrink_btn" @click="shrinkFn">
            <img src="../assets/images/close-active.png" alt>
            <img src="../assets/images/close-h.png" alt>
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
        <bm-marker
          :position="startPoint"
          :icon="satrticon"
          :zIndex="marker1"
        ></bm-marker>
        <bm-marker :position="endPoint" :icon="satrticon" :zIndex="marker2"></bm-marker>
        <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="8"></bm-polyline>
        <bml-lushu @stop="reset" :path="path" :icon="icon" :play="play" :rotation="true" :zIndex="lushuZIndex"></bml-lushu>
      </baidu-map>
    </div>
    <!-- 右边数据列表 -->
    <right-data-list :pageType="pageType"></right-data-list>

    <el-dialog title="历史轨迹" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
import { log } from "util";
import RightDataList from "../components/rightDataList";
import { BmlLushu } from "vue-baidu-map";
import { wgs84tobd09 } from "../assets/coordinate";
const pathArr = require("../assets/path.json");
const carIcon = require("../assets/images/car.png");
const carIcon2 = require("../assets/images/car2.png");
const carIcon3 = require("../assets/images/car3.png");
export default {
  data() {
    return {
      width: "100%",
      height: "896px",
      pageType: "trajectory",
      play: false,
      dialogVisible: false,
      startPoint: { lng: 0, lat: 0 },
      satrticon: {
        url: carIcon,
        size: { width: 19, height: 50 },
      },
      closeState: false,
      shrink: false,
      endPoint: { lng: 0, lat: 0 },
      path: [],
      icon: {
        url: carIcon3,
        size: { width: 50, height: 19 }
      },
      marker2: 10,
      marker1: 20,
      lushuZIndex: 2
    };
  },
  components: {
    RightDataList,
    BmlLushu
  },
  mounted() {},
  methods: {
    shrinkFn() {
      this.shrink = !this.shrink;
      this.closeState = !this.closeState;
    },
    reset() {
      this.play = false;
    },
    videoEvent() {
      this.play = !this.play;
        var allOverlay = map.getOverlays();
        console.log(allOverlay)
    },
    handleSearchComplete(res) {
      this.marker2 = 10;
      this.marker1 = 10;
      this.lushuZIndex = 2;
      var scopePath = [];
      pathArr.forEach((el, i) => {
        var pathobj = wgs84tobd09(el.lon / 600000, el.lat / 600000);
        scopePath.push(pathobj);
      });
      this.path = scopePath;
      this.startPoint = this.path[0];
      this.endPoint = this.path[this.path.length - 1];
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
      transition: width 0.2s, height 0.8s, left 0.2s;
      overflow: hidden;
      .carN {
        width: 160px;
        height: 50px;
        background: url("../assets/images/carBg.png") no-repeat 0 0;
        background-size: 100% 100%;
        margin-top: 4px;
      }
      .carN {
        opacity: 1;
        height: auto;
        transition: all 1.3s;
      }
      .date {
        opacity: 1;
        height: auto;
        transition: all 1.3s;
      }
      .gjhf {
        opacity: 1;
        height: auto;
        transition: all 1.3s;
      }
      .moregj {
        opacity: 1;
        height: auto;
        transition: all 0.3s;
      }
      .gjhf {
        color: #028445;
        img {
          cursor: pointer;
        }
      }
      .shrink {
        margin-top: 20px;
        .shrink_btn {
          &:hover img {
            &:nth-child(1) {
              display: block;
            }
            &:nth-child(2) {
              display: none;
            }
          }
          img {
            width: 12px;
            height: 12px;
            cursor: pointer;
            &:nth-child(1) {
              display: none;
            }
            &:nth-child(2) {
              display: block;
            }
          }
        }
      }
    }
    .closeState {
      width: 36px;
      height: 26px;
      left: 50%;
      margin-left: -10px;
      border-radius: 0 0 3px 3px;
      .shrink {
        margin-top: 8px;
        margin-right: 120px;
        position: relative;
        z-index: 10;
      }
      .carN {
        height: 0;
        opacity: 0;
      }
      .date {
        height: 0;
        opacity: 0;
      }
      .gjhf {
        height: 0;
        opacity: 0;
      }
      .moregj {
        height: 0;
        opacity: 0;
      }
    }
  }
}
</style>
