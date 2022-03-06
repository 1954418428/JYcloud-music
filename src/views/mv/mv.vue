<template>
    <div class="mv-box">
        <div class="mv-wrap">
            <div class="left-wrap">
                <div class="mv-content">
                    <div class="mv-head">
                        <i class="iconfont icon-MV"></i>
                        <h2>{{mvData.name}}</h2>
                        <div class="mv-info">
                            <router-link :to="`/singer?id=${mvData.artistId}`" class="singer">
                                <!-- <img src="@/assets/img/web-logo.jpeg" alt=""> -->
                                {{mvData.artistName}}
                            </router-link>
                            <span class="time">
                                发布：{{mvData.publishTime}}
                            </span>
                            <span class="bofang-count">
                                播放：{{parseCount(mvData.playCount)}}次
                            </span>
                        </div>
                        
                    </div>
                    <div class="video-paly" @mouseover="btnIsShow=true" @mouseleave="btnIsShow=false">
                        <video 
                        class="media" 
                        :src="video.url"
                        controls
                        ref="video"
                        >
                        </video>
                        <i class="iconfont icon-bofang" v-show="!video.playing && btnIsShow" title="播放视频" @click="updateVideoState('play')"></i>
                        <i class="iconfont icon-zanting" v-show="video.playing && btnIsShow" title="暂停视频" @click="updateVideoState('pause')"></i>
                    </div>

                    <div class="mv-tools">
                        <a href="">
                            <i class="iconfont icon-dianzan"></i>
                            点赞(666666)
                        </a>
                        <a href="">
                            <i class="iconfont icon-shoucang"></i>
                            收藏({{mvData.subCount}})
                        </a>
                        <a href="">
                            <i class="iconfont icon-xiazai"></i>
                            下载
                        </a>
                    </div>
                </div>

                <div class="mv-comment">
                    <div class="comment-head">
                        <h3>
                            评论
                        </h3>
                        <span>
                            共{{page.total}}条评论
                        </span>
                    </div>
                    <div class="reply-wrap">
                        <Replay
                        @emitAddComment="addComment"
                        ></Replay>
                    </div>

                    <div v-show="hotComments.length">
                        <h4>热门评论</h4>
                        <ul>
                            <li v-for="item in hotComments" :key="item.commentId">
                                <Comment :comment="item"></Comment>
                            </li>
                        </ul>
                    </div>

                    <div v-show="comments.length">
                         <h4>最新100条评论</h4>
                        <ul>
                            <li v-for="item in comments" :key="item.commentId">
                                <Comment :comment="item"></Comment>
                            </li>
                        </ul>
                    </div>   
                </div>

            </div>

            <div class="right-wrap">
                <div class="mv-desc">
                    <div class="desc-head">
                        mv简介
                    </div>
                    <p>
                        {{mvData.desc ? mvData.desc : mvData.briefDesc?mvData.briefDesc:'占无简介'}}
                    </p>
                </div>
                <div class="similar-mv">
                    <div class="similar-head">
                        相关推荐
                    </div>
                    <ul class="sm-list">
                        <li v-for="item in simiMvList" :key="item.id">
                            <router-link :to="`/mv?id=${item.id}`">
                                <img :src="item.cover+'?param=112y75'" alt="">
                            </router-link>
                            <div class="sm-mv-info">
                                <router-link :to="`/mv?id=${item.id}`" style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis" class="title">
                                    {{item.name}}
                                </router-link>
                                <span class="time">
                                    00:00
                                </span>
                                <router-link :to="`/singer?id=${item.artistId}`" class="author">
                                    by {{item.artistName}}
                                </router-link>
                            </div>
                            <span class="bofang-count">
                                <i class="iconfont icon-video"></i>
                                {{parseCount(item.playCount)}}
                            </span>
                            
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

import {mapState,mapActions,mapMutations} from 'vuex';


import {mvApi} from '@/api';


