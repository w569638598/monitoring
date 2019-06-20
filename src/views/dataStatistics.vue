<template>
  <div>
    <div class="dataInfo fl-l">
      <div class="top">
        <img src="../assets/images/flag.png" alt width="19px" height="29px;">
        选择日期
        <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
        <span class="fl-r fc-r">
          <img src="../assets/images/tips.png" alt width="16px;" height="16px;">
          小提醒，请选择时间，用来查询数据
        </span>
      </div>
      <div class="table">
        <p class="title">当日全部矿点</p>

        <div class="dataList">
          <p>当日预报</p>
          <div>
            <div class="fl-l">
              <span class="number">260</span>
              <span class="type">车数</span>
            </div>
            <div class="fl-r">
              <span class="number">260</span>
              <span class="type">车数</span>
            </div>
          </div>
        </div>
      </div>
      <div class="charts">
        <div class="fl-l">
          <p class="title">数据统计及走势图(当日全部矿点)</p>
          <div class="chars" id="charts1">

          </div>
        </div>
        <div class="fl-l">
          <p class="title">当日数据比例图</p>
          <div class="chars"></div>
        </div>
      </div>
    </div>
    <right-data-list style="float: right" :pageType="pageType"></right-data-list>
  </div>
</template>

<script>
import RightDataList from "../components/rightDataList";
export default {
  data() {
    return {
      date: "",
      pageType: "dataStatistics"
    };
  },
  created() {
  },
  components: {
    RightDataList
  }
};
</script>

<style lang="less" scoped>
.dataInfo {
  width: 76%;
  margin-left: 4%;
  .top {
    height: 60px;
    border-bottom: solid 1px #ccc;
  }
  .table {
      .dataList{
          float: left;
          width: 30%;
          margin: 20px 1.5%;
          &>*{
              width: 50%;
              text-align: center
          }
      }
  }
  .charts{
      clear: both;
  }
  .title {
    position: relative;
    font-size: 24px;
    color: #1296db;
    &::before {
      position: absolute;
      top: 4px;
      left: -20px;
      content: "";
      display: block;
      width: 6px;
      height: 26px;
      background: #1296db;
    }
  }
}
</style>
