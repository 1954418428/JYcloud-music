<template>
    <div class="search-box">
        <div class="search-wrap">
            <div class="SearchBox">
                <SearchBox @emitInputValue="getInputValue" @emitInputEnter="inputIsEnter"
                    :searchKey="keywords"
                ></SearchBox>
            </div>

            <div>
                <div>
                    <el-tabs v-model="type" type="card" @tab-click="typeUpdate">
                        <el-tab-pane label="单曲" name="1">
                            <SongSheet :songs="songs" :playCount="0" :trackCount="songs.length"
                            :c2 = "288"
                            :c4= "200"
                            :c5 = "280"
                            ></SongSheet>
                        </el-tab-pane>

                        <el-tab-pane label="歌手" name="100">
                            <ul class="artists-ul">
                                <li v-for="(item,index) in artists" :key="item.id +'-'+index">
                                    <div>
                                        <router-link :to="`/singer?id=${item.id}`">
                                            <img :src="item.picUrl+'?param=160y160'" alt="">
                                        </router-link>
                                    </div>
                                    <router-link :to="`/singer?id=${item.id}`" class="singer-name">{{item.name}}</router-link>
                                </li>
                            </ul>
                        </el-tab-pane>

                        <el-tab-pane label="专辑" name="10">
                            <ul class="albums-ul">
                                <li v-for="(item,index) in albums" :key="item.id+'-'+index">
                                    <div  class="album-img">
                                        <router-link :to="`/album?id=${item.id}`">
                                            <img :src="item.picUrl+'?param=120y120'" alt="">
                                            <img src="../../assets/img/album.png" alt="" class="album-right" draggable="false">
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
                        </el-tab-pane>

                        <el-tab-pane label="歌单" name="1000">
                            <ul class="playlists-ul">
                                <li v-for="(item,index) in playlists" :key="item.id+'-'+index">
                                    <SongSheetItem :songSheetItem="item"></SongSheetItem>
                                </li>
                            </ul>
                        </el-tab-pane>

                        <el-tab-pane label="mv" name="1004">
                            <ul class="mvs-ul">
                                <li v-for="(item,index) in mvs" :key="item.id+'-'+index">
                                    <div class="mv-img">
                                        <router-link :to="`/mv?id=${item.id}`">
                                            <img :src="item.cover+'?param=290y160'" alt="">
                                        </router-link>
                                        <span class="play-count">
                                            <i class="iconfont icon-video"></i>
                                            {{parseCount(item.playCount)}}
                                        </span>
                                    </div>

                                    <p class="mv-name"  >
                                        <router-link :to="`/mv?id=${item.id}`">{{item.name}}</router-link>
                                    </p>
                                    
                                    <router-link  v-for="(a,i) in item.artists" :key="a.id +'-'+i"  :to="`/singer?id=${a.id}`" class="author-name">
                                        {{a.name}}
                                    </router-link>
                                </li>
                            </ul>
                        </el-tab-pane>

                        <el-tab-pane label="用户" name="1002">
                            <ul class="userprofiles-ul">
                                <li v-for="(item,index) in userprofiles" :key="item.userId+'-'+index"
                                    :style="index%2!=0 ? 'background-color:rgb(247,247,247)':'' "
                                >
                                    <div style="margin-right:16px;float:left">
                                        <router-link :to="`/user/home?id=${item.userId}`">
                                            <img :src="item.avatarUrl+'?param=60y60'" alt="">
                                        </router-link>
                                    </div>
                                    <div style="float:left">
                                        <router-link :to="`/user/home?id=${item.userId}`" 
                                        >
                                         {{item.nickname}}
                                        </router-link>
                                        <span class="sex">
                                            <i class="iconfont icon-nan" style="color:rgb(38,166,228)" v-if="item.gender ==1"></i>
                                            <i class="iconfont icon-nv" style="color:rgb(255,181,211)" v-else></i>
                                        </span>

                                        <p>
                                            {{item.signature || '无简介'}}
                                        </p>
                                    </div>
                                    
                                     <div class="fs">
                                        粉丝：{{item.followeds}}
                                    </div>

                                    <div class="gd">
                                        歌单：{{item.playlistCount}}
                                    </div>
                                   
                                </li>
                            </ul>
                        </el-tab-pane>

                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchBox from '../../components/system/SearchBox';
