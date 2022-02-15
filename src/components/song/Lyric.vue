<template>
    <div class="lyric-box" 
    ref="lyricBox" 
    >
        
        <div class="left-box">
            <div class="left-top">
                <div class="music-img"
                    :class="player.playing ? 'playing' : 'playing noPlaying'"
                      @click="cpClicked"
                     :title="player.playing ? '暂停音乐' : '播放音乐'"
                >
                    <img src="../../assets/img/唱片.png" alt=""
                        class="changpian-img"
                      
                    >
                    <img v-if="audio.album.picUrl" :src="audio.album.picUrl" alt="" class="m-img"
                    >
                </div>
            </div>
        </div>  
        
        <div class="right-box">
            <div class="music-title">
                <h2>
                    <a href="#">{{audio.name}}</a>
                    
                </h2>
                <h3>
                    <router-link :to="`/singer?id=${a.id}`" 
                    v-for="(a,index) in audio.artist" 
                    :key="a.id+'-'+index"
                    >
                        {{ a.name }}
                    </router-link>
                </h3>
            </div>
             <ul ref="lyricUL" class="lyric-ul" id="lyric-ul">
                <li v-for="(item, index) in lyricArr"  
                :key="item.uid+'-'+index" 
                :data-index='index' 
                ref="lyricLI"  class="lyric-li"
                :class="lyricActiveIndex ==index ? 'lyric-active':''"
                >

                    <i class="iconfont icon-youjiantou" >

                    </i>
                    <span >
                        <!-- {{item.oldTime}} -->
                        <!-- {{item.time}} -->
                        <!-- {{index}} -->
                    </span>
                    {{item.lyric}} 
                    <!-- -- {{index}} -->
                    <i class="iconfont icon-yinle" :title="'跳转到'+item.oldTime" @click="tiaozhuan(index,item.time)">
                    </i>
                </li>
            </ul>
            
            <div class="offsetTime-wrap">
                <i class="iconfont icon-xiangzuojiantou" @click="updateOffsetTime('down')"></i>
                <span >{{offsetTime}}s</span>
                <i class="iconfont icon-xiangyoujiantou" @click="updateOffsetTime('up')"></i>
            </div>
            
        </div>
    </div>
</template>

<script>
import {songApi} from '@/api';

