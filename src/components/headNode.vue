<template>
  <div class="top">
    <span class="companyName fl-l">{{globalVenderName}}燃料物流调运系统</span>
    <div class="closeBox fl-r">
      <img
        v-if="autoPageState"
        @click="autopage"
        class="close"
        src="@/assets/images/close-ac.png"
        alt="开启自动切换页面"
        title="开启自动切换页面"
      />
      <img
        v-else
        @click="autopage"
        class="close"
        src="@/assets/images/close.png"
        alt="开启自动切换页面"
        title="开启自动切换页面"
      />
    </div>
    <nav class="fl-r">
      <router-link tag="span" v-for="(item, i) of router" :key="i" :to="item.path" exact-active-class="active">{{item.name}}</router-link>
    </nav>
  </div>
</template>

<script>
import { setInterval, clearInterval } from "timers";
import { mapState } from "vuex";
export default {
  data() {
    return {
      nav: ["在途监控", "数据统计", "行驶轨迹", "报警管理"],
      navIndex: 0,
      router: [{
        name: '在途监控',
        path: "/monitoring"
      },
      {
        name: '数据统计',
        path: "/datastatistics"
      },
      {
        name: '行驶轨迹',
        path: "/trajectory"
      },
      {
        name: '报警管理',
        path: "/warning"
      }
      ],
      autoPageState: false,
      timer: null
    };
  },
  computed: mapState(["globalVenderName", "route"]),
  watch: {
    $route(to) {
      const routerPath = this.$route.path;
      this.$store.commit("_changeCurrentPage", routerPath)
      this.router.forEach((el, i) => {
        if (routerPath == el) {
          this.navIndex = i;
        }
      });
    }
  },
  mounted() {
    var venD = this.PF.getVenderId("PC_venderName");
    if (venD) {
      this.$store.commit("_changeGlobalVenderName", venD);
    }
    const routerPath = this.$route.path;
    if (routerPath.indexOf("/warning") != -1) {
      this.navIndex = 3;
      return;
    }
    this.router.forEach((el, i) => {
      if (routerPath == el) {
        this.navIndex = i;
      }
    });
  },
  methods: {
    autopage() {
      var _self = this;

      this.autoPageState = !this.autoPageState;
      if (this.autoPageState) {
        this.timer = setInterval(function() {
          _self.navIndex++;
          _self.navIndex = _self.navIndex > 1 ? 0 : _self.navIndex;
          _self.$router.push(_self.router[_self.navIndex]);
        }, 30000);
      } else {
        clearInterval(this.timer);
      }
    }
  }
};
</script>

<style lang='less' scoped>
.router-link-active {
  color: rgba(255, 255, 255, 1) !important;
  font-size: 24px;
  vertical-align: text-bottom;
  position: relative;
  // background: white;
  &::after {
    content: "";
    display: block;
    width: 24%;
    height: 2px;
    background: white;
    bottom: 10px;
    left: 50%;
    position: absolute;
    margin-left: -12%;
  }
}
.top {
  padding: 0 12px;
  // background: linear-gradient(90deg,#1fc8f9 50%, #0672af);
  background: #0671af;
  box-sizing: border-box;
  height: 72px;
  overflow: hidden;
  nav {
    margin-right: 6%;
    font-family: myfont;
    font-size: 16px;
    & > * {
      transform: color 0.3s;
      padding: 0 20px;
      margin: 0 20px;
      cursor: pointer;
      color: rgba(255, 255, 255, 1);
      height: 100%;
      display: block;
      float: left;

      &:hover {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  .close {
    margin-top: 16px;
    cursor: pointer;
  }
  .companyName {
    color: #fff;
    font-size: 30px;
    position: relative;
    margin-left: 20px;
    //  font-weight: bold;
    font-family: myfont;
    padding-top: 2px;
    &:before {
      content: "";
      display: block;
      width: 8px;
      height: 30px;
      background: #fff;
      position: absolute;
      top: 20px;
      left: -20px;
    }
  }
  & > * {
    line-height: 72px;
  }
  .closeBox {
    margin-top: 12px;
    margin-right: 50px;
    .close {
      width: 20px;
      margin-left: 3px;
    }
    & > * {
      display: block;
    }
    & > span {
      line-height: 100%;
      margin-top: 6px;
    }
  }
}
</style>
