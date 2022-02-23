<template>
     <div class="song-sheet-detail" >

        <div class="sheet-img-wrap">
            <img v-lazy="{src: playListDetail.coverImgUrl+'?param=208y208', error: require('@/assets/img/歌单.png'), loading: require('@/assets/img/歌单.png')}" alt="" class="sheet-img">
        </div>
        <div class="sheet-info-wrap">
            <div class="title">
                <i class="iconfont icon-gedan">{{playListType}}</i>
                <h2>{{playListDetail.name}}</h2>
            </div>

            <div class="user" v-if="playListType!='专辑' && playListDetail.creator">
                <img     :src="playListDetail.creator.avatarUrl +'?param=208y208'"
                 alt="">
                <router-link  :to="`/user/home?id=${playListDetail.creator.userId}`" style="color:#0c73c2;">{{playListDetail.creator.nickname}}</router-link>
                <span>{{moment(parseInt(playListDetail.createTime)).format('YYYY-MM-DD') + (playListType=="歌单"?' 创建':' 发布')}} </span>
            </div>
            <div v-else>
                歌手：<router-link style="color:#0c73c2;" :to="`/singer?id=${ar.id}`" v-for="(ar,index) in playListDetail.artists" :key="ar.id">{{index!=0?' / ':''}}{{ar.name}}</router-link>
                <span style="margin-left:8px">{{moment(parseInt(playListDetail.createTime)).format('YYYY-MM-DD') + (playListType=="歌单"?' 创建':' 发布')}} </span>
            </div>

            <div class="operation">
                <a href="javascript:void(0)" class="bofang-all" @click.prevent="bofangALL">
                    <i class="iconfont icon-bofang"></i>
                    播放全部
                </a>
                <a href="javascript:void(0)" class="add-all" @click.prevent="addALL">
                     <i class="iconfont icon-tianjia"></i>
                </a>

                <a href="javascript:void(0)" class="collect" @click.prevent="collectClicked" :style="playListDetail.subscribed?'background-color:rgb(231,231,231)':''">
                    <i class="iconfont icon-shoucang"></i>
                    {{playListDetail.subscribed?'已收藏':'收藏'}} 
                    
                    <span v-if="playListDetail.subscribedCount">({{playListDetail.subscribedCount}})</span> 
                </a>
                <a href="javascript:void(0)"  class="install-all">
                    <i class="iconfont icon-xiazai"></i>
                    下载全部
                </a>
                <a href="" class="comment">
                    <i class="iconfont icon-pinglun"></i>
                    评论
                </a>
            </div>
            <div class="tags" v-if="playListDetail.tags && playListDetail.tags.length">
                <span>
                    标签：
                </span>
                <router-link :to="`/discoverplaylist?cat=${item}`" v-for="item in playListDetail.tags" :key="item">{{item}}</router-link>
            </div>
            <div v-if="playListDetail.company">
                <span>
                    发行公司：{{playListDetail.company}}
                </span>
            </div>
            <div class="count">
                <span >
                    歌曲：{{playListDetail.trackCount}} 首
                </span>
                <span v-if="playListDetail.playCount">
                    播放：{{parseCount(playListDetail.playCount)}}次
                </span> 
            </div>
        </div>
        <div class="desc" v-if="playListDetail.description">
            <p>
                介绍：
                {{playListDetail.description}}
            </p>
        </div>
    </div>
</template>

