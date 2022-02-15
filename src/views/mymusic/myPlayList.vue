<template>
    <div class="myPlayList-box">
       
        <SongSheetDetail :playListDetail="playListDetail" class="song-sheet-detail" :songs="songs"
        
            :isMeCreated = "CreatedPlaylistIds.indexOf(playListDetail.id)!=-1"
        ></SongSheetDetail>

        <SongSheet :songs="songs" :playCount="playCount" :trackCount="trackCount"
        
        :isMeCreated = "CreatedPlaylistIds.indexOf(playListDetail.id)!=-1"
        :c5="190"
        @emitDeleteCreatedPlaylistSong="deleteCreatedPlaylistSong"

        ></SongSheet>
            
            
    </div>
</template>

<script>
import SongSheetDetail from '../../components/song/SongSheetDetail';
import SongSheet from '../../components/song/SongSheet';
import {sheetApi,songApi} from '@/api';

export default {
    name: "",
    components: {SongSheetDetail,SongSheet},
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
           
        };
    },
    props:{
        CreatedPlaylistIds:{
            type:Array,
            default:[]
        }
    },
    computed: {},
    watch: {
        '$route.query': {
            async handler (){
                if(this.$route.query.id){
                    this.initPlayList(this.$route.query.id);
                }else{
                    console.log("错误 无歌单 id");
                }
            },
            immediate: true
        }
    },
    methods: {
        initPlayList(pid){
            sheetApi.getPlayListDetail(pid)
            .then(res=>{
                // console.log("getPlayListDetail");
                this.songs =[];
                //歌单详情
                const {id,name,coverImgUrl,createTime,trackCount,playCount,subscribedCount,subscribed,description,tags,creator} =  res.playlist;
                
                const playListDetail ={id,name,coverImgUrl,createTime,trackCount,playCount,subscribedCount,subscribed,description,tags,creator
                    
                };
                this.playListDetail = playListDetail;
                this.playCount = playCount;
                this.trackCount= trackCount;
            });

            sheetApi.getPlayListTrackAll({id:this.$route.query.id,limit:1000,offset:0,timestamp:new Date().getTime()})
            .then(res=>{
                // console.log("getPlayListTrackAll");
                this.songs = res.songs
                
            });
        },
        deleteCreatedPlaylistSong(index){
            console.log(index);
            this.songs.splice(index,1);
            this.trackCount-=1;
        },
     
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
.myPlayList-box{
    padding: 20px 0;
    .song-sheet-detail{
        margin: 0 auto;
    }
}
</style>