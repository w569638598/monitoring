<template>
  <div>
    <div class="left fl-l">
      <div>
        <ul>
          <li
            :class="{active: active == i}"
            v-for="(item, i) of leftNav"
            :key="i"
            @click="navClick(i)"
          >{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="right fl-l">
      <p class="r-title">{{leftNav[active]}}</p>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      active: 0,
      leftNav: [
        "报警信息",
        "路线偏离",
        "设置"
      ]
    };
  },
  watch: {
    $route(to, from) {
      let toPath = to.path;
      switch (toPath) {
        case "/warning/warning":
          this.active = 0;
          break;
        case "/warning/deviate":
          this.active = 1;
          break;
        case "/warning/set":
          this.active = 2;
          break;
      }
    }
  },
  mounted(){
    let currentPaht = this.$route.path;
          switch (currentPaht) {
        case "/warning/warning":
          this.active = 0;
          break;
        case "/warning/deviate":
          this.active = 1;
          break;
        case "/warning/set":
          this.active = 2;
          break;
      }
  },
  computed: mapState({
    _venderLoginId: state => state._venderLoginId
  }),
  async beforeRouteUpdate(to, from, next) {
    if (to.path === "/warning/deviate") {
      const a = await this.$prompt("请输入6位有效口令", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: async (a, b) => {
          if (b.inputValue == null || b.inputValue == "") {
            return;
          }
          let param = this.qs.stringify({
            venderId: this._venderLoginId,
            command: b.inputValue.toLowerCase()
          });
          var res = await axios.post("/monitorApi/checkCommand", param);
          if (res.data.errorCode == 200) {
            next();
          } else {
            debugger
            if(a == "cancel"){
              return;
            }else{
            this.$alert("口令有误");
            next(false);
            }
          }
          if(a === 'confirm'){

          }
          
        }
        
      });
    } else {
      next();
    }
  },
  methods: {
    navClick(i) {
      switch (i) {
        case 0:
          this.$router.push("/warning/warning");
          break;
        case 1:
          this.$router.push("/warning/deviate");
          break;
        case 2:
          this.$router.push("/warning/set");
      }
    }
  }
};
</script>
<style lang="less">
.right {
  width: calc(98% - 210px);
  margin-left: 2%;
}
.r-title {
  color: #1296dbff;
  font-size: 14px;
  position: relative;
  &::before {
    content: "";
    display: block;
    width: 3px;
    height: 13px;
    background: #1296dbff;
    position: absolute;
    left: -10px;
    top: 3px;
  }
}
.soonOnline {
  display: block;
  margin: 0 auto;
  width: 500px;
  margin-top: 120px;
}
.el-dialog__body {
  padding-top: 20px;
}
</style>
<style lang="less" scoped>
.left {
  width: 210px;
  .active {
    background: white;
  }
  .title {
    text-align: center;
    height: 66px;
    line-height: 66px;
    margin: 0;
  }
  li {
    text-align: center;
    background: #ece4d9;
    border-bottom: solid 1px #ccc;
    width: 100%;
    height: 66px;
    line-height: 66px;
    cursor: pointer;
  }
}
.el-table .cell {
  text-align: center;
}
</style>
