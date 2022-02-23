// import Vue from 'vue'
// import Vuex from 'vuex'
import createVuexAlong  from 'vuex-along'


import PlayerModule from './PlayerModule'
import UserModule from './UserModule'
import CollectModule from './CollectModule'
import CreateSheetModule from './CreateSheetModule'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    PlayerModule,
    UserModule,
    CollectModule,
    CreateSheetModule
  },
  plugins: [createVuexAlong(
    {
      name:'vuex-data',
      local:{
        list:["UserModule"]
      },
      session: {
        list: ["PlayerModule","CollectModule","CreateSheetModule"] // 保存 count 和模块 ma 中的 a1 到 sessionStorage
      },
    }
  )]//vuex-along
})