<template>
  <div>
    <div class="dataInfo fl-l">
      <div class="top">
        <img src="../assets/images/flag.png" alt width="19px" height="29px;">
        选择日期
        <el-date-picker v-model="date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="dateFn"></el-date-picker>
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
          <v-chart ref="chart1" :options="orgOptions" :auto-resize="true"></v-chart>
        </div>
        <div class="fl-l">
          <p class="title">当日数据比例图</p>
          <v-chart :options="polar"></v-chart>
        </div>
      </div>
    </div>
    <right-data-list style="float: right" :pageType="pageType"></right-data-list>
  </div>
</template>

<script>
import ECharts from "vue-echarts/components/ECharts";

import 'echarts'


import RightDataList from "../components/rightDataList";
export default {
  data() {
    return {
      date: "",
      pageType: "dataStatistics",
      orgOptions: {},
      polar: {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
}
    };
  },
  created() {
    this.orgOptions = {
    legend: {},
    tooltip: {},
    dataset: {
        source: [
            ['product', '2015', '2016', '2017'],
            ['Matcha Latte', 43.3, 85.8, 93.7],
            ['Milk Tea', 83.1, 73.4, 55.1],
            ['Cheese Cocoa', 86.4, 65.2, 82.5],
            ['Walnut Brownie', 72.4, 53.9, 39.1]
        ]
    },
    xAxis: {type: 'category'},
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
        {type: 'bar'},
        {type: 'bar'},
        {type: 'bar'}
    ]
};

  },
  components: {
    RightDataList,
    "v-chart": ECharts
  },
  methods: {
    dateFn(a){
      console.log(a);
    }
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
    .dataList {
      float: left;
      width: 30%;
      margin: 20px 1.5%;
      & > * {
        width: 50%;
        text-align: center;
      }
    }
  }
  .charts {
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