export default {
    name: "",
    components: {Replay,Comment},
    data() {
        return {
            btnIsShow:false,
            isCollect:false,
            mvData:{},
            video:{
                url:'',
                playing:false,
            },
            page:{
                currentIndex:1,//当前评论是第几页
                limit:100,//数量
                offset:0,//偏移量
                total:0,//评论总数
            },
            hotComments:[],//热评
            comments:[],//新评论
            simiMvList:[],//相似mv列表
        
        };
    },
    props:{},
    computed: {},
    watch: {
        '$route.query': {
            async handler (){
                if(this.$route.query.id){
                    this.initCommentQueryData({
                        t:1,
                        type:1,
                        id:this.$route.query.id
                    })

                    this.hotComments = []
                    this.comments=[]

                    mvApi.getMvDetail(this.$route.query.id).then(res=>{
                        this.mvData = res.data;
                    });
                    
                    //获取mv url
                    mvApi.getMvUrl(this.$route.query.id).then(res=>{
                        this.video.url = res.data.url;
                    })
                        
                    //获取mv 评论
                    this.initMvComments();
                    //获取相似 mv
                    this.initSimiMvList();
                }else{
                    console.log("错误 无mv id");
                }
            },
            immediate: true
        }
    },
    methods: {
        ...mapMutations('CommentModule',[
            'initCommentQueryData','updateCommentId'
        ])
        ,
        updateVideoState(type){
            if(type == 'play'){
                this.$refs.video.play()
                this.video.playing = true;
            }else if(type == 'pause'){
                this.$refs.video.pause()
                this.video.playing = false;
            }
        },
        async initMvComments(){
            //获取mv 评论
            mvApi.getMvCommentList({id:this.$route.query.id,limit:100,offset:0})
            .then(res=>{
                // console.log(res);
                //评论总数
                this.page.total = res.total
                //热评
                this.hotComments = res.hotComments;
                //新评
                this.comments = res.comments;
            })
            
        },
        async initSimiMvList(){
            //获取相似mv列表
            mvApi.getSimiMv(this.$route.query.id).then(res=>{
                this.simiMvList = res.mvs
            })
        },
        addComment(comment){
            console.log('comment',comment);
            this.page.total+=1;
            this.comments.unshift(comment);
        }
    },
    beforeCreated() {
    },
    async created() {
        
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

            .mv-content{
                margin-bottom: 30px;
                .mv-head{
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
                    h2{
                        font-size: 24px;
                    }
                    .icon-MV{
                        font-size: 36px;
                        color: rgb(231,112,119);
                    }
                    .mv-info{
                        .singer{
                            color: #0c73c2;
                            img{
                                width: 30px;
                                height: 30px;
                                border-radius: 15px;
                                vertical-align: middle;
                            }
                        }
                        .time,.bofang-count{
                            color: #333;
                            margin-left: 10px;
                        }
                    }
                 
                }
                .video-paly{
                    width: 650px;
                    height: 365px;
                    position: relative;
                    .media{
                        width: 100%;
                        height: 100%;
                    }
                    i{
                        color: rgb(200,200,200);
                        font-size: 60px;
                        margin-top: -30px;
                        margin-left: -30px;
                        position:absolute;
                        top: 50%;
                        left: 50%;
                        &:hover{
                            cursor: pointer;
                            color: white;
                        }
                    }
                }
                .mv-tools{
                    margin-top: 10px;
                    margin-bottom: 36px;
                    height: 32px;
                    line-height: 32px;
                    a{
                        display: inline-block;
                        text-align: center;
                        min-width: 72px;
                        margin-right: 10px;
                        padding: 0 3px;
                        background-color: rgb(243,243,243);
                        border-radius: 10px;
                        border:1px solid rgba(0,0,0,0.2);
                        &:hover{
                            background-color: rgb(230,230,230);
                        }
                        
                    }
                }
            }

            .mv-comment{
                .comment-head{
                    height: 32px;
                    line-height: 32px;
                    border-bottom: 2px solid #c20c0c;
                    h3{
                        float: left;
                        font-size: 20px;
                        margin-right: 16px;
                    }
                    span{
                        float: left;
                    }
                }
                h4{
                    padding: 4px;
                    font-size: 14px;
                    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
                }
                .reply-wrap{
                    margin: 16px 0;
                }
            }

        }

        .right-wrap{
            box-sizing: border-box;
            width: 270px;
            padding:30px 18px;
            border-right: 1px solid rgba(0,0,0,0.2);
            .mv-desc{
                margin-bottom: 24px;
            }
            .desc-head,.similar-head{
                
                height: 24px;
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: 600;
                color: #333;
                border-bottom: 1px solid rgba(0,0,0,0.2);
            }
            .sm-list{
                li{
                    margin-bottom: 16px;
                    display: flex;
                    position: relative;
                    img{
                        flex-shrink: 0;
                        width: 112px;
                        height: 75px;
                        vertical-align: middle;
                        position: relative;
                    }
                    .sm-mv-info{
                        flex-shrink: 0;
                        width: 104px;
                        padding: 8px ;
                        color: #999;
                        .title,.time,.author{
                            display: block;
                            margin-bottom: 3px; 
                        }
                        .title{
                            color: #333;
                        }
                    }
                    .bofang-count{
                        display: inline-block;
                        min-width: 50px;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        position: absolute;
                        color: white;
                        background-color: rgba(0,0,0,0.2);
                        top: 0;
                        left: 0;
                    }
                }
            }
        }
    }
}

</style>