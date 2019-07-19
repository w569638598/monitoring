<template>
  <div>
    <div class="selectBox">
      <span class="fl-l">筛选：</span>
      <el-date-picker
        v-model="sDate"
        type="date"
        placeholder="日期"
        value-format="yyyy-MM-dd"
        class="fl-l"
      ></el-date-picker>
      <el-select v-model="mine" placeholder="选择矿点" style="width: 180px" class="fl-l">
        <el-option
          v-for="item in mineData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="fl-l searchBtn">查找</span>
      <span class="fl-r" @click="addMine">+&nbsp;新增矿点围栏</span>
    </div>
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
      <el-table-column prop="mines" label="预约矿点"></el-table-column>
      <el-table-column prop="commandmsg" label="报警类型"></el-table-column>
      <el-table-column prop="eventtime" label="报警时间"></el-table-column>
      <el-table-column prop="hasRead" label="状态" width="120"></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.hasRead == '已读'"></span>
          <span v-else @click="operationread(scope.row, scope.$index)">标记为已读</span>
          <span @click="operationInfo(scope.row)">详情</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px;"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="dataLength"
      @current-change="getData"
    ></el-pagination>

    <el-dialog :visible.sync="isShow" title="新增围栏" class="deviateDialog">
      <div class="po-re">
        <baidu-map
          :class="{isShow: isShow}"
          class="map"
          :center="mapPoint"
          :zoom="zoom"
          :style="{width: width,height: height}"
          :scroll-wheel-zoom="true"
          @click="paintPolyline"
          @mousemove="syncPolyline"
          @rightclick="newPolyline"
        >
          <bm-marker v-for="(item, i) of markerPointArr" :position="item" :key="i"></bm-marker>
          <!-- <bm-control>
            <button @click="toggle('polyline')">{{ polyline.editing ? '停止绘制' : '开始绘制' }}</button>
          </bm-control>-->
          <bm-polyline :path="path" v-for="path of polyline.paths"></bm-polyline>
        </baidu-map>

        <span class="po-ab positionDiv" @click="mapPosition, toggle('polyline')">
          <!-- <img src="../../assets/images/mapToolIcon/position.png" alt />
          <img src="../../assets/images/mapToolIcon/position-c.png" alt />-->
        </span>

        <span
          v-if="polyline.editing"
          class="po-ab positionDiv"
          @click="mapPosition, toggle('polyline')"
        >结束</span>
        <span v-else class="po-ab positionDiv" @click="mapPosition, toggle('polyline')">绘制</span>

        <span class="po-ab backDiv" @click="back">
          <!-- <img src="../../assets/images/mapToolIcon/back.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/back-c.png" alt />
        </span>

        <span v-if="zoomState" class="po-ab narrowDiv" @click="narrow">
          <!-- <img src="../../assets/images/mapToolIcon/narrow.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/narrow-c.png" alt />
        </span>

        <span v-else class="po-ab enlargeDiv" @click="enlarge">
          <!-- <img src="../../assets/images/mapToolIcon/enlarge.png" alt /> -->
          <img src="../../assets/images/mapToolIcon/enlarge-c.png" alt />
        </span>

        <span class="po-ab reset" @click="endPainting">
          <!-- <img src="../../assets/images/mapToolIcon/enlarge.png" alt />
          <img src="../../assets/images/mapToolIcon/enlarge-c.png" alt />-->
          <img src="../../assets/images/mapToolIcon/reset.png" alt width="30px;" />
        </span>
        <span class="po-ab done" style="background: none;">
        <img
          src="../../assets/images/mapToolIcon/commit.png"
          alt
          width="80px;"
        />
        <img
          src="../../assets/images/mapToolIcon/commit-c.png"
          alt
          width="80px;"
        />
        </span>
        <!-- <img src="../../assets/images/mapToolIcon/enlarge.png" alt />
        <img src="../../assets/images/mapToolIcon/enlarge-c.png" alt />-->
        <!-- 保存 -->

        <div class="mapAboveSearch po-ab">
          <el-select v-model="mine" placeholder="选择矿点" class="fl-l">
            <el-option
              v-for="item in mineData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!-- <div class="btn">
        <input type="buttom" value="确定" class @click="endPainting" />
        <input type="buttom" value="取消" class="cancel" @click="cleanMapOverlay"/>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 0,
      dataLength: null,
      stripe: true,
      border: true,
      tableData: [],
      zoomState: true,
      mineData: [
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
      markerPointArr: [],
      mine: "",
      sDate: this.PF.getToDay(),
      isShow: false,
      mapPoint: {
        lat: 39,
        lng: 114
      },
      width: "100%",
      height: "778px",
      zoom: 12,
      polyline: {
        editing: false,
        paths: []
      }
    };
  },
  mounted() {
    this.markerPointArr.push(this.mapPoint);
    console.log(this.markerPointArr);
  },
  methods: {
    cleanMapOverlay() {
      this.polyline.paths = [];
      this.markerPointArr = [];
    },
    toggle(name) {
      this[name].editing = !this[name].editing;
      console.log(this.polyline.paths);
    },
    syncPolyline(e) {
      // console.log(this.polyline.editing)
      // if (!this.polyline.editing) {
      //   return
      // }
      // const {paths} = this.polyline
      // if (!paths.length) {
      //   return
      // }
      // const path = paths[paths.length - 1]
      // if (!path.length) {
      //   return
      // }
      // if (path.length === 1) {
      //   path.push(e.point)
      // }
      // this.$set(path, path.length - 1, e.point)
    },
    newPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        paths.push([]);
      }
      const path = paths[paths.length - 1];
      path.pop();
      if (path.length) {
        paths.push([]);
      }
    },
    paintPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      !paths.length && paths.push([]);
      this.markerPointArr.push(e.point);
      paths[paths.length - 1].push(e.point);
    },
    handleSelectionChange() {},
    selectFn(selection, row) {
      selection.forEach(el => {
        this.ids.push(el.id);
      });
    },
    addMine() {
      this.isShow = true;
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
        pagesNo: a ? a - 1 : 0
      });
      this.ajax.post("monitorApi/getWaringList ", param).then(res => {
        res.data.body.result.forEach(el => {
          el.appointmentDate = el.appointmentDate
            ? this.PF.parseDate(el.appointmentDate)
            : "-";
          el.hasread = el.hasread ? "已读" : "未读";
        });
        this.dataLength = res.data.body.size;
        this.tableData = res.data.body.result;
      });
    },
    mapPosition() {},
    back() {
      if (!this.polyline.editing) {
        return;
      }
      console.log(this.polyline.paths[0]);
      this.polyline.paths[0].pop();
      this.markerPointArr.pop();
    },
    enlarge() {
      if (this.zoom >= 18) {
        this.zoomState = true;
        return;
      }
      this.zoom += 2;
    },
    narrow() {
      if (this.zoom <= 2) {
        this.zoomState = false;
        return;
      }
      this.zoom -= 2;
    },
    endPainting() {
      this.polyline.editing = false;
      this.polyline.paths[0].push(this.polyline.paths[0][0]);
      // this.markerPointArr.push(this.markerPointArr[0]);
      this.markerPointArr = [];
    }
  }
};
</script>

