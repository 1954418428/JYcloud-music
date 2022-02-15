<template>
    <div>
        <div class="top">
            <a href=""  class="head-img">
                <img  :src="audio.album.picUrl" alt="">
                {{audio.author}}
            </a>
            <div class="audio-name">
                <a href="#" style="font-weight: 600;"  ref="srcollText" :title="audio.name">
                    {{audio.name}}
                </a>
            </div>
           
            <div class="audio-ar">
                <router-link :to="`/singer?id=${a.id}`" v-for="a in audio.artist" :key="a.id">
                    {{a.name}}
                </router-link>
            </div>
            
                      
            <div class="music-operation">
                <i class="pre-btn iconfont icon-shangyishoushangyige"
                title="上一首"
                 @click="cutSong({type:'pre'})"></i>

                <i v-if="!player.playing" class="bofang-btn iconfont icon-bofang" @click="play"
                title="播放"
                ></i>
                <i v-else class="zangting-btn iconfont icon-zanting" @click="pause"
                title="暂停"
                ></i>

                <i class="next-btn iconfont icon-xiayigexiayishou" @click="cutSong({type:'next'})"
                title="下一首"
                ></i>
            </div>
        </div>
        
        <div class="tool">
            <div class="music-slider">
                <el-slider v-model="audio.currentTime" 
                :show-tooltip="false" class="slider" 
                :max="audio.maxTime"
                @change="changeCurrentTime"
                @mousedown.native="updateIsDrag(true)"
                ></el-slider>

                <span class="music-time">
                    <em>{{formatTime(audio.currentTime)}}</em>
                    / {{formatTime(audio.maxTime)}}
                </span>
            </div>

            <div class="m-t">
                <span class="music-volume">
                    <i class="iconfont icon-volumedown" @click="updateVolume({type:'down'})" title="减音"></i>
                        {{player.volume}}
                    <i class="iconfont icon-volumeup" @click="updateVolume({type:'up'})" title="增音"></i>

                    <i class="iconfont icon-shengyinjingyin" @click="updateVolume({type:'muted'})" title="静音"
                        :style="player.volume==0 || player.muted ? 'color:red':''"
                    ></i>
                </span>

                <span class="play-type">
                    <i class="iconfont icon-shuzishunxu" title="顺序" v-show="player.playType==0" @click="updatePlayType"></i>
                    <i class="iconfont icon-24gl-shuffle" title="随机" v-show="player.playType==1" @click="updatePlayType"></i>
                    <i class="iconfont icon-xunhuan" title="循环" v-show="player.playType==2" @click="updatePlayType"></i>
                    <i class="iconfont icon-danquxunhuan" title="单曲循环" v-show="player.playType==3" @click="updatePlayType"></i>
                </span>
                <span class="op">
                    <i class="iconfont icon-lianjie" title="链接" style="font-size:20px"></i>
                    <i class="iconfont icon-shoucang" title="收藏" @click="collectClicked({tracks:[audio.id]})"></i>
                    <i class="iconfont icon-xiazai" title="下载"></i>
                </span>
                <span class="music-lyric">
                    <i class="iconfont icon-geciweidianji" 
                    :title="(clyric.isShow?'关闭':'显示')+'歌词界面'" 
                    @click="updateClyricShow"
                    :style="clyric.isShow?'color:rgb(236,65,65)':''"
                    ></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState,mapMutations,mapActions} from 'vuex'

export default {
    name: "MusicPlayerTools",
    components: {},
    data() {
        return {
        };
    },
    props:{},
    computed: mapState('PlayerModule',[
        "audio","player","clyric"
    ]),
    watch: {},
    methods: {
        ...mapMutations('PlayerModule',[
            "play","pause",
            "updateVolume",
            "updatePlayType",
            "changeCurrentTime",
            "onTimeupdate",
            "updateIsDrag",
            "updateClyricShow",
        ]),
        ...mapActions('PlayerModule',[
            "cutSong",
        ]),
         ...mapActions('CollectModule',[
           "collectClicked"
        ]),
    },
    beforeCreated() {},
    created() {     
    },
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
    //被keep-alive缓存的组件激活时调用
    activated() {},
    deactivated() {},
    }
</script>
<style lang="scss" scoped>
$baseColor:rgb(225,225,225);
$hoveColor:#fff;
.top{
    display: flex;
    justify-content: space-evenly;
    padding: 12px;
    height: 66px;
    line-height: 66px;
    
    .head-img{
        margin-right: 3px;
        img{
            height: 40px;
            width: 40px;
            vertical-align: middle;
        }   
    }

    .audio-name{
            max-width: 150px;
            margin-right: 3px;
            font-size: 14px;
            position: relative;
            overflow: auto;
            a{
                display: inline-block;
                white-space: nowrap;
            }
            &::-webkit-scrollbar {
                width: 0 !important;
                height: 0 !important;
            }
    }
    .audio-ar{
        // max-width: 60px;
        overflow: hidden;
        display: flex;
        margin-right: 3px;
        a{
            margin-right: 2px;
        }
    }

    .music-operation{
        cursor: pointer;
        .pre-btn,.next-btn{
            position: relative;
            top: -6px;
            font-size: 18px;
            width: 18px;
            height: 18px;
            padding: 5px;
            border-radius: 18px;
            border: 2px solid $baseColor;
            color: $hoveColor;
            &:hover{
                border: 2px solid $baseColor;
                color: $hoveColor;
            }
        }
        .bofang-btn,.zangting-btn{
            font-size: 36px;
            width: 36px;
            height: 36px;
            border-radius: 36px;
            margin: 0 6px;
            color: $baseColor;
            &:hover{
                color: $hoveColor;
            }
        }
    }
}

.music-slider{
    color:$baseColor;
    padding:0 18px;
    display: flex;
    height: 38px;
    line-height: 38px;
    justify-content: center;
    .slider{
        width: 65%;
        /deep/ .el-slider__bar{
            background-color: rgb(199,12,12);
        }
        /deep/ .el-tooltip{
            border:2px solid rgb(226, 139, 139);
        }
    }
    .music-time{
        padding: 0 3px;
        width: 30%;
        text-align: center;
    }
}
.m-t{
    color:$baseColor;
    height: 34px;
    line-height: 34px;
    padding: 0 18px;

    display: flex;
    justify-content: space-evenly;
    .music-volume,.play-type,.op,.music-lyric{
        i{
            margin: 0 3px;
            position: relative;
            top: 2px;
            cursor: pointer;
            font-size: 18px;
            color: $baseColor;
            &:hover{
                color: $hoveColor;
            }
        }
    }
    .music-lyric{
        i{
            font-size: 24px;
            &:hover{
                color: rgb(236,65,65);
            }
        }   
    }
}
</style>