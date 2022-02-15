<template>
    <div class="music-player-box" ref="musicPlayer" style="left: -400px;" 
    >
        <audio
        ref="audioObj"
        :src="audio.url"
        controls
        @play="updatePlayState({playing:true})"
        @pause="updatePlayState({playing:false})"
        @timeupdate="onTimeupdate"
        @loadedmetadata="onLoadedmetadata"
        @ended="onEnded"
        style="display:none"
        >
        </audio>

        <div class="music-player-wrap">
            <MusicPlayerTools></MusicPlayerTools>
            <PlayingSheet></PlayingSheet>
        </div>

        <div class="lock" @click="lockMusicPlayer">
            <!-- 固定界面 显示锁是关的 -->
            <i v-show="player.isLock" class="iconfont icon-shuyi_guansuo"></i>
            <!-- 未固定界面 显示锁是开的 -->
            <i v-show="!player.isLock" class="iconfont icon-shuyi_kaisuo"></i>
        </div>
    </div>
</template>

<script>
import MusicPlayerTools from './MusicPlayerTools';
import PlayingSheet from './PlayingSheet';

import { mapState,mapMutations,mapActions} from 'vuex'

export default {
    name: "MusicPlayer",
    components: {MusicPlayerTools,PlayingSheet},
    data() {
        return {
          
        };
    },
    props:{},
    computed: mapState('PlayerModule',[
        "audio","player"
    ]),
    watch: {
        "player.isLock":{
            handler(){
                console.log("player.isLock被改变,当前值为:",this.player.isLock);
                this.lockTimer(!this.player.isLock);
            },
            immediate: true
        }
    },
    methods: {
        ...mapMutations('PlayerModule',[
            "initAudioObj",
            "updatePlayState",
            "onTimeupdate",
            "onLoadedmetadata"
        ]),
        ...mapActions('PlayerModule',[
           "onEnded","asyncUpdateIsLock"
        ]),

        lockTimer(isLock){
            // console.log("lockTimer被执行");
            this.timer = setInterval(()=>{
                let curr = parseInt(this.$refs.musicPlayer.style.left);
                if(isLock){
                    if(curr <= -400){
                        // console.log("销毁");
                        clearInterval(this.timer)
                        return;
                    }
                }else{
                     if(curr >= 0){
                        // console.log("销毁");
                        clearInterval(this.timer)
                        return;
                    }
                }
                let v;
                if(isLock){
                    //此时是固定的 变为未固定
                    // 0 -> -400
                    v=curr - 10;
                }else{
                    //此时是未固定的 变为固定
                    //-400 -> 0
                    v=curr + 10;
                }
                this.$refs.musicPlayer.style.left  = v+"px"
            },10)
        },
        lockMusicPlayer(){
            if(this.player.isLock){
                console.log("显示 -> 隐藏");
                this.asyncUpdateIsLock({
                    isLock:false
                })
            }else{
                console.log("隐藏 -> 显示");
                this.asyncUpdateIsLock({
                    isLock:true
                })
            }            
            
        },
        
        
    },
    beforeCreated() {},
    created() {
        // dom更新完毕后执行
        this.$nextTick(()=>{
            this.initAudioObj( {audioObj:this.$refs.audioObj})
        })

        // this.lockMusicPlayer()

        
    },
    beforeMount() {},
    mounted() {
        // const audio = this.$refs.audio
        // console.log(audio);
    },
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
.music-player-box{
    position: relative;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    // top: 0px;
    width: 400px;
    height: 520px;

    color: rgb(245,245,245);
    background-color: rgba(46,46,46,0.9);
    z-index: 501;
}

.lock{
    position: absolute;
    top: 50%;
    right: -46px;
    transform: translateY(-50%);
    border-left: 30px solid rgb(60,60,60);
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent; 
    height: 30px; 
    cursor: pointer;
    i{
        position: relative;
        top: 6px;
        left: -24px;
    }
}
</style>