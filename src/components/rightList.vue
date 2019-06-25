<template>
  <!-- 右边数据列表 -->
  <div>
    <div v-if="pageType == 'trajectory'">
      <p>
        选择预约时间
        <span class="fl-r fc-r">按自由时间段查询</span>
      </p>
      <el-date-picker v-model="date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
    </div>
    <ul class="dataList">
      <li v-if="pageType == 'dataStatistics'"></li>
      <li v-else v-for="(item, index) in _list" :key="index" @click.stop="mineral(index, item)">
        <div class="partInfo" v-if="mineralI != index">
          <p class="name">{{item.companyname}}</p>
          <p class="fc-r fl-r">共{{2}}车</p>
        </div>
        <div class="mainIn" v-else>
          <p class="mainTitle">
            <span>{{item.companyname}}</span>
            <span class="fl-r">共{{item.carList.length}}车</span>
          </p>
          <ul class="carListBox">
            <li v-for="(item, i) in item.carList" :key="i" @click.stop="_changeCarLabelState(item, i)">
              <div class="number">
                <span>{{index+1}}</span>
              </div>
              <div class="carInfo">
                <p class="carNumber fc-r">{{item.divernumber}}</p>
                <p class="address">{{item.address}}</p>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["pageType"],
  data() {
    return {
      date: '',
      mineralI: -1
    };
  },
  computed: {
    ...mapState({
      _list: state => state._mon.resultList
    })
  },
  methods: {
    ...mapMutations(["_changeMon"], "_changeCarPoint", "_changeCarLabelState"),
    _changeMon(data) {
      this.$store.commit("_changeMon", data);
    },
    _changeCarPoint(data) {
      this.$store.commit("_changeCarPoint", data);
    },
    _changeCarLabelState(data, i){
      var o = [];
      o.push(data)
        this.$store.commit("_changeCarPoint", o);
        // this.$store.commit("_changeCarLabelState", "markerNodeHide");
    },
    mineral(i, item) {
      this.mineralI = i;
      this._changeCarPoint(item.carList);
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  color: white;
  text-align: center;
  height: 36px;
  line-height: 36px;
  font-size: 18px;
  margin-top: 0;
}
.dataList {
  & > li {
    border: solid 1px #1296db;
    border-radius: 6px;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 10px;
    //   transform: boxShadow
    &:hover .partInfo {
      cursor: pointer;
      background: #fbf9ea;
    }
    .mainIn {
      .mainTitle {
        margin: 0;
        background: #1296db;
        color: white;
        height: 36px;
        line-height: 36px;
        padding: 0 12px;
      }
    }
    .carListBox {
      li {
        overflow: hidden;
        border-bottom: solid 1px #ccc;
        display: flex;
        justify-content: flex-start;
        & > * {
          display: block;
          float: left;
        }
        &:hover {
          background: #fbf9ea;
          cursor: pointer;
        }
        .number {
          span {
            font-size: 14px;
            background: #1296db;
            border-radius: 100%;
            color: white;
            width: 24px;
            height: 24px;
            text-align: center;
            display: block;
            line-height: 24px;
          }
          width: 8%;
          margin: 0 6%;
          margin-top: 38px;
        }
        .carInfo {
          width: 92%;
          .carNumber {
            text-align: center;
            font-weight: bold;
          }
        }
      }
    }
    &:nth-child(odd) {
      .partInfo {
        &:before {
          content: "";
          display: block;
          width: 8px;
          height: 100%;
          background: #1296db;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
    &:nth-child(even) {
      .partInfo {
        &:before {
          content: "";
          display: block;
          width: 8px;
          height: 100%;
          background: #54c0f8;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
    .partInfo {
      position: relative;
      height: 70px;
      padding: 0 12px;
      p {
        margin: 0;
      }
      .name {
        padding-top: 12px;
        margin-left: 8px;
      }
      .fc-r {
        margin-top: 8x;
      }
    }
  }
}
</style>
