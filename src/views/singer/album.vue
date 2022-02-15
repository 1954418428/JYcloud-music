<template>
    <div class="palylist-box">
        <div class="palylist-wrap">
            <div class="left-wrap">
                <SongSheetDetail :playListDetail="playListDetail" :playListType="'专辑'"></SongSheetDetail>
                <SongSheet :songs="songs"  :trackCount="trackCount"></SongSheet>
            </div>

            <div class="right-wrap">
                <h3>
                    Ta的其他热门专辑
                </h3>
                <div class="similar-album-sheet">
                    <ul class="album-list">
                        <li class="album-item" v-for="(item) in singerHotAlbums" :key="item.id">
                            <div  class="album-img">
                                <router-link :to="`/album?id=${item.id}`">
                                    <img :src="item.picUrl+'?param=120y120'" alt="">
                                    <img src="@/assets/img/album.png" alt="" class="album-right" draggable="false">
                                </router-link>

                            </div>

                            <div class="album-name">
                                <router-link :to="`/album?id=${item.id}`">{{item.name}}</router-link>
                            </div>
                            
                            <span  class="album-time">
                                {{moment(parseInt(item.publishTime)).format('YYYY-MM-DD')}}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import SongSheetDetail from '../../components/song/SongSheetDetail';
import SongSheet from '../../components/song/SongSheet';
import SongSheetItem from '../../components/song/SongSheetItem';

import {albumApi} from '@/api';

export default {
    name: "",
    components: {SongSheetDetail,SongSheet,SongSheetItem},
    data() {
        return {
            //专辑详情
            playListDetail:{},
            //专辑歌曲列表
            songs:[],
            //歌曲数量
            trackCount:0,
            //歌手的前5个专辑
            singerHotAlbums:[]
        };
    },
    props:{},
    computed: {},
    watch: {
        '$route.query': {
            async handler (){
                if(this.$route.query.id){
                    this.initAlbumData(this.$route.query.id);
                }else{
                    console.log("错误 无专辑 id");
                }
            },
            immediate: true
        }
    },
    methods: {
        async initAlbumData(aid){
            albumApi.getAlbum(aid)
            .then(res=>{
                //歌单详情
                const {id,name,picUrl:coverImgUrl,publishTime:createTime,description,tags,company,artists,alias} =  res.album;
            

                albumApi.getSingerAlbumList({id:res.album.artist.id,limit:5,offset:0})
                .then(res=>{
                    this.singerHotAlbums = res.hotAlbums
                })

                this.songs = res.songs
                this.trackCount = this.songs.length;

                const playListDetail ={id,name,coverImgUrl,trackCount:this.trackCount,createTime,description,tags,company,artists,alias};
                this.playListDetail = playListDetail;
            });
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
.palylist-box{
    .palylist-wrap{
        width: 980px;
        margin: 0 auto;
        display: flex;
        background-color: #FFF;
        border: 1px solid #d3d3d3;;
        .left-wrap{
            width: 650px;
            min-height: 1000px;
            padding: 30px;
            .song-sheet{
                
            }
        
        }
        .right-wrap{
            width: 270px;
            border-left: 1px solid rgba($color: #000000, $alpha: 0.3);
            h3{
                height: 35px;
                line-height: 35px;
                font-size: 20px;
                font-weight: 700;
                text-align: center;
                padding: 10px 0;
            }

            .album-list{
                .album-item{
                    width: 145px;
                    margin: 0 auto;
                    margin-bottom: 12px;
                    .album-img{
                        img{
                            height: 120px;
                            width: 120px;
                        }
                        .album-right{
                            height:120px;
                            width:25px
                        }
                        a{
                            display: block;
                        }
                    }
                    
                    .album-name{
                        margin-top: 6px;
                        margin-bottom: 3px;
                        max-width: 145px;
                    }
                    .album-time{
                        color:#666
                    }
                } 
            }
        }
    } 
}
</style>