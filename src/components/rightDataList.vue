<template>
    <!-- 右边数据列表 -->
    <div class="rightBox">
      <div class="tabNavBg"></div>
      <ul class="navBox">
        <li
          v-for="(item, index) in rightNav"
          :key="index"
          @click="tabFn(index)"
          :class="{active: tabI == index}"
        >{{item}}</li>
      </ul>
      <div class="tabC">
        <div v-if="tabI == 0">
          <p v-if="pageType == 'monitoring' || pageType == 'dataStatistics'" class="title bc-b">全部矿点</p>
          <div v-else-if="pageType == 'trajectory'">
            <p>选择预约时间<span class="fl-r fc-r">按自由时间段查询</span></p>
                <el-date-picker
      v-model="date"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
          </div>

          <ul class="dataList">
            <li v-if="pageType == 'dataStatistics'"></li>
            <li v-else v-for="(item, index) in dataList" :key="index" @click="mineral(index)">
              <div class="partInfo" v-if="mineralI != index">
                <p class="name">{{item.title}}</p>
                <p class="fc-r fl-r">共{{2}}车</p>
              </div>
              <div class="mainIn" v-else>
                <p class="mainTitle">
                  <span>{{item.title}}</span>
                  <span class="fl-r">共2车</span>
                </p>
                <ul class="carListBox">
                  <li v-for="(item, index) in carList" :key="index" @click="emitCarInfo(item)">
                    <div class="number"><span>{{index++}}</span></div>
                    <div class="carInfo">
                      <p class="carNumber fc-r">{{item.carN}}</p>
                      <p class="address">{{item.address}}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <h1>2222222222222</h1>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: ["pageType"],
data(){
    return {
        rightNav: ["矿点分类", "供应单位分类"],
        tabI: 0,
        date: () => {
          let data = new Date()
          return 
        },
      dataList: [
        {
          title: "asdfa----------------"
        },
        {
          title: "asdfa11111111"
        },
        {
          title: "asdfa22222222"
        },
        {
          title: "asdfa33333333"
        }
      ],
      mineralI: -1,
      carList: [
          {
              carN: "豫A1231231",
              address: "河南郑州新郑"
          },
          {
              carN: "豫A--------",
              address: "北京天安门"
          }
      ]
    }
},
methods: {
        tabFn(i) {
      this.tabI = i;
    },
    mineral(i) {
      this.mineralI = i;
    },
    emitCarInfo(item){
      this.$emit("pullData", item)
    }
}
}
</script>

<style lang="less" scoped>
.rightBox {
    width: 20%;
    .tabNavBg {
      background: #f0f4ff;
      height: 46px;
      border-bottom: solid 1px #ccc;
    }
    .navBox {
      z-index: 2;
      overflow: hidden;
      position: relative;
      top: -44px;
      li {
        display: block;
        float: left;
        text-align: center;
        height: 32px;
        line-height: 32px;
        position: relative;
        margin-top: 12px;
        cursor: pointer;
        &:first-child {
          width: 42%;
          margin-left: 4%;
        }
        &:last-child {
          width: 54%;
        }
        &.active {
          background: white;
          border-radius: 3px;
          border: solid 1px #ccc;
          border-bottom: none;
        }
      }
    }
    .tabC {
      .title {
        color: white;
        text-align: center;
        height: 36px;
        line-height: 36px;
        font-size: 18px;
        margin-top: 0;
      }
      .dataList {
        &>li {
          border: solid 1px #1296db;
          border-radius: 6px;
          width: 90%;
          margin: 0 auto;
          margin-bottom: 10px;
        //   transform: boxShadow
          &:hover .partInfo{
            cursor: pointer;
              background: #fbf9ea
            }
          .mainIn{
              .mainTitle{
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
                  span{
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
              .carInfo{
                  width: 92%;
                  .carNumber{
                      text-align: center;
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
    }
  }
</style>