import {systemApi} from '@/api';
import SongSheet from '../../components/song/SongSheet';
import SongSheetItem from '../../components/song/SongSheetItem';
export default {
    name: "search",
    components: {SearchBox,SongSheet,SongSheetItem},
    data() {
        return {
            type:"1",//类型 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
            keywords:'',
            albums:[],//专辑
            userprofiles:[],//用户
            mvs:[],//mv
            playlists:[],//歌单
            artists:[],//歌手
            songs:[],//歌曲
            dataKeys:["songs","artists","albums","playlists","mvs","userprofiles"]
        };
    },
    props:{},
    computed: {},
    watch: {
        "$route.query":{
            handler(){
                const {keywords,type} = this.$route.query;
                console.log(keywords,type);
                this.keywords=keywords;
                this.type= type;
                this.getResult(keywords,type);
               
            },
            immediate:true
        }
    },
    methods: {
        typeUpdate(tab){

            this.$router.push({
                path:`/search?keywords=${this.keywords}&type=${this.type}`
            })
        },
        getResult(keywords,type){
            systemApi.search({
                keywords,type,
                limit:40,
                offset:0
                }
            ).then(res=>{
                // console.log(res);
                
                const resultKeys = Object.keys(res.result);
                let k ="";
                resultKeys.forEach(item =>{
                    if(this.dataKeys.indexOf(item) !=-1) {
                        k=item;
                        return;
                    }
                })
                this[k] = res.result[k];
            })
        },
        getInputValue(v){
            // console.log("getInputValue");
            if(v){
                this.keywords = v;
            }
        },
        inputIsEnter(){
            this.albums=[]
            this.userprofiles=[]
            this.mvs=[]
            this.playlists=[]
            this.artists=[]
            this.songs=[]
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
.search-box{
    .search-wrap{
        width: 980px;
        min-height: 800px;
        margin:0 auto;
        background-color: white;
        padding: 40px;
        .SearchBox{
            width: 340px;
            margin: 0 auto 36px auto;
            /deep/ .search-wrap{
                .parent{
                    width: 320px;
                    border: 1px solid rgba($color: #000000, $alpha: 0.5);
                    input{
                        width: 280px;
                    }
                }
            }
        }

        .artists-ul{
            display: flex;
            flex-wrap: wrap;
            li{
                margin-right: 36px;
                margin-bottom: 16px;
                img{
                    width: 160px;
                    height: 160px;
                }
                .singer-name{
                    display: inline-block;
                    margin-top: 6px;
                    font-size: 14px;
                }
            }
        }
    
        .albums-ul{
            display: flex;
            flex-wrap: wrap;
            li{
                margin-right: 51px;
                margin-bottom: 24px;
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
        
        .playlists-ul{
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            li{
                margin-left: 36px;
            }
        }
    
        .mvs-ul{
            display: flex;
            flex-wrap: wrap;
            li{
                margin-right: 36px;
                margin-bottom: 20px;
                .mv-img{
                    position: relative;
                    img{
                        width: 290px;
                        height: 160px;
                    }
                    .play-count{
                        background-color: rgba($color: #000000, $alpha: 0.2);
                        border-radius: 3px;
                        padding: 0 2px;
                        position:absolute;
                        color: white;
                        top: 3px;
                        right: 6px;
                        i{
                            position: relative;
                            top: 1px;
                            margin-right: 2px;
                        }
                    }
                }
                
                .mv-name{
                    width: 290px;
                    margin-top: 6px;
                    margin-bottom: 3px;
                    font-size: 16px;
                }
                .author-name{
                    display: inline-block;
                    margin-top: 6px;
                    margin-right: 8px;
                    font-size: 14px;
                    color: #666;
                }
                
            }
        }

        .userprofiles-ul{
            li{
                height: 60px;
                margin-bottom: 16px;
                div{
                    line-height: 30px;
                }

                &::after{
                    display: block;
                    content: "";
                    clear: both;
                }
                .fs,.gd{
                    line-height:60px;
                    float:right;
                    margin-right:28px;
                    min-width: 100px;
                }
            }
        }
    }
}
</style>