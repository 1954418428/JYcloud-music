<template>

  <div id="app" class="app">

    <!-- 顶部导航栏 -->
    <TopBar/>
    
    <!-- <keep-alive include="index"> -->
          <router-view/>
    <!-- </keep-alive> -->

    <!-- 底部 -->
    <Floor></Floor>
    
    <!-- 音乐播放器 -->
    <MusicPlayer></MusicPlayer>
    <!-- 歌词解析器 -->
    <Musiclyric></Musiclyric>

    <!-- 收藏歌单 -->
    <CollectSheet></CollectSheet>
    <!-- 创建或修改歌单 -->
    <CreateSheet></CreateSheet>

    <el-backtop target=".app" :visibility-height="100" :bottom="60"></el-backtop>
<el-backtop></el-backtop>
  </div>
</template>

<script>
import TopBar from "./components/system/TopBar"
import Floor from "./components/system/Floor"
import MusicPlayer from './components/system/MusicPlayer';
import Musiclyric from './components/system/Musiclyric';
import CollectSheet from './components/system/CollectSheet';
import CreateSheet from './components/system/CreateSheet';

export default {
    name: "",
    components: {TopBar,Floor,MusicPlayer,Musiclyric,CollectSheet,CreateSheet},
    data() {
        return {

        };
    },
    props:{},
    computed: {},
    watch: {},
    methods: {},
    beforeCreated() {},
    created() {
      //10分钟执行一次
      this.workerTimer = setInterval(() => {
        for (let  i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i); //获取本地存储的Key
            if(key.startsWith(this.catchStorage.prefix)){
              //取每一个缓存数据 过期的会被删除的 未过期了依然保留
              this.catchStorage.getCatchItem(key);
            }
        }
      }, 1000*60*20);
    },
    mounted(){

    },

    }
</script>

<style lang="scss">
#app{
      background-color: rgb(245,245,245);
      position: relative;
      min-width: 980px;
      min-height: 100%;
}

.app{
  // height: 100vh;
  // overflow-x:hidden;
}
</style>
