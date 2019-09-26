<template>
  <div class="setMain">
    <div class="nav">
      <div class="line"></div>
      <ul>
        <li
          :class="{navActive: navIndex == i}"
          v-for="(e, i) of nav"
          :key="i"
          @click="tabFn(e, i)"
        >{{e}}</li>
      </ul>
    </div>

    <div class="bd">
      <div class="miners" v-if="navIndex == 0">
        <div class="top">
          <span class="fl-r" @click="addMinersAddress(true)">+新增矿点位置</span>
        </div>
        <div class="tableBox">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            :stripe="true"
          >
            <el-table-column label="序号" width="120">
              <template slot-scope="scope">{{ scope.$index+1 }}</template>
            </el-table-column>
            <el-table-column prop="mines" label="矿点名称"></el-table-column>
            <el-table-column prop="address" label="矿点地址"></el-table-column>
            <el-table-column prop="coord" label="矿点坐标"></el-table-column>
            <el-table-column prop="create_date" label="创建时间"></el-table-column>
            <el-table-column label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="editorBtn fc-g" @click="addMinersAddress(false,scope.row)">修改</span>
                <span class="deleteBtn fc-r" @click="deleteFn(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="manufactor" v-else>
        <div class="setManufactorAddress">
          <p>设置厂家位置</p>
          <baidu-map
            class="manufactormapBox"
            :center="MPoint"
            :zoom="13"
            :style="{width: width2,height: height2}"
            :scroll-wheel-zoom="true"
            @click="selectAddress"
          >
            <bm-marker v-if="MMarkP != ''" :position="MMarkP"></bm-marker>
          </baidu-map>
          <div class="addressinof">
            <div>
              <span>厂家名称：</span>

              <span class="MAddress">{{_globalVenderName}}</span>
            </div>
            <div>
              <span>百度坐标：</span>
              <input type="text" class="baiduPosition" v-model="MP" />
            </div>
            <div>
              <span>厂家位置：</span>
              <span class="MAddress">{{MA}}</span>
            </div>
            <input
              @click="commitManufactorAddress"
              type="button"
              class="commitManufactorAddress"
              value="确定"
            />
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="isShow" title="矿点位置" style="text-align: center" @close="closeFn">
      <baidu-map
        class="map"
        :center="mapPoint"
        :zoom="13"
        :style="{width: width,height: height}"
        :scroll-wheel-zoom="true"
        @click="minersMapEvent"
      >
        <bm-marker :position="minersP"></bm-marker>
      </baidu-map>
      <div class="addressinof">
        <div>
          <span>矿点名称：</span>
          <el-select v-if="newAdd" v-model="mineralname" placeholder="请选择">
            <el-option
              v-for="(item, i) in minersList"
              :key="i"
              :label="item.mineralname"
              :value="item.mineralname"
            ></el-option>
          </el-select>
          <span v-else class="MAddress">{{mineralname}}</span>
        </div>
        <div>
          <span>百度坐标：</span>
          <input type="text" class="baiduPosition" v-model="minersMapPoint" />
        </div>
        <div>
          <span>矿点位置：</span>
          <span class="newAddPointEvent">{{minersA}}</span>
        </div>
        <input @click="newAddPointEvent" type="button" class="commitManufactorAddress" value="确定" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
