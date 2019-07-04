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

    <div class="right fl-r">
      <p class="r-title">报警信息</p>
      <div class="selectOption">
        筛选：
        <el-date-picker
          style="margin-top:6px;"
          v-model="startDate"
          type="date"
          placeholder="开始时间"
          value-format="yyyy-MM-dd"
          class="fl-l"
        ></el-date-picker>

        <el-date-picker
          style="margin-top:6px;"
          v-model="endDate"
          type="date"
          placeholder="结束时间日期"
          value-format="yyyy-MM-dd"
          class="fl-l"
        ></el-date-picker>

        <el-select v-model="read" placeholder="请选择阅读状态" style="width: 180px">
          <el-option
            v-for="item in readState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="warning" placeholder="报警类型" style="width: 180px">
          <el-option
            v-for="item in warningState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="sortDate" placeholder="选择倒序排列时间" style="width: 180px">
          <el-option
            v-for="item in sortDateState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input class="carNumber" placeholder="输入车牌号" v-model="driverNumber" clearable></el-input>
        <!-- <span>重置</span> -->
        <span @click="operationSome" style="cursor:pointer; color: #4596db">标记所选项为已读</span>
        <span style="font-size: 12px;" class="fl-r">
          <img src="../assets/images/tips.png" alt width="16px;" height="16px;" style="position: relative;top: 4px;" />
          共{{dataLength}}条报警信息
        </span>
      </div>
      <router-view></router-view>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :stripe="stripe"
        :border="border"
        @select="selectFn"
      >
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column label="序号" width="120">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column prop="platenum" label="车牌号"></el-table-column>
        <el-table-column prop="appointmentDate" label="预约卸货时间"></el-table-column>
        <el-table-column prop="companyName" label="预约矿点"></el-table-column>
        <el-table-column prop="commandmsg" label="报警类型"></el-table-column>
        <el-table-column prop="eventtime" label="报警时间"></el-table-column>
        <el-table-column prop="hasRead" label="状态" width="120"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.hasRead == '已读'"></span>
            <span v-else @click="operationread(scope.row, scope.$index)">标记为已读</span>
            <span @click="operationInfo(scope.row, scope.$index)">详情</span>
          </template>
        </el-table-column>
      </el-table>
            <el-pagination
  background
  layout="prev, pager, next"
  :page-size="pageSize"
  :current-page="currentPage"
  :total="dataLength"
  @current-change="getData"
  >
</el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      pageSize: 2,
      currentPage: 0,
      stripe: true,
      border: true,
      dataLength: null,
      driverNumber: "",
      active: 0,
      ids: [],
      idstr: "",
      leftNav: [
        "报警信息",
        "统计报表",
        "路线偏离",
        "断电报警",
        "停车超时",
        "温度过高",
        "GPS故障",
        "设置"
      ],
      startDate: this.PF.getToDay(),
      endDate: this.PF.getToDay(),
      readState: [
        {
          label: "请选择阅读状态",
          value: 2
        },
        {
          label: "已读",
          value: 1
        },
        {
          label: "未读",
          value: 0
        }
      ],
      read: "",
      warningState: [
        {
          label: "请选择报警类型",
          value: 0
        },
        {
          label: "路线偏离",
          value: 9
        },
        {
          label: "停车超时",
          value: 10
        },
        {
          label: "断电报警",
          value: 2
        },
        {
          label: "温度过高",
          value: 5
        },
        {
          label: "GPS故障",
          value: 11
        }
      ],
      warning: "",
      sortDateState: [
        {
          label: "请选择倒序排列时间",
          value: 0
        },
        {
          label: "预约卸货时间",
          value: "appointmentdate"
        },
        {
          label: "报警时间",
          value: "eventtime"
        }
      ],
      sortDate: "",
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },
  computed: mapState({
    _venderLoginId: state => state._venderLoginId
  }),
  methods: {
    operationSome() {
      this.operationread(this.ids.join(","));
    },
    selectFn(selection, row) {
        selection.forEach(el => {
          this.ids.push(el.id);
        });
    },
    navClick(i) {
      this.$message({
        message: "敬请期待",
        center: true,
        duration: 1000
      });
      return;
      this.active = i;
    },
    operationread(a, b) {
      var param
      if (a.id) {
         param = this.qs.stringify({
          ids: a.id
        });
      }else{
         param = this.qs.stringify({
          ids: a
        });
      }
      var _self = this
      this.ajax.post("monitorApi/updateWaring", param).then(res => {
        if(res.data.errorCode == 200){
          this.getData();
        }
      });
    },
    getData(a) {
      this.read = this.read === 2 ? "" : this.read;
      this.sortDate = this.sortDate === 0 ? "" : this.sortDate;
      this.warning = this.warning === 0 ? "" : this.warning;
      let param = this.qs.stringify({
        venderId: this._venderLoginId,
        hasRead: this.read,
        driverNumber: this.driverNumber,
        startDate: this.startDate,
        endDate: this.endDate,
        waringType: this.warning,
        sortBy: this.sortDate,
        pagesNo: a ? a-1 : 0
      });
      this.ajax.post("monitorApi/getWaringList ", param).then(res => {
        res.data.body.result.forEach(el => {
          console.log(res);
          el.appointmentDate = el.appointmentDate
            ? this.PF.parseDate(el.appointmentDate)
            : "-";
          el.hasRead = el.hasRead ? "已读" : "未读";
          // el.appointmentDate =
        });
        this.dataLength = res.data.body.size;
        this.tableData = res.data.body.result;
      });
    },
    handleSelectionChange() {},
    operationInfo(data, i) {
      console.log(data, i);
    }
  },
  watch: {
    startDate() {
      this.getData();
    },
    endDate() {
      this.getData();
    },
    read() {
      this.getData();
    },
    warning() {
      this.getData();
    },
    sortDate() {
      this.getData();
    },
    driverNumber() {
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="less" scoped>

td {
  span {
    color: cornflowerblue;
    margin-right: 16px;
    cursor: pointer;
  }
}
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
.right {
  width: calc(100% - 250px);
  margin: 0 20px;
  .carNumber {
    width: 12%;
  }
  input{
    width: 120px !important;
  }
  .selectOption {
    margin-bottom: 30px;
    & > * {
      margin-right: 12px;
    }
  }
}
.el-table .cell {
  text-align: center;
}
</style>
