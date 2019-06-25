import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    _mon: {},
    _carList: [],
    _carLabelState: false
  },
  mutations: {
    _changeMon(a, b){
        a._mon = b;
    },
    _changeCarPoint(a, b){
      console.log(b)
        a._carList = b;
    },
    _changeCarLabelState(a, b){
        console.log(b)
        a._carLabelState = b
    }
  },
  actions: {

  }
})
