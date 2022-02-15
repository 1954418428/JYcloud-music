<template>
    <div class="topplaylist-box">
        <div class="topplaylist-wrap">
            <div class="left-wrap">
                <div class="tsb">
                    <h2>云音乐特色榜</h2>
                    <ul>
                        <li v-for="item in topList.slice(0,4)" :key="item.id"  :class="currentId ==item.id ?'avtive':''" @click="updateTopPlayList(item.id)">
                            <div>
                                <img :src="item.coverImgUrl+'?param=60y60'" :alt="item.name">
                            </div>
                            <div class="info">
                                <a href="Javascript:void(0)">{{item.name}}</a>
                                <br>
                                <a href="Javascript:void(0)">{{item.updateFrequency}}</a>
                                <br>
                                {{parseCount(item.playCount)}}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="qqb">
                    <h2>全球媒体榜</h2>
                    <ul>
                        <li v-for="item in topList.slice(4,topList.length)" :key="item.id"  :class="currentId ==item.id ?'avtive':''" @click="updateTopPlayList(item.id)">
                            <div>
                                <img :src="item.coverImgUrl+'?param=60y60'" :alt="item.name">
                            </div>
                            <div class="info">
                                <a href="Javascript:void(0)">{{item.name}}</a>
                                <br>
                                <a href="Javascript:void(0)">{{item.updateFrequency}}</a>
                                <br>
                                {{parseCount(item.playCount)}}
                            </div>
                            
                        </li>
                    </ul>
                </div>
            </div>

            <div class="right-wrap">
                <SongSheetDetail :playListDetail="playListDetail" :playListType="'榜单'" :songs="songs"></SongSheetDetail>
                <SongSheet :songs="songs" :playCount="playCount"  :trackCount="trackCount"></SongSheet>
            </div>
        </div>
    </div>
</template>

<script>
import SongSheetDetail from '../../components/song/SongSheetDetail';
import SongSheet from '../../components/song/SongSheet';

import {toplistApi,sheetApi} from '@/api';

export default {
    name: "",
    components: {SongSheetDetail,SongSheet},
    data() {
        return {
            topList:[],//榜单列表
            currentId:0,//当前活跃的榜单id
            //榜单详情
            playListDetail:{},
            //榜单歌曲列表
            songs:[],
            //榜单播放次数
            playCount:0,
            //榜单歌曲数量
            trackCount:0,
        };
    },
    props:{},
    computed: {},
    watch: {
        '$route.query': {
            async handler (){

                if(sessionStorage.getItem('topList')){
                    this.topList = JSON.parse(sessionStorage.getItem('topList'));
                }else{
                    const res = await toplistApi.getTopList();
                    sessionStorage.setItem("topList",JSON.stringify((res.list)))
                    this.topList = res.list; 
                }

                if(this.$route.query.id){
                    this.currentId = this.$route.query.id;
                }else{
                    this.currentId = this.topList[0].id;
                }
                this.initTopPlayListData(this.currentId);

            },
            immediate:true
        }
    },
    methods: {
        updateTopPlayList(id){
            this.currentId = id;
            this.$router.push({path:'/topplaylist',query:{id:this.currentId}})
        },
        async initTopPlayListData(pid){
            
            sheetApi.getPlayListDetail(pid)
            .then(res=>{
                this.songs = [];
                //歌单详情
                const {id,name,coverImgUrl,createTime,trackCount,playCount,subscribedCount,subscribed,description,tags,creator} =  res.playlist;
                const playListDetail ={id,name,coverImgUrl,createTime,trackCount,playCount,subscribedCount,subscribed,description,tags,creator};
                this.playListDetail = playListDetail;
                this.playCount = playCount;
                this.trackCount= trackCount;
            });
           
            await sheetApi.getPlayListTrackAll({id:pid,limit:1000,offset:0})
            .then(res=>{
                this.songs = res.songs
                }
            );
            
        }
    },
    beforeCreated() {},
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
.topplaylist-wrap{
    background-color: white;
    width: 980px;
    margin: 0 auto;
    display: flex;
    .left-wrap{
        width: 260px;
        box-sizing: border-box;
        border-left:1px solid rgba($color: #000000, $alpha: 0.2);
        border-right:1px solid rgba($color: #000000, $alpha: 0.2) ;
        padding: 20px 0;
        .tsb,.qqb{
            margin-bottom: 18px;
            h2{
                padding-left: 16px;
                margin-bottom: 6px;
            }
            ul{
                
                .avtive{
                    background-color: rgb(230,230,230);
                }
                li{
                    height: 62px;
                    padding:10px  20px;
                    display: flex;
                    cursor: pointer;
                    img{
                        width: 60px;
                        height: 60px;
                        margin-right: 6px;
                        
                    }
                    .info{
                        padding: 3px 0;
                        a{
                            display: inline-block;
                            margin-bottom: 4px;
                        }
                    }

                    &:hover{
                        background-color: rgb(244,242,242);
                    }
                }
            }
        }
    }
    .right-wrap{
        width: 720px;
        box-sizing: border-box;
        border-right:1px solid rgba($color: #000000, $alpha: 0.2);
        padding: 20px;
    }
}
</style>