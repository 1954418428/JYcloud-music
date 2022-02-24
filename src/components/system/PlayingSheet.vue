<template>
    <div class="bofang-list">
            <div class="list-h">
                播放列表
                <span>
                    <a href="javascript:void(0)" @click.prevent="addAllSong">
                        <i class="iconfont icon-shoucang"></i>
                        收藏全部
                    </a>
                    <a href="javascript:void(0)" @click.prevent="clearSongs">
                        <i class="iconfont icon-shanchu"></i>
                        清除全部
                    </a>
                </span>
            </div>
            <ul>
                <li v-for="(item,index) in player.songs" :key="item.id" @dblclick="asyncUpdateAudio({currentIndex:index})"
                >
                    <div class="c1" :style="index==player.currentIndex ?'color:rgb(236,65,65);font-weight: 700;':''">
                        <span @click="asyncUpdateAudio({currentIndex:index})" title="播放">
                            <i class="iconfont icon-bofang"></i>
                        </span>
                        <a href="javascript:void(0)" @click.prevent="gotoSongplaying(index,item.id)" :title="item.name">
                            {{item.name}}
                        </a>
                        <a v-if="item.mv" href="javascript:void(0)" @click.prevent="gotoMv(item.mv)">
                            <i class="iconfont icon-MV"></i>
                        </a>
                    </div>
                    <div class="c2">
                            <i class="iconfont icon-shanchu" title="移出列表" @click="asyncRemoveSong({removeIndex:index})"></i>
                            <i class="iconfont icon-xiazai"></i>
                            <i class="iconfont icon-shoucang" @click="collectClicked({tracks:[item.id]})" title="收藏音乐"></i>
                    </div>
                    <div class="c3" :style="index==player.currentIndex ?'color:rgb(236,65,65);font-weight: 700;':''">
                        <router-link :to="`/singer?id=${a.id}`" v-for="(a,index) in item.ar" :key="a.id+'-'+index">
                            {{a.name+" "}}
                        </router-link>
                    </div>
                    <div class="c4">
                        <span>
                            {{formatTime(item.dt / 1000)}}
                        </span>
                    </div>
                    <div class="c5">
                        <i class="iconfont icon-lianjie"></i>
                    </div>
                </li>
            </ul>
    </div>
</template>

<script>
import { mapState,mapMutations,mapActions} from 'vuex'
import {sheetApi} from '@/api';
export default {
    name: "PlayingSheet",
    components: {},
    data() {
        return {

        };
    },
    props:{
    },
   computed: mapState('PlayerModule',[
        "player"
    ]),
    watch: {},
    methods: {
        ...mapMutations('PlayerModule',[
            "pause"
        ]),
        ...mapActions('PlayerModule',[
            "asyncUpdateAudio","clearSongs","asyncRemoveSong","asyncUpdateIsLock"
        ]),
        ...mapActions('CollectModule',[
           "collectClicked"
        ]),
    

        gotoSongplaying(index,id){
            this.$router.push({path:`/songplaying?id=${id}`});
            this.asyncUpdateIsLock({
                    isLock:false
            })
            if(index !=this.player.currentIndex){
                 this.asyncUpdateAudio({currentIndex:index})
            }
           
        },
        gotoMv(mvid){
            console.log(mvid);
            this.pause();
            this.$router.push({path:`/mv?id=${mvid}`});
            this.asyncUpdateIsLock({
                    isLock:false
            })
        },


        addAllSong(){
            if(this.player.songs && this.player.songs.length){
                const tracks = [];
                this.player.songs.forEach(item=>{
                    tracks.push(item.id);
                })
                 this.collectClicked({tracks})
            }else{
               
            }
            

        }
    },
    beforeCreated() {},
    created() {},
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
    .bofang-list{
        color: whitesmoke;
        background-color: rgba(50,50,50,0.5);
        .list-h{
            height: 34px;
            line-height: 34px;
            font-size: 18px;
            padding: 3px 10px;
            font-weight: 500;
            background-color: rgba(30,30,30,0.5);
            span{
                float:right;
                font-size: 14px;
                // line-height: 24px;
                a{
                    margin: 0 4px;
                    color:$baseColor;
                    &:hover{
                        color: $hoveColor;
                    }
                }
            }
        }
        ul{
            height: 318px;
            overflow-y: scroll;
             /*滚动条样式*/
            &::-webkit-scrollbar {/*滚动条整体样式*/
                width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
            }
            &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                border-radius: 5px;
                -webkit-box-shadow: inset 0 0 5px #999;
                background: #666;
            }
            &::-webkit-scrollbar-track {/*滚动条里面轨道*/
                -webkit-box-shadow: inset 0 0 5px rgb(0,0,0);
                border-radius: 0;
                background: rgba(0,0,0,0.1);
            }
            li{
                display: flex;
                height: 30px;
                line-height: 30px;
                padding-left: 10px;
                cursor: pointer;
                .c1{
                    width: 40%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    i{
                        position: relative;
                        top: 1px;
                    }
                    .icon-MV{
                        font-size: 18px;
                        position: relative;
                        top: 3px;
                        color: rgb(236, 65, 65);
                    }
                    
                }
                .c2{
                    width: 20%;
                    visibility: hidden;
                    i{
                        margin: 0 3px;
                    }
                }
                .c3{
                    width: 22%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .c4{
                    width: 10%;
                    padding-left: 2px;
                }
                &:hover{
                    background-color: rgb(13,13,13);
                    .c2{
                        visibility: visible;
                    }
                }
            }
        }
    }
</style>