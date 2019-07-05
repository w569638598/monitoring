<template>
  <div class="top">
    <span class="companyName fl-l">{{globalVenderName}}燃料物流管理平台</span>
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
      <span
        v-for="(nav, i) in nav"
        :key="i"
        @click="navClick(i)"
        :class="{active: navIndex == i}"
      >{{nav}}</span>
    </nav>
  </div>
</template>

<script>
import { setInterval, clearInterval } from "timers";
import { mapState } from "vuex";
export default {
  data() {
    return {
      nav: ["在途监控", "数据统计", "行驶轨迹", "报警信息"],
      navIndex: 0,
      router: ["monitoring", "datastatistics", "trajectory", "warning"],
      autoPageState: false,
      timer: null
    };
  },
  computed: mapState(["globalVenderName"]),
  watch: {
    $route() {
      const routerPath = this.$route.path.slice(1);
      this.router.forEach((el, i) => {
        if (routerPath == el) {
          this.navIndex = i;
        }
      });
    }
  },
  created() {
    const routerPath = this.$route.path.slice(1);
    this.router.forEach((el, i) => {
      if (routerPath == el) {
        this.navIndex = i;
      }
    });
    var venD = this.PF.getVenderId("PC_venderName");
    this.$store.commit("_changeGlobalVenderName", venD);
  },
  methods: {
    navClick(i) {
      this.navIndex = i;
      this.$router.push(this.router[i]);
    },
    autopage() {
      var _self = this;
      this.autoPageState = !this.autoPageState;
      if (this.autoPageState) {
        this.timer = setInterval(function() {
          _self.navIndex++;
          _self.navIndex = _self.navIndex > 1 ? 0 : _self.navIndex;
          _self.$router.push(_self.router[_self.navIndex]);
        }, 120000);
      } else {
        clearInterval(this.timer);
      }
    }
  }
};
</script>

<style lang='less' scoped>
.active {
  color: #1296db !important;
  font-size: 21px;
}
.top {
  padding: 0 12px;
  box-sizing: border-box;
  height: 72px;
  border-bottom: solid 1px #ccc;
  overflow: hidden;
  nav {
    margin-right: 6%;
    font-family: myfont;
    font-size: 16px;
    & > * {
      margin: 0 40px;
      cursor: pointer;
      color: #333;
    }
  }
  .close {
    margin-top: 16px;
    cursor: pointer;
  }
  .companyName {
    color: #1296db;
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
      background: #1296db;
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
