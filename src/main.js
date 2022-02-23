import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment';

import CatchStorage from '@/utils/catch'


import '@/assets/css/reset.css' //重置样式
import '@/assets/css/iconfont.css' //阿里图标库样式

// 引入element-ui
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui';
Vue.use(ElementUI)

import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload);


Vue.config.productionTip = false

//时间戳 转 日期
Vue.prototype.moment = moment

//秒 转 分钟
Vue.prototype.formatTime =function(second){
  second = parseInt(second)
  // 几分钟
  let mimute = Math.floor(second / 60);
  // 几秒钟
  second = second-mimute*60;
  // 两位数时 抛弃首个0
  return ('0'+mimute).slice(-2)+":"+('0'+second).slice(-2)
}

// 缓存数据
Vue.prototype.catchStorage = new CatchStorage();

Vue.prototype.parseCount = function (Count) {  
  if(Count < 10000){
    return Count
  }
  if(Count < 100000000){
    return parseInt(Count/10000) + '万'
  }
  return parseInt(Count / 100000000) + '亿'
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