<script>
import {mapState,mapActions,mapMutations} from 'vuex';
import {sheetApi} from '@/api';
export default {
    name: "",
    components: {},
    data() {
        return {

        };
    },
    props:{
        playListDetail:{
            type:Object,
            required:true,
            // default: function () {
            //     return {
            //         coverImgUrl:"",
            //         createTime:0,
            //         creator:{
            //             avatarUrl:"",
            //             nickname:"",
            //             userId:0,
            //         },
            //         description:"",
            //         id:0,
            //         name:"",
            //         playCount:0,
            //         subscribedCount:0,
            //         tags:[],
            //         trackCount:0,
            //     }
            // }
        },
        playListType:{ //歌单类型 1.歌单 2.榜单 3.专辑
            type:String,
            default:'歌单'
        },
        songs:{
            type:Array,
            required:true
        },
        //是否是自己创建的歌单
        isMeCreated:{
            type:Boolean,
            default:false
        },
    },
    computed: {
        ...mapState('CreateSheetModule',[
        "create"
        ]),
          ...mapState('UserModule',[
        "userInfo"
        ]),
    },
    watch: {
        'create.isOver'(){
            if(this.create.isOver && this.isMeCreated &&this.create.model==2){
                //本次操作是修改歌单
                console.log(this.create.model,this.create.playlist);
                this.playListDetail.name = this.create.playlist.name;
                this.playListDetail.description = this.create.playlist.desc;
                this.playListDetail.tags = this.create.playlist.tags;
            }
        }
    },
    inject: {
        emitUpdateSubPlaylist: {
            from: 'emitUpdateSubPlaylist',
            default: null
        }
    },
    methods: {
         ...mapActions('PlayerModule',[
            "cutSongSheet","asyncUpdateIsLock","addNextSong"
        ]),
        bofangALL(){
            this.cutSongSheet({
                songs:this.songs,
                currentIndex:0 
            })
            this.asyncUpdateIsLock({
                isLock:true
            })
           
        },
        addALL(){
            this.addNextSong({
                songs:this.songs
            })
        },
        //收藏或取消收藏
        collectClicked(){
            if(this.playListDetail.subscribed){
                //取消收藏
                sheetApi.collectPlayList(this.playListDetail.id,2)
                .then(res=>{
                    this.playListDetail.subscribed =false;
                    this.playListDetail.subscribedCount-=1;
                     this.$message({
                        message: '取消收藏',
                        type: 'success',
                        duration:1000
                    });
                    if(this.emitUpdateSubPlaylist){
                        this.emitUpdateSubPlaylist(this.playListDetail,'delete');
                    }
                });
            }else{
                //收藏
                sheetApi.collectPlayList(this.playListDetail.id,1)
                .then(res=>{
                    this.playListDetail.subscribed =true;
                    this.playListDetail.subscribedCount+=1;
                    this.$message({
                        message: '已收藏',
                        type: 'success',
                        duration:1000
                    });
                    if(this.emitUpdateSubPlaylist){
                        this.emitUpdateSubPlaylist(this.playListDetail,'add');
                    }
                }).catch(res=>{
                     this.$message({
                        message: '此歌单无法收藏',
                        type: 'warning',
                        duration:1500
                    });
                });
            }
            //删除缓存
            this.catchStorage.removeCatchItem(`userPlayList:${this.userInfo.userId}`);
            this.catchStorage.removeCatchItem(`userSubcount:${this.userInfo.userId}`);
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
   .song-sheet-detail{
                display: flex;
                flex-wrap: wrap;
                width: 650px;
                .sheet-img-wrap{
                    height: 208px;
                    .sheet-img{
                        height: 208px;
                        width: 208px;
                    }
                }
                .sheet-info-wrap{
                    width: 410px;
                    & div:nth-child(n){
                        margin-bottom: 10px;
                    }
                    padding: 18px 16px;
                    .title{
                        i{
                            float: left;
                            padding: 2px;
                            font-size: 16px;
                            margin-right: 12px;
                            display: inline-block;
                            border-radius: 3px;
                            color: white;
                            background-color: rgb(214,28,28);
                        }
                        h2{
                            float: left;
                        }
                        &::after{
                            display: block;
                            content: "";
                            clear: both;
                        }
                    }
                    .user{
                        img{
                            width: 30px;
                            height: 30px;
                            border-radius: 30px;
                            vertical-align: middle;
                        }
                        & :nth-child(n){
                            margin-right: 10px;
                        }
                    }
                    .operation{
                        i{
                            position: relative;
                            top: 1px;
                        }
                        a{
                            display: inline-block;
                            margin-right: 6px;
                            text-align: center;
                            height: 32px;
                            line-height: 32px;
                            border-radius: 32px;
                        }
                        .bofang-all{
                            width: 84px;
                            color: white;
                            margin-right: 0px;
                            background-color: rgb(236,65,65);
                            &:hover{
                                background-color: rgb(204,50,50);
                            }
                            border-top-right-radius: 0;
                            border-bottom-right-radius: 0;
                        }
                        .add-all{
                            width: 20px;
                            padding-left: 2px;
                            padding-right: 4px;
                            color: white;
                            background-color: rgb(236,65,65);
                            &:hover{
                                background-color: rgb(204,50,50);
                            }
                            border-top-left-radius: 0;
                            border-bottom-left-radius: 0;
                            border-left: 1px solid rgba($color: #fff, $alpha: 0.3);
                        }
                        .collect,.install-all,.comment{
                            border: 1px solid rgb(223,223,223);
                            &:hover{
                                background-color: rgb(242,242,242);
                            }
                        }
                        .collect{
                            min-width: 114px;
                            max-width: 126px;
                        }
                        .install-all{
                            width: 85px;
                        }
                        .comment{
                            width: 60px;
                        }
                    }
                    .tags{
                        a{
                            color: rgb(80,125,175);
                            margin-right: 10px;
                        }
                    }
                    .count{
                        & :nth-child(n){
                            margin-right: 10px;
                        }
                    }
                    
                }
                .desc{
                    padding: 10px;
                    width: 100%;
                    color:#666
                }
            }
</style>