import {mapState,mapMutations} from 'vuex';
export default {
    name: "",
    components: {},
    data() {
        return {
            lyric:'',
            lyricArr:[],
            lyricActiveIndex:0,
            lyricULHeight:0,//整个ul高度
            lyricLiHeight:0,//每个li高度
            scrollHeight:0,//滚动条高度
            offsetTime:0,//偏移时间
            top:0,//当前歌词li顶部 距ul顶部的距离
           
        };
    },
    props:{},
     computed: mapState('PlayerModule',[
        "audio","player"
    ]),
    watch: {
        'audio.id': {
            handler (){
               if(this.audio.id == 0){
                   this.lyric=''
                   this.lyricArr=[]
                   return
               }
               this.initLyric(this.audio.id)
            },
            // 深度观察监听
            deep: true,
            immediate: true
        },
        'audio.currentTime': {
            handler (){
                // console.log("当前播放时间:",this.audio.currentTime);

                for (let i = 0; i < this.lyricArr.length; i++) {
                    //如果这句歌词的时间 大于 音乐当前的时间 就高亮这句歌词是上一句歌词
                    if(this.lyricArr[i].time > this.audio.currentTime + this.offsetTime){
                        // console.log("高亮",i-1);
                        
                        // 法1
                        //比较高亮歌词与当前处理歌词是否一样  不一样表示切换了高亮词 才会判断是否滚动滚动条
                        //可能由于歌词间隔时间太长 当前歌词的时间 大于多个音乐当前时间 导致 高亮歌词一直未变
                        if( this.$refs.lyricLI[i-1].dataset.index !=this.lyricActiveIndex){
                        
                                // this.top +=this.lyricLiHeight;
                                // // console.log(this.top);
                                // //歌词到中间时才开始移到
                                // if(this.top > 5 * this.lyricLiHeight){
                                //     const move = this.$refs.lyricUL.scrollTop +  this.lyricLiHeight;
                                //     this.$refs.lyricUL.scrollTo(0,move); 
                                // }

                            const move  = this.lyricActiveIndex*this.lyricLiHeight - (4 * this.lyricLiHeight)
                            // console.log("move",move);
                            this.$refs.lyricUL.scrollTo(0,move); 
                        }

                        //切换高亮歌词
                        this.lyricActiveIndex = this.$refs.lyricLI[i-1].dataset.index;
                        // 法2
                        // const move  = this.lyricActiveIndex*this.lyricLiHeight - (5 * this.lyricLiHeight)
                        // console.log("move",move);
                        // this.$refs.lyricUL.scrollTo(0,move); 

                        break;
                    }
                }
            },
            // 深度观察监听
            deep: true,
            immediate: true
        },
    },
    methods: {
        ...mapMutations('PlayerModule',[
            "play","pause","changeCurrentTime"
        ]),
        //旋转唱片被单击
        cpClicked(){
            if(this.player.playing){
                this.pause();
            }else{
                this.play();
            }
        },
        //格式化歌词
        parseLyric(lyric){
            console.log(lyric);
            let reg = /\n/
            const lineArr = lyric.split(reg)
            reg = /\[\d{2}:\d{2}.\d{2,3}\]/
            let R = []
            lineArr.forEach(item =>{
                let obj ={
                    oldTime:'',//分
                    time:0,//秒
                    lyric:''//词
                }
                if(item == "" || item == null) return;
               const r =  item.match(reg)
                let  t =  r ? r[0].slice(1) : ""
                t = t ? t.slice(0,t.length-1) : ""
                const youIndex =  item.indexOf(']')
                let ci = item.slice(youIndex+1,item.length)

                obj.oldTime = t.split('.')[0];

                let x = t.split(':');
                const min =  parseInt(x[0]) ;
                let y = x[1].split('.');
                const sec = parseInt(y[0]);
                const ms = parseInt(y[1]);
                let time = min * 60 + sec +ms/1000;
                obj.time = time;
               

                obj.lyric =ci? ci.trim() :'···';
                obj.uid = Math.random().toString().slice(-6)
                R.push(obj)
            })
            //时间升序排序
            R.sort((item1,item2)=>{
                return item1.time - item2.time;
            })
            R.push({
                time:R[R.length-1].time+1,
                lyric:'音乐播放结束',
                uid : Math.random().toString().slice(-6)

            })
            R.push({
                time:R[R.length-1].time+1,
                lyric:'',
                uid : Math.random().toString().slice(-6)

            })
            console.log(R);
            return R;
        },
        initLyric(id){
            songApi.getLyric(id)
            .then(res=>{
                this.lyric = res.lrc.lyric;
                // console.log(this.lyric );
                this.lyricArr = this.parseLyric(this.lyric)
                // console.log(this.lyricArr );
                this.$nextTick(()=>{
                    console.log(this.$refs.lyricUL);
                    this.lyricULHeight = this.$refs.lyricUL.offsetHeight;
                    this.lyricLiHeight = this.$refs.lyricLI[0].offsetHeight;
                    this.scrollHeight = this.$refs.lyricLI.length * this.lyricLiHeight;
                    this.top = 0;
                    this.offsetTime = 0;
                    this.$refs.lyricUL.scrollTo(0,0); 
                    console.log("ul高:",this.lyricULHeight);
                    console.log("li高:",this.lyricLiHeight);
                    console.log("li个数:",this.$refs.lyricLI.length);
                    console.log("滚动条高:",this.scrollHeight);
                    console.log(document.getElementById("lyric-ul").offsetTop);          
                    
                    //立马跳到播放音乐的位置
                    for(let i =0;i<this.lyricArr.length;i++){
                        if(this.audio.currentTime < this.lyricArr[i].time){
                            this.lyricActiveIndex = (i-1);
                        const move  = this.lyricActiveIndex *this.lyricLiHeight - (5 * this.lyricLiHeight)
                        this.$refs.lyricUL.scrollTo(0,move); 
                        break;
                    }
            }

                })
            })
        },
        tiaozhuan(index,time){
            this.lyricActiveIndex = index;
            const move  = this.lyricActiveIndex*this.lyricLiHeight - (5 * this.lyricLiHeight)
            this.$refs.lyricUL.scrollTo(0,move); 
            this.changeCurrentTime(time)
        },
        updateOffsetTime(type){
            if(type == 'up'){
                this.offsetTime += 0.5;
            }else{
                this.offsetTime -= 0.5;

            }
        }
    },
    beforeCreated() {},
    created() {

    },
    beforeMount() {},
    mounted() {
           
         
   
    },
    beforeUpdate() {},
    updated() {

    },
    beforeDestroy() {},
    destroyed() {},
    //被keep-alive缓存的组件激活时调用
    activated() {},
    deactivated() {},
    }
