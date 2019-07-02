<template>
    <div class="top">
        <span class="companyName fl-l">华能左权煤电有限责任公司燃料物流管理平台</span>
        <div class="closeBox fl-r">
        <img class="close" src="@/assets/images/close.png" alt="">
        </div>
        <nav class="fl-r">
            <span v-for="(nav, i) in nav" :key="i" @click="navClick(i)" :class="{active: navIndex == i}">{{nav}}</span>
        </nav>
    </div>
</template>

<script>
export default {
    data(){
        return {
            nav: ["在途监控","数据统计","行驶轨迹","报警信息"],
            navIndex: 0,
            router: ["monitoring", "datastatistics", "trajectory", "caution"]
        }
    },
    methods: {
        navClick(i){
            this.navIndex = i;
            this.$router.push(this.router[i])
        }
    }
}
</script>

<style lang='less' scoped>
.active{
    color: #1296db;
    font-size: 20px;
}
 .top{
     padding: 0 12px;
     box-sizing: border-box;
     height: 72px;
     border-bottom: solid 1px #ccc;
     overflow: hidden;
     nav{
         margin-right: 12%;
         font-family: myfont;
         font-size: 16px;
         &>*{
             margin: 0 20px;
             cursor: pointer;
         }
     }
     .close{
         margin-top: 16px;
         cursor: pointer;
     }
     .companyName{
         color: #1296db;
         font-size: 30px;
         position: relative;
         margin-left: 20px;
        //  font-weight: bold;
         font-family: myfont;
         padding-top:2px;
         &:before{
             content: "";
             display: block;
             width: 8px;
             height: 30px;
             background:#1296db;
             position: absolute;
             top: 20px;
             left: -20px;
         }
     }
     &>*{
             line-height: 72px;
         }
         .closeBox{
             margin-top: 12px;
             margin-right: 50px;
             .close{
                 width: 20px;
                 margin-left: 3px
             }
             &>*{
                 display: block;
             }
             &>span{
                 line-height: 100%;
                 margin-top: 6px;
             }
         }
 }
</style>
