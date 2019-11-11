<template>
  <div>
    <div class="box" style="position: flex;z-index: 9">
    <input type="button" value="+" @click="editorFn">
    <input type="button" value="厂图" @click="vender">
    <input type="button" value="end" @click="endFn">
    <input type="button" value="clear" @click="clearFn">
    </div>
    <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler" :style="{height: mapHeight}" :scroll-wheel-zoom="true" @click="paintPolyline">
      <bm-polygon v-for="(path, i) of pathArr"
        :key="i"
        :path="path"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="2"
        :editing="editing"
      />
      <bm-polyline :path="polylinePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"></bm-polyline>
        <bm-marker
          v-for="(el, index) of markArr"
          :key="index"
          :position="el"
          :editing="editing"
        >
        </bm-marker>

        <bm-label content="储煤场" :position="{lng: 113.120211, lat: 34.796573}" :labelStyle="{color: 'red', fontSize : '18px'}" title="Hover me"/>
        <bm-label content="采样、计量区域" :position="{lng: 113.120782, lat: 34.796939}" :labelStyle="{color: 'red', fontSize : '14px'}" title="Hover me"/>
        <bm-label content="进煤通道" :position="{lng: 113.121186, lat: 34.797955}" :labelStyle="{color: 'red', fontSize : '18px'}" title="Hover me"/>
        <bm-label content="卸煤沟" :position="{lng: 113.11952, lat: 34.79737}" :labelStyle="{color: 'red', fontSize : '18px'}" title="Hover me"/>
    </baidu-map>
  </div>
</template>

<script>

export default {
  data() {
    return {
      center: { lng: 113.121691, lat: 34.795993 },
      zoom: 3,
      polygonPath: [
        { lng: 113.118769, lat: 34.797807 },
        { lng: 113.118958, lat: 34.796221},
        { lng: 113.122322, lat: 34.79634},
        { lng: 113.122322, lat: 34.79766},
        { lng: 113.12202, lat: 34.79766},
        { lng: 113.12202, lat: 34.797807},
// { lng: 113.118769, lat: 34.797807 },
      ],
      mapHeight: "896px",
      pathArr: [],
      editorState: false,
      arr: [],
      markArr: [],
      editing: true,
      polylinePath: []
    };
  },
  mounted(){
      this.mapHeight = window.innerHeight - 72;
      
  },
  methods: {
    vender(){
      this.editorState = "vender";
    },
    clearFn(){
      this.markArr = [];
    this.editing = false;
    },
    endFn(){
      this.arr = [];
      this.editorState = "false";
    },
    editorFn(){
      // this.arr = [];
      this.editorState = "true";
    },
    paintPolyline(e){
      console.log(this.editorState)
      if(this.editorState == 'vender'){
        this.polylinePath.push(e.point);
        this.markArr.push(e.point)
      }
      
      
      if(this.editorState =='true'){
      this.markArr.push(e.point)
      this.arr.push(e.point)
      }else if(this.editorState =='false'){
        this.arr = [];
        this.pathArr.push(this.arr)
        
      }
      console.log(this.arr, this.pathArr)
      // console.log(e)
    },
    handler({ BMap, map }) {
      
    //   this.center.lng = 116.404;
    //   this.center.lat = 39.915;
      this.zoom = 19;
    },
    updatePolygonPath (e) {
      this.polygonPath = e.target.getPath()
    },
    addPolygonPoint () {
      this.polygonPath.push({lng: 116.404, lat: 39.915})
    }
  }
};
</script>

<style scoped lang='less'>
.bm-view {
  width: 100%;
}
</style>