const carIcon = require("../../assets/images/car3.png");
export default {
  data() {
    return {
      tableData: [],
      nav: ["矿点位置", "厂家位置"],
      navIndex: 0,
      isShow: false,
      mapPoint: {
        lng: 113,
        lat: 43
      },
      width: "50%",
      height: "500px",
      width2: "50%",
      height2: "536px",
      startPoint: {
        lng: 113,
        lat: 43
      },
      endPoint: {
        lng: 113,
        lat: 43
      },
      MPoint: {
        lng: 113,
        lat: 36
      },
      MP: "",
      MA: "",
      MMarkP: "",
      newAdd: "",
      minersList: [],
      mineralname: "",
      minersP: "",
      minersA: "",
      minersMapPoint: ""
    };
  },
  created() {
    this.getTabList();

    this.getList();
    this.ajax.post(this.PF.towAPIUrl + "/monitorApi/checkVenderPositionHasExists", {
      venderId: this._venderLoginId
    }).then(res => {
      if(res.data.errorCode == 200){
        this.MP = res.data.body.info.coord;
        this.MA = res.data.body.info.address;
      }
    })
  },
  computed: mapState({
    _venderLoginId: state => state._venderLoginId,
    _globalVenderName: state => state.globalVenderName
  }),
  watch: {
    MP() {
      var _self = this;
      var point, pointStr;
      if (typeof this.MP !== "string") {
        point = this.MP;
        pointStr = this.MP.lat + "," + this.MP.lng;
        this.MP = pointStr;
      }
      var geoc = new BMap.Geocoder();
      var parsePoint = this.MP.split(",");
      point = new BMap.Point(parsePoint[1], parsePoint[0]);
      this.MMarkP = point;
      this.MPoint = point;
      geoc.getLocation(point, function(rs) {
        var addComp = rs.addressComponents;
        _self.MA = rs.address;
      });
    },
    minersMapPoint() {
      var _self = this;
      this.persePoint(this.minersMapPoint, function(a) {
        _self.minersA = a.address;
      });
    }
  },
  methods: {
    getTabList() {
      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/venderMinePositionList", {
          venderId: this._venderLoginId
        })
        .then(res => {
          if (res.data.errorCode == 200) {
            this.tableData = res.data.body.list;
          } else {
            this.$alert(res.data.msg);
          }
        });
    },
    getList() {
      //矿点位置列表

      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/getMinesListByVenderId", {
          vendername: this._globalVenderName,
          status: "1",
          venderId: this._venderLoginId
        })
        .then(res => {
          console.log(0);
          if (res.data.errorCode == 200) {
            this.minersList = res.data.body.list;
          } else {
            this.$alert(res.data.msg);
          }
        });
    },
    closeFn() {
      this.mineralname = "";
      this.minersMapPoint = "";
      this.minersA = "";
    },
    deleteFn(a) {
      this.$confirm("确定删除此矿点位置信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ajax
            .post(this.PF.towAPIUrl + "/monitorApi/deleteMinePosition", a)
            .then(res => {
              if (res.data.errorCode == 200) {
                this.$alert("删除成功");
                this.getTabList();
              } else {
                this.alert(res.data.msg);
              }
            });
        })
        .catch(() => {
          return;
        });
    },
    newAddPointEvent() {
      if (this.minersMapPoint == "") {
        this.$alert("请输入位置");
        return;
      }
      if (this.mineralname == "") {
        this.$alert("请选择矿点");
        return;
      }
      var param = {
        venderId: this._venderLoginId,
        venderName: this._globalVenderName,
        mine: this.mineralname,
        coord: this.minersMapPoint,
        address: this.minersA
      };
      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/UpdateVenderMinePosition", param)
        .then(res => {
          if (res.data.errorCode == 200) {
            this.$alert("成功");
            this.getTabList();
            this.minersMapPoint = "";
            this.minersA = "";
            this.isShow = false;
          } else {
            this.$alert(res.data.msg);
          }
        });
    },
    persePoint(point, cb) {
      var _self = this;
      var pointStr, newp;
      var geoc = new BMap.Geocoder();

      if (typeof point !== "string") {
        pointStr = point.lng + "," + point.lat;
        var newp = new BMap.Point(point.lng, point.lat);
      } else {
        var newp = new BMap.Point(point.split(",")[0], point.split(",")[1]);
      }
      this.minersP = newp;
      this.mapPoint = newp;
      geoc.getLocation(newp, function(rs) {
        var addComp = rs.addressComponents;
        var obj = {
          pointStr: pointStr,
          address: rs.address
        };
        cb(obj);
      });
    },
    commitManufactorAddress() {
      if (this.MP == "") {
        this.$alert("请填写地址");
        return;
      }
      var param = {
        venderId: this._venderLoginId,
        coord: this.MP,
        address: this.MA
      };
      this.ajax
        .post(this.PF.towAPIUrl + "/monitorApi/UpdateVenderPosition", param)
        .then(res => {
          if (res.data.body == 200) {
            this.$alert("成功");
          } else {
            this.$alert(res.data.msg);
          }
        });
    },
    minersMapEvent(e) {
      this.minersP = e.point;
      this.minersMapPoint = e.point.lng + "," + e.point.lat;
      var _self = this;
      this.persePoint(e.point, function(a) {
        _self.minersA = a.address;
      });
      // console.log(a)
    },
    selectAddress(e) {
      this.MP = e.point;
    },
    addMinersAddress(a, b) {
      this.newAdd = a;
      if (a) {
        this.mapPoint = {
          lng: 113,
          lat: 43
        };
      } else {
        this.mineralname = b.mines;
        var point = {
          lng: b.coord.split(",")[0],
          lat: b.coord.split(",")[1]
        };
        this.MPoint = point;
        this.minersP = point;
        this.minersMapPoint = b.coord;
      }
      this.isShow = true;
    },
    tabFn(e, i) {
      this.navIndex = i;
    }
  }
};
</script>



