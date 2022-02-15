<template>

  <div id="app">

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

</style>