</script>
<style lang="scss" scoped>

.lyric-box{
    display: flex;
   
    .left-box{
        width: 250px;
        padding: 10px 5px;
        box-sizing: border-box;
        .left-top{
            position: relative;
            text-align: center;
            margin: 20px;

            .music-img{
                position: relative;
                width: 200px;
                height: 200px;
                text-align: center;
                display: inline-block;
                cursor: pointer;
                .changpian-img{
                    width: 200px;
                    height: 200px;
                    border-radius: 100px;
                    box-shadow: 0 0 16px rgb(0,0,0);            
                }

                .m-img{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    width: 120px;
                    height: 120px;
                    border-radius: 60px;
                } 
            }
        }
    }  
    .right-box{
        flex-grow: 1;
        padding: 10px;
        text-align: center;
        position: relative;
        .music-title{
            h2{
                height: 32px;
                line-height: 32px;
                font-size: 20px;
            }
            h3{
                height: 28px;
                line-height: 28px;
                font-size: 18px;
            }
        }
        .lyric-ul{
            overflow-y: scroll;
            color: #333;
            height: 440px;
            margin:10px 30px;
            /*滚动条样式*/
            &::-webkit-scrollbar {/*滚动条整体样式*/
                width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
            }
            &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                border-radius: 5px;
                -webkit-box-shadow: inset 0 0 5px rgb(225,225,225);
                background: rgb(165,165,165);
            }
            &::-webkit-scrollbar-track {/*滚动条里面轨道*/
                -webkit-box-shadow: inset 0 0 5px rgba(235,235,235,0.9);
                border-radius: 0;
                background: rgba(235,235,235,0.9);
            }
            li{
                position: relative;
                height: 32px;
                line-height: 32px;
                font-size: 14px;
                font-weight: 600;
                overflow: hidden;
                cursor: pointer;
                span{
                    position:absolute;
                    left: 0px;
                    color: black;
                }
                .icon-youjiantou{
                    position: absolute;
                    left: 6px;
                    display: none;
                    
                }
                .icon-yinle{
                    right: 16px;
                   position: absolute;
                    display: none;
                }
                
                &:hover{
                    .icon-yinle{
                        display: inline-block;
                    }
                }
            }
        }
        .offsetTime-wrap{
            position: absolute;
            top: 40px;
            right: 30px;
            i,span{
                display: inline-block;
                height: 30px;
                line-height: 30px;
                font-size: 24px;
                cursor: pointer;
            }
            i{
                min-width: 30px;
            }
            span{
                min-width: 60px;
            }
        }
    }
    .lyric-active{
        background: linear-gradient(to right, red, blue);
        background-clip: text;
        color: transparent;
        font-weight: 700;
        font-size: 20px !important;
        .icon-youjiantou{
            display: inline-block !important;
            background: linear-gradient(to right, red, blue);
            background-clip: text;
            color: transparent;
        }
    }
}

.playing{
    animation: rotation 6s linear infinite; 
    @keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
    }
}
.noPlaying{
    -webkit-animation-play-state:paused; /* Safari 和 Chrome */
    animation-play-state:paused;
}
</style>