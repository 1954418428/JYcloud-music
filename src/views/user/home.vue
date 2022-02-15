<template>
    <div class="userhome-box">
        <div class="userhome-wrap">
            <div class="user-info-wrap">
                <div class="user-img">
                    <img :src="userData.profile.avatarUrl" alt="">
                </div>
                <div class="user-info">
                    <h2>
                        <span class="name">{{userData.profile.nickname}}</span>
                         <span class="sex" v-if="userData.profile.gender">
                            <i class="iconfont icon-nan" style="color:rgb(38,166,228)" v-if="userData.profile.gender ==1"></i>
                            <i class="iconfont icon-nv" style="color:rgb(255,181,211)" v-else></i>
                        </span>
                        <!-- <span class="viptype">VIP2</span> -->
                        <span  class="usertype" v-if="userData.level">Lv{{userData.level}}</span>
                       
                    </h2>
                    <div class="user-desc">
                        个人简介:{{userData.profile.signature}}
                    </div>
                    <!-- <div class="user-area">
                        所在地区：湖南省-长沙市
                    </div> -->
                </div>
            </div>

            <div class="user-record" v-if="CreatedPlaylist.length">
                <h3>
                    听歌排行 <span style="font-size:14px;margin-right:12px">最近一周</span>

                    <span @click="showCount=10"  :class="showCount==10?'count-active':''">10首</span> 
                    <span @click="showCount=50"  :class="showCount==50?'count-active':''">50首</span>
                    <span @click="showCount=100" :class="showCount==100?'count-active':''">100首</span>
                </h3>
                <div>
                    <SongSheet :songs="recordSongs.slice(0,showCount)" :playCount="0" :trackCount="recordSongs.slice(0,showCount).length"  :c6IsShow="true"
                    :c2="160" :c3="120" :c4="160" :c5="160"
                    style="margin:0 auto"
                    ></SongSheet>
                </div>
            </div>
            <div v-else style="font-size:24px;font-weight:700">
                正在努力加载数据！
            </div>

            <div class="create-sheet" v-if="CreatedPlaylist.length">
                <h3>
                    {{isMe?'我':userData.profile.nickname+'-'}}创建的歌单({{CreatedPlaylist.length}})
                </h3>
                <ul>
                    <li v-for="(item,index) in CreatedPlaylist" :key="item.id+'-'+index">
                        <SongSheetItem :songSheetItem="item"></SongSheetItem>
                    </li>
                </ul>
            </div>
         

            <div class="collect-sheet" v-if="SubPlaylist.length">
                <h3>
                    {{isMe?'我':userData.profile.nickname+'-'}}收藏的歌单({{SubPlaylist.length}})
                </h3>
                <ul>
                    <li v-for="(item,index) in SubPlaylist" :key="item.id+'-'+index">
                        <SongSheetItem :songSheetItem="item"></SongSheetItem>
                    </li>
                </ul>
            </div>
         
        </div>


    </div>
</template>

<script>
import {mapState} from 'vuex';
import SongSheetItem from '../../components/song/SongSheetItem';
import SongSheet from '../../components/song/SongSheet.vue';
import {userApi,sheetApi} from '@/api';
export default {
    name: "",
    components: {SongSheetItem,SongSheet},
    data() {
        return {
            userData:{
                profile:{}
            },//用户信息
            CreatedPlaylist:[],
            SubPlaylist:[],
            isMe:false,
            recordSongs:[],
            showCount:10,
        };
    },
    props:{},
    computed: {
        ...mapState('UserModule',[
            'userInfo'
        ])
    },
    watch: {
        '$route.query':{
            handler(){
                if(this.$route.query.id){
                    const uid = this.$route.query.id;
                    if(uid == this.userInfo.userId){
                        this.isMe=true;
                    }
                    this.CreatedPlaylist=[]
                    this.SubPlaylist=[]
                    userApi.getUserDetail(uid)
                    .then(res=>{
                        // console.log(res);
                        this.userData=res;
                        const playlistCount = this.userData.profile.playlistCount;//自己创建的歌单数量
                        sheetApi.getUserPlayList(uid,100)
                        .then(res=>{
                            this.CreatedPlaylist = res.playlist.slice(0,playlistCount)
                            this.SubPlaylist = res.playlist.slice(playlistCount,res.playlist.length)
                        })

                    }).catch(err=>{

                        
                    })

                    userApi.getUserRecord(uid).then(res=>{
                        // console.log(res);
                        res.weekData.forEach(item=>{
                            item.song.recordPlayCount=item.playCount;
                            this.recordSongs.push(item.song)
                        })
                    })
                }
            },
            immediate:true
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
.userhome-wrap{
    width: 920px;
    padding: 30px;
    margin:0 auto;
    background-color: white;
    .user-info-wrap{
        display: flex;
        margin-bottom: 40px;
        .user-img{
            flex-shrink: 0;
            margin-right: 40px;
            img{
                width: 180px;
                height: 180px;
            }
        }
        .user-info{
            flex-grow: 1;
            h2{
                padding: 10px 0;
                border-bottom:1px solid rgba($color: #000000, $alpha: 0.2);
                span{
                    margin-right: 10px;
                }
                .sex{
                    i{
                        font-size: 20px;
                    }
                }
            }
            .user-desc,.user-area{
                color: #666;
                margin: 6px 0;
            }
            
        }
    }

    .create-sheet,.collect-sheet,.user-record{
        margin-bottom: 20px;
        h3{
            font-size: 20px;
            height: 36px;
            line-height: 36px;
            border-bottom: 2px solid #c20c0c;
        }
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                margin: 8px 24px 6px 0;
                
            }
        }
    }
    .user-record{
        span{
            cursor: pointer;
            font-size:14px;
            margin-right:6px;
        }
    }

    .count-active{
        color: rgb(194,12,12);
    }
}
</style>