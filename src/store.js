import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
    _parentEventState: -1
  },
  mutations: {
    _changeMon(a, b){
        a._mon = b;
    },
    _changeCarPoint(a, b){
        a._carList = b;
    },
    _changeCarLabelState(a, b){
        a._carLabelState = b
    },
    _changeVender(a, b){      
      a._venderList = b;
    },
    _warchType(a, b){
      a._tabType = b;
    },
    _selectVender(a, b){
      a._venderName = b;
    },
    _changeDiverInfo(a, b){
      a._saveDiverInfo = b
    },
    _changePath(a, b){
      a._lushuPath = b
    },
    _changeCarLabelIndex(a, b){
      a._carLabelIndex = b
    },
    CLICK_MINERAL(a, b){
      a.MINERAL_ONCLICK = b
    },
    _parentEvent(a, b){
      a._parentEventState++;
    }
  },
  actions: {

  }
})
