import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getVenderId = function (cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default new Vuex.Store({
  state: {
    _mon: {},
    _carList: [],
    _carLabelState: false,
    _venderList: [],
    _tabType: 1,
    _venderName: "",
    _saveDiverInfo: {
      diverNumber: "",
      startDate: "",
      "endDate": ""
    },
    _lushuPath: [],
    _carLabelIndex: -1,
    MINERAL_ONCLICK: -10,
    _parentEventState: -1,
    _trajectoryState: false,
    globalVenderName: process.env.NODE_ENV === "production" ? getVenderId("PC_venderName") : "云到收费",
    _venderLoginId: process.env.NODE_ENV === "production" ? getVenderId("venderLoginId") : "999",
    _isShowRight: false
    //a5d77c301d4f44d698257116f6d4a3d4
    // getVenderId("venderLoginId")
  },
  mutations: {
    _changeMon(a, b) {
      a._mon = b;
    },
    _changeCarPoint(a, b) {
      a._carList = b;
    },
    _changeCarLabelState(a, b) {
      a._carLabelState = b
    },
    _changeVender(a, b) {
      a._venderList = b;
    },
    _warchType(a, b) {
      a._tabType = b;
    },
    _selectVender(a, b) {
      a._venderName = b;
    },
    _changeDiverInfo(a, b) {
      a._saveDiverInfo = b
    },
    _changePath(a, b) {
      a._lushuPath = b
    },
    _changeCarLabelIndex(a, b) {
      a._carLabelIndex = b
    },
    CLICK_MINERAL(a, b) {
      a.MINERAL_ONCLICK = b
    },
    _parentEvent(a, b) {
      a._parentEventState++;
    },
    _trajectoryInit(a, b) {
      a._trajectoryState = b;
    },
    _changeGlobalVenderName(a, b) {
      a.globalVenderName = b;
    },
    _changeDiverNumber(a, b) {
      a._saveDiverInfo = b
    },
    _changeRightState(a, b) {
      a._isShowRight = b
    }
  },
  actions: {

  }
})