<style lang="less">
.setMain {
  .addressinof {
    & > div {
      overflow: hidden;
      line-height: 36px;
      & > * {
        display: block;
        float: left;
      }
    }
  }
  .el-dialog__body {
    overflow: hidden;
  }
  .el-dialog {
    width: 68%;
  }
  td,
  th {
    text-align: center;
  }
}
</style>

<style lang="less" scoped>
.tableBox {
  height: 660px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 30px;
}
.MAddress {
  text-align: left;
}
.editorBtn {
  margin-right: 50px;
}
.editorBtn,
.deleteBtn {
  cursor: pointer;
}
.map {
  float: left;
}
.commitManufactorAddress {
  width: 180px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: none;
  background: linear-gradient(#1d5acb, #0671af);
  margin: 0 auto;
  color: white;
  display: block;
  cursor: pointer;
}
.addressinof {
  float: left;
  padding: 0 8%;
  margin-top: 30px;
  width: 50%;
  & > div {
    margin: 60px 0;
    width: 100%;
    .MAddress {
      display: inline-block;
    }
    input,
    .MAddress {
      padding-left: 6px;
      height: 36px;
      line-height: 36px;
      border-radius: 4px;
      border: solid 1px #ccc;
      width: 70%;
    }
  }
}
.manufactormapBox {
  float: left;
}
.setManufactorAddress {
  width: 98%;
  height: 600px;
  border: solid 1px #ccc;
  border-radius: 6px;
  p {
    height: 60px;
    line-height: 60px;
    background: #e4e4e4;
    margin: 0;
    text-align: center;
  }
}
.manufactor {
  margin-top: 30px;
}
.top {
  overflow: hidden;
  .fl-r {
    cursor: pointer;
    color: green;
    margin: 40px 0;
    margin-right: 30px;
  }
}
.nav {
  position: relative;
  .line {
    position: absolute;
    border-bottom: solid 1px #ccc;
    left: 0;
    width: 100%;
    bottom: 0;
  }
  ul {
    overflow: hidden;
    height: 66px;
  }
  li {
    float: left;
    width: 150px;
    line-height: 66px;
    border: solid 1px #ccc;
    border-bottom: none;
    text-align: center;
    cursor: pointer;
    &:nth-child(1) {
      border-right: none;
    }
    &.navActive {
      border-top: solid 2px #0671af;
      position: relative;
      background: white;
      border-bottom: solid 1px white;
    }
  }
}
</style>
