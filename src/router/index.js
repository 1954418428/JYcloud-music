// import Vue from 'vue'
// import VueRouter from 'vue-router'
// Vue.use(VueRouter)

import globalBeforeEach from './globalBeforeEach';
;


const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue'),
    meta:{title:'简易云音乐'},
  },
  {
    path: '/playlist',
    name: 'playlist',
    component: () => import('../views/song/playList.vue'),
    meta:{title:'歌单详情',requiredQuery:['id']},
  },
  {
    path: '/album',
    name: 'album',
    component: () => import('../views/singer/album'),
    meta:{title:'专辑详情'},
  },
  {
    path: '/discoverPlayList',
    name: 'discoverplaylist',
    component: () => import('../views/song/discoverPlayList.vue'),
    meta:{title:'发现歌单-简易云音乐',fullQuery:['cat']},
  },
  {
    path: '/topplaylist',
    name: 'topplaylist',
    component: () => import('../views/song/topPlayList.vue'),
    meta:{title:'排行榜-简易云音乐',requiredQuery:['id']},
  },
  {
    path: '/discoversinger',
    name: 'discoversinger',
    component: () => import('../views/singer/discoverSinger.vue'),
    meta:{title:'发现歌手-简易云音乐',fullQuery:['area','type','initial']},
  },
  {
    path: '/discovermv',
    name: 'discovermv',
    component: () => import('../views/mv/discoverMV.vue'),
    meta:{title:'发现mv-简易云音乐',fullQuery:['area','type','order']},
  },
  {
    path: '/songplaying',
    name: 'songplaying',
    component: () => import('../views/song/songPlaying.vue'),
    meta:{title:'音乐播放ing',requiredQuery:['id']},
  },
  {
    path: '/mv',
    name: 'mv',
    component: () => import('../views/mv/mv.vue'),
    meta:{title:'mv详情',requiredQuery:['id']},
  },
  {
    path: '/singer',
    name: 'singer',
    component: () => import('../views/singer/index.vue'),
    redirect:"/singer/hotmusic",
    meta:{title:'歌手详情',requiredQuery:['id']},
    children:[
      {
        path: '',
        name: 'hotmusic',
        component: () => import('../views/singer/hotMusic.vue'),
        alias:"/singer",
        meta:{title:'歌手热门歌曲',requiredQuery:['id']},
      },
      {
        path: 'allalbum',
        name: 'allalbum',
        component: () => import('../views/singer/allAlbum.vue'),
        meta:{title:'歌手专辑详情',requiredQuery:['id'],fullQuery:['offset','limit']},
      },
      {
        path: 'allmv',
        name: 'allmv',
        component: () => import('../views/singer/allMv.vue'),
        meta:{title:'歌手mv',requiredQuery:['id'],fullQuery:['offset','limit']},

      },
      {
        path: 'singerdesc',
        name: 'singerdesc',
        component: () => import('../views/singer/singerDesc.vue'),
        meta:{title:'歌手简介',requiredQuery:['id']},

      },
      
    ]
  },
  {
    path: '/mymusic',
    name: 'mymusic',
    component: () => import('../views/mymusic/index.vue'),
    meta:{isLogin:true,title:'我的音乐'},
    children:[
      {
        path: 'myplaylist',
        name: 'mymusic-myplaylist',
        component: () => import('../views/mymusic/myPlayList.vue'),
        meta:{isLogin:true,title:'我的歌单',requiredQuery:['id']},
      },
      {
        path: 'myartist',
        name: 'mymusic-myartist',
        component: () => import('../views/mymusic/mySinger.vue'),
        meta:{isLogin:true,title:'我收藏的歌手'},
      },
      {
        path: 'mymv',
        name: 'mymusic-mymv',
        component: () => import('../views/mymusic/myMv.vue'),
        meta:{isLogin:true,title:'我收藏的mv'},
      }
    ]
  },
  {
    path: '/user/home',
    name: 'userhome',
    component: () => import('../views/user/home.vue'),
    meta:{title:'用户中心',requiredQuery:['id']},
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/system/login.vue'),
    meta:{title:'登入-简易云音乐'},
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/system/search.vue'),
    meta:{title:'搜索-简易云音乐',requiredQuery:['keywords','type']},
  },
  {
    path: '/notFound',
    name: 'notFound',
    component: () => import('../views/system/notFound.vue'),
    meta:{title:'网页找不到'},
  },

]

const router = new VueRouter({
  mode:'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach(globalBeforeEach);

export default router
