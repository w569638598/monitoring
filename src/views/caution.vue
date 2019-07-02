<template>
  <div>
    <div class="left">
      <div>
        <p class="title">报警信息</p>
        <ul>
          <li></li>
        </ul>
      </div>
    </div>

    <div class="right">
      <p class="r-title"></p>
      <div class="selectOption">
        筛选：
        <el-date-picker
          style="margin-top:6px;"
          v-model="date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          class="fl-l"
        ></el-date-picker>

        <el-select v-model="value" placeholder="阅读状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="value" placeholder="报警类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="value" placeholder="选择倒序排列时间">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input class="carNumber" v-model="input" placeholder="输入车牌号"></el-input>

        <span>查找</span>
        <span>标记所选项为已读</span>
        <span>
          <img src="../assets/images/tips.png" alt width="16px;" height="16px;">
          共{{}}条报警信息
        </span>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="车牌号" width="120"></el-table-column>
        <el-table-column prop="name" label="预约卸货时间" width="120"></el-table-column>
        <el-table-column prop="name" label="预约矿点" width="120"></el-table-column>
        <el-table-column prop="name" label="报警类型" width="120"></el-table-column>
        <el-table-column prop="name" label="报警时间" width="120"></el-table-column>
        <el-table-column prop="name" label="定位状态" width="120"></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        }
    }
};
</script>

<style>

</style>
