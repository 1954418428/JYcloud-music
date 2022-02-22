<template>
    <div class="palylist-box">
        <div class="palylist-wrap">
            <div class="left-wrap">
                <SongSheetDetail v-if="$route.query.id != 'daily'" :playListDetail="playListDetail" :playListType="playListType" :songs="songs"></SongSheetDetail>
                <DailySongSheetDetail v-else :playListDetail="playListDetail" :songs="songs"></DailySongSheetDetail>

                <SongSheet :songs="songs" :playCount="playCount" :trackCount="trackCount"></SongSheet>
            </div>

            <div class="right-wrap">
                <div class="subscribers-wrap" v-show="$route.query.id != 'daily' && subscribers.length">
                    <h3>
                        喜欢这个歌单的人
                    </h3>
                    <ul>
                            <li v-for="(item) in subscribers" :key="item.userId">
                                <router-link :to="`/user/home?id=${item.userId}`">
                                <div>
                                    <img :src="item.avatarUrl+'?param=40y40'" alt="用户头像" :title="item.nickname">
                                </div>
                                </router-link>
                            
                            </li>

                    </ul>
                       
                </div>

                <div class="similarsheet-wrap" v-show="recommendedPlayList.length">
                    <h3>
                        推荐歌单
                    </h3>
                    <div class="user-song-sheet">
                        <SongSheetItem v-for="(item) in recommendedPlayList" :key="item.id"
                            :song-sheet-item="item"
                         ></SongSheetItem>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import SongSheetDetail from '../../components/song/SongSheetDetail';
import DailySongSheetDetail from '../../components/song/DailySongSheetDetail';

import SongSheet from '../../components/song/SongSheet';
import SongSheetItem from '../../components/song/SongSheetItem';

import {sheetApi,songApi} from '@/api';

import {mapState} from 'vuex';
export default {
    name: "",
    components: {SongSheetDetail,SongSheet,SongSheetItem,DailySongSheetDetail},
    data() {
        return {
            //歌单详情
            playListDetail:{},
            //歌曲列表
            songs:[],
            //歌单播放次数
            playCount:0,
            //歌曲数量
            trackCount:0,
            //歌单类型
            playListType:'歌单',//歌单 每日推荐 专辑 榜单
            //喜欢这个歌单的人
            subscribers:[],
            //推荐歌单(登入/未登入)
            recommendedPlayList:[]
        };
    },
    props:{},
    computed: mapState('UserModule',[
        "userState"
    ]),
    watch: {
        '$route.query': {
            async handler (){
          
                if(this.$route.query.id){
                    if(this.$route.query.id == 'daily'){
                        this.initDailySongs()
                    }else{
                        this.initPlayListData(this.$route.query.id);
                    }
                }else{
                    console.log("错误 无歌单 id");
                }
            },
            immediate: true
        },
        "userState.isLogin":{
            async handler(){
                const R = JSON.parse(sessionStorage.getItem(`${this.userState.isLogin}:PersonalizedPlayList`));
                // console.log(R);
                const list = [];
                for(let i =0;i<6;i++){
                     if(R[i].id != this.$route.query.id){
                        list.push(R[i])
                    }
                }
                this.recommendedPlayList = list;
            },
            immediate:true
        }
    },
    methods: {
        async initPlayListData(pid){
            sheetApi.getPlayListDetail(pid).then(res=>{
                //歌单详情
                const {id,name,coverImgUrl,createTime,trackCount,playCount,subscribedCount,subscribed,description,tags,creator,subscribers} =  res.playlist;
                const playListDetail ={id,name,coverImgUrl,createTime,trackCount,playCount,subscribedCount,subscribed,description,tags,creator};
                this.playListDetail = playListDetail;
                this.playCount = playCount;
                this.trackCount= trackCount;
                this.subscribers = subscribers;
            });
            sheetApi.getPlayListTrackAll({id:this.$route.query.id,limit:1000,offset:0}).then(res=>{
                this.songs = res.songs
            });
        },
        async initDailySongs(){
             songApi.getDailySongs().then(res=>{
                // console.log(res);
                this.playListType = '每日推荐'
                this.songs = res.data.dailySongs
                this.trackCount=this.songs.length
                this.playListDetail = {trackCount:this.trackCount}
                
            })
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
            padding: 20px;
            border-left: 1px solid rgba($color: #000000, $alpha: 0.3);
            h3{
                height: 35px;
                line-height: 35px;
                font-size: 20px;
                font-weight: 700;
                text-align: center;
                margin: 10px 0;
                border-bottom: 1px  solid rgba($color: #000000, $alpha: 0.2);
            }
            /deep/ .song-sheet-item-box{
                margin: 0 auto;
            }
            .subscribers-wrap{
                margin-bottom: 20px;
                ul{
                    display: flex;
                    flex-wrap: wrap;
                    li{
                        margin-right: 17px;
                        margin-bottom:10px;
                    }
                }
            }
        }
    } 
}
</style>