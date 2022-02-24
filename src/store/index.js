import Vue from 'vue'
import Vuex from 'vuex'
import createVuexAlong  from 'vuex-along'


import PlayerModule from './PlayerModule'
import UserModule from './UserModule'
import CollectModule from './CollectModule'
import CreateSheetModule from './CreateSheetModule'
import CommentModule from './CommentModule'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    PlayerModule,
    UserModule,
    CollectModule,
    CreateSheetModule,
    CommentModule
  },
  plugins: [createVuexAlong(
    {
      name:'vuex-data',
      local:{
        list:["UserModule"]
      },
      session: {
        list: ["PlayerModule","CollectModule","CreateSheetModule"]
      },
      session: {
        list: ["CommentModule","UserModule"],
        isFilter: true 
      },
    }
  )]//vuex-along
})