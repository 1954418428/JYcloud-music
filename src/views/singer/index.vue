<template>
    <div class="mv-box">
        <div class="mv-wrap">
            <div class="left-wrap">
                <div class="singer-content">
                    <div class="head">
                        <i class="iconfont icon-13maikefeng-2"></i>
                        <h2>{{artist.name}}</h2>
                    </div>
                    <div class="singer-img">
                       <img
                        v-lazy="{src: artist.cover+'?param=640y300', error: require('@/assets/img/歌手详情.jpg'), loading: require('@/assets/img/歌手详情.jpg')}"
                        alt="">
                    </div>

                    <ul class="mn">
                       <li>
                           <router-link :to="`/singer?id=${singerId}`" active-class="mn-active" exact>热门作品</router-link>
                       </li>
                        <li>
                           <router-link :to="`/singer/allalbum?id=${singerId}`" active-class="mn-active" >所有专辑</router-link>
                       </li>
                       <li>
                           <router-link :to="`/singer/allmv?id=${singerId}`" active-class="mn-active">相关mv</router-link>
                       </li>
                        <li>
                           <router-link :to="`/singer/singerdesc?id=${singerId}`" active-class="mn-active" >艺人介绍</router-link>
                       </li>
                    </ul>

                     <div class="a-count">
                            <div>单曲数：{{artist.musicSize}}</div>
                            <div>专辑数：{{artist.albumSize}}</div>
                            <div>视频数：{{artist.mvSize}}</div>
                    </div>
                </div>

               

            <keep-alive>
                <router-view :artist="artist"></router-view>
            </keep-alive>

            </div>

            <div class="right-wrap">
                <div class="similar-singer">
                    <div class="similar-head">
                        相似歌手
                    </div>
                    <ul class="sm-list">
                        <li v-for="artist in simiArtist.slice(0,9)" :key="artist.id">
                            <router-link :to="`/singer?id=${artist.id}`">
                                 <img  
                                 v-lazy="{src: artist.picUrl+'?param=70y70', error: require('@/assets/img/歌手.png'), loading: require('@/assets/img/歌手.png')}"
                                 alt=""> 

                                <span>{{artist.name}}</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Replay from '../../components/system/Replay';
import Comment from '../../components/system/Comment';

import {singerApi} from '@/api';
export default {
    name: "",
    components: {Replay,Comment},
    data() {
        return {
            singerId:0,//歌手id
            artist:{},//歌手信息
            simiArtist:[],//相似歌手列表
        };
    },
    props:{},
    computed: {},
    watch: {
        '$route.query': {
            async handler (){
                if(this.$route.query.id){
                    this.singerId = this.$route.query.id;

                    singerApi.getSingerDetail(this.singerId)
                    .then(res=>{
                        this.artist=res.data.artist;
                    });
                    
                    singerApi.getSimiSinger(this.singerId)
                    .then(res=>{
                        this.simiArtist=res.artists;
                    });
                }else{
                    console.log("错误 无歌手 id");
                }
            },
            immediate: true
        }
    },

    methods: {},
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
.mv-box{
    .mv-wrap{
        width: 980px;
        margin: 0 auto;
        display: flex;
        background-color: white;
        .left-wrap{
            box-sizing: border-box;
            width: 710px;
            padding: 30px;
            border-left: 1px solid rgba(0,0,0,0.2);
            border-right: 1px solid rgba(0,0,0,0.2);

            .singer-content{
                margin-bottom: 18px;
                position:relative;
                .head{
                    // height: 36px;
                    min-height: 36px;
                    line-height: 36px;
                    margin-bottom: 10px;
                    &::after{
                        display: block;
                        content: "";
                        clear: both;
                    }
                    & > :nth-child(n){
                        float: left;
                        margin-right: 10px;
                    }
                   .icon-13maikefeng-2,h2{
                        font-size: 24px;
                    }
                    h3{
                        color: #999;
                        font-weight: normal;
                        position: relative;
                        top: 4px;
                    }
                 
                }
                .singer-img{
                    width: 648px;
                    height: 304px;
                    position: relative;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .a-count{
                    background-color: rgba($color: #000000, $alpha: 0.2);
                    border-radius: 6px;
                    padding: 6px;
                    position: absolute;
                    color: white;
                    bottom: 32px;
                    font-size: 14px;
                }
                .mn{
                    height: 32px;
                    line-height: 32px;
                    background-color: rgb(245,245,245);
                    display: flex;

                    .mn-active{
                            border-bottom:1px solid white;                
                            border-left: 1px solid rgba(0,0,0,0.2);
                            border-right: 1px solid rgba(0,0,0,0.2);
                            background-color: white;
                    }    
                  
                   li{
                       width: 134px;
                       font-size: 14px;
                       text-align: center;
                       a{
                           height: 32px;
                           border:1px solid transparent;
                           box-sizing: border-box;
                           display: block;
                         
                       }
                      
                   }
                }
            }
        }

        .right-wrap{
            box-sizing: border-box;
            width: 270px;
            padding:30px 18px;
            border-right: 1px solid rgba(0,0,0,0.2);
            .similar-head{
                height: 24px;
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: 600;
                color: #333;
                border-bottom: 1px solid rgba(0,0,0,0.2);
            }

            .sm-list{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-evenly;
                li{
                    margin-bottom: 16px;
                    width: 70px;
                    position: relative;
                    img{
                        flex-shrink: 0;
                        width: 70px;
                        height: 70px;
                    }
                    span{
                        display: block;
                        text-align: center;
                    }
               
                }
            }
        }
    }
}


</style>