<style lang="less">
.deviateDialog {
  .el-dialog {
    border-radius: 6px;
    overflow: hidden;
  }
  .el-dialog {
    width: 86%;
    height: 86%;
    margin-top: 6vh !important;
  }
  .el-dialog__header {
    background: #0671af;
    .el-dialog__title,
    .el-dialog__close {
      color: white;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-select {
    width: 630px;

    margin: 0 auto;
    display: block;
    float: inherit;
    line-height: 60px;

    .el-input__inner {
      height: 44px;
      font-size: 16px;
    }
    &::-webkit-input-placeholder {
      color: #333;
    }
  }
}
</style>
<style lang="less">
.mapAboveSearch {
  width: 660px;
  height: 60px;
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 50%;
  margin-left: -377px;
}
.selectBox {
  margin-bottom: 14px;
  overflow: hidden;
  background: rgba(222, 236, 245, 1);
  height: 63px;
  padding: 0 10px 0 50px;
  & > * {
    margin-right: 12px;
    line-height: 63px;
  }
  .searchBtn,
  .fl-r {
    color: #0671afff;
    cursor: pointer;
  }
  .fl-r {
    margin-right: 80px;
  }
}
.positionDiv {
  left: 20px;
  top: 110px;
  text-align: center;
  line-height: 72px;
  font-size: 20px;
  color: white;
}
.backDiv {
  left: 20px;
  top: 200px;
}
.enlargeDiv {
  left: 20px;
  top: 20px;
}
.narrowDiv {
  left: 20px;
  top: 20px;
}
.reset {
  left: 20px;
  top: 290px;
}
.done {
  left: 20px;
  bottom: 80px;
  & img{
    &:nth-child(1){
      display: none
    }
    &:nth-child(2){
      display: block
    }
  }
  &:hover img{
    &:nth-child(1){
      display: block
    }
    &:nth-child(2){
      display: none
    }
  }
}
.positionDiv,
.backDiv,
.enlargeDiv,
.narrowDiv,
.reset,
.done {
  background: #0671af;
  width: 72px;
  height: 72px;
  border-radius: 5px;
  text-align: center;
  line-height: 72px;
  font-size: 20px;
  transition: all 0.8s;
  &:hover {
    background: #074a71;
    cursor: pointer;
  }
}
</style>
