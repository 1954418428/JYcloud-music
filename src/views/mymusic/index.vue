<template>
    <div class="mymusic-box" >
        <div class="mymusic-wrap">
            <div class="left-wrap">
                <div>
                    <router-link to="/mymusic/myartist" tag="h2">
                        我的歌手({{subCount.artistCount}})
                    </router-link>
                    <router-link to="/mymusic/mymv" tag="h2">
                        我的歌手({{subCount.mvCount}})
                    </router-link>

                    <div class="myplaylist-wrap">
                        <h2>
                            创建的歌单({{subCount.createdPlaylistCount}})
                            <i class="iconfont icon-tianjia"
                            style="float:right;margin-right:10px;font-size:24px"
                            title="新建歌单"
                            @click="asyncupdateCreateBoxIsShow({isShow:true})"
                            ></i>
                        </h2>
                        <ul>
                            <router-link :to="`/mymusic/myplaylist?id=${item.id}`"
                                v-for="(item,index) in CreatedPlaylist" :key="item.id"
                                tag="li"
                                exact

                                class="CreatedPlaylist-li"
                            >
                                <img :src="item.coverImgUrl+'?param=40y40'" alt="">
                                {{item.name}}

                                <span v-if="index!=0"  class="tool">
                                    <i class="iconfont icon-xiugai"
                                    title="编辑"
                                    
                                    @click.stop="updatePlaylist(item)"
                                    ></i>
                                    <i class="iconfont icon-shanchu"
                                    title="删除"
                                   
                                    @click.stop="deletePlaylist(item,index)" 
                                    ></i>

                                </span>
                                
                            </router-link>
                        </ul>
                    </div>
                    <div class="myplaylist-wrap">
                        <h2>收藏的歌单({{subCount.subPlaylistCount}})</h2>
                        <ul>
                            <router-link :to="`/mymusic/myplaylist?id=${item.id}`"
                                v-for="item in SubPlaylist" :key="item.id"
                                tag="li"
                                exact
                            >
                                <img :src="item.coverImgUrl+'?param=40y40'" alt="">
                                {{item.name}}
                            </router-link>
                         
                        </ul>
                    </div>
                </div>
            </div>
            <div style="height:1px;width: 240px;">
            </div>

            <div class="right-wrap" style="min-height:960px">
                    <router-view 
                    :CreatedPlaylistIds="CreatedPlaylistIds"
                    >
                    </router-view>                
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import {userApi,sheetApi} from '@/api';
export default {
    name: "",
    components: {},
    data() {
        return {
            subCount:{
                artistCount:0,//收藏的歌手数量
                mvCount:0,//收藏的mv数量
                createdPlaylistCount:0,//用户自建的歌单，包括"我喜欢的音乐"
                subPlaylistCount: 0,//收藏的歌单
            },
            CreatedPlaylist:[],//创建的歌单
            CreatedPlaylistIds:[],//创建的歌单id列表
            SubPlaylist:[],//收藏的歌单
        };
    },
    props:{},
    computed: {
        ...mapState('UserModule',[
        "userInfo"
        ]),
        ...mapState('CreateSheetModule',[
        "create"
        ])
    },
    watch: {
        'create.isOver'(){
            if(this.create.isOver){
               
                if(this.create.model==1){
                    //本次操作是新建歌单
                     console.log(this.create.model,this.create.playlist);

                     this.CreatedPlaylist.splice(1, 0, this.create.playlist);
                     this.CreatedPlaylistIds.splice(1, 0, this.create.playlist.id);
                     this.subCount.createdPlaylistCount +=1;
                }else{
                    //本次操作是修改歌单
                     console.log(this.create.model,this.create.playlist);
                     for(let i =0;i<this.CreatedPlaylist.length;i++){
                         if(this.create.playlist.id  == this.CreatedPlaylist[i].id){
                            this.CreatedPlaylist[i].name = this.create.playlist.name;
                            this.CreatedPlaylist[i].tags = this.create.playlist.tags;
                            this.CreatedPlaylist[i].description = this.create.playlist.desc;

                             break;
                         }
                     }
                }
            }
        }
    },
    provide(){
        return {
            emitUpdateSubPlaylist: (playListDetail,type)=>{
                if(type =="add"){
                    console.log("add");
                    this.SubPlaylist.unshift(playListDetail);
                    this.subCount.subPlaylistCount+=1;
                }else if(type =="delete"){
                    console.log("delete");
                    for(let i =0;i<this.SubPlaylist.length;i++){
                        if(this.SubPlaylist[i].id == playListDetail.id){
                            this.SubPlaylist.splice(i,1);
                            this.subCount.subPlaylistCount-=1;
                            break;
                        }
                    }
                    console.log(this.SubPlaylist);
                }
            }
        }
    },
    methods: {
       ...mapActions('CreateSheetModule',[
           'asyncupdateCreateBoxIsShow'
       ]),
        initPlaylist(){
            sheetApi.getUserPlayList(this.userInfo.userId)
            .then(res=>{
                const CreatedPlaylist = [];
                const SubPlaylist = [];
                res.playlist.forEach(item=>{
                    if(item.subscribed){
                        SubPlaylist.push(item)
                    }else{
                        CreatedPlaylist.push(item)
                        this.CreatedPlaylistIds.push(item.id)
                    }
                })
                this.CreatedPlaylist = CreatedPlaylist;
                this.SubPlaylist = SubPlaylist;
                
                if('/mymusic' == this.$route.fullPath){
                   this.$router.push(`/mymusic/myplaylist?id=${CreatedPlaylist[0].id}`)
                 }
            })
        },
        //修改歌单
        updatePlaylist(item){
            this.asyncupdateCreateBoxIsShow({isShow:true,model:2,playlist:{
                id:item.id,
                name:item.name,
                desc:item.description,
                tags:item.tags
            }})
        },
        //删除歌单
        deletePlaylist(item,index){
            console.log(index);
            this.$confirm(`确定删除歌单 《${item.name}》 ?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log("确定删除");
                    sheetApi.deletePlaylist(item.id)
                    .then(res=>{
                        console.log(res);
                        
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        console.log(index);
                        this.CreatedPlaylist.splice(index,1);
                        this.CreatedPlaylistIds.splice(index,1);
                        this.subCount.createdPlaylistCount -=1;
                    }).catch(err=>{

                    })
                }).catch(() => {
                    console.log("取消删除");
                });
        }
   
   
    },
    beforeCreated() {},
    created() {
        userApi.getUserSubcount().then(res=>{
            const {mvCount,artistCount,createdPlaylistCount,subPlaylistCount} = res;
            this.subCount.mvCount = mvCount;
            this.subCount.artistCount = artistCount;
            this.subCount.createdPlaylistCount = createdPlaylistCount;
            this.subCount.subPlaylistCount = subPlaylistCount;
        })
        this.initPlaylist()

        
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
.mymusic-box{
    .mymusic-wrap{
        width: 980px;
        margin: 0 auto;
        display: flex;
        min-height: 100vh;

        box-sizing: border-box;
        border-left: 1px solid rgba($color: #000000, $alpha: 0.2);
        border-right: 1px solid rgba($color: #000000, $alpha: 0.2);
        .left-wrap{
            position: fixed;
            width: 238px;
            background-color: rgb(249,249,249);
            padding-top: 40px;
            h2,li{
                font-size: 14px;
                font-weight: 600;
                height: 40px;
                line-height: 40px;
                padding: 0 35px;
                cursor:pointer;
                &:hover{
                    background-color: rgb(238,238,238);
                }
            }
            ul li{
                height: 54px;
                line-height: 54px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
                img{
                    width: 40px;
                    height: 40px;
                    margin-right: 6px;
                    vertical-align: middle;
                }
            }
            .CreatedPlaylist-li{
                .tool{
                    display: none;
                    position:absolute;
                    right: 6px;
                    .icon-xiugai{
                        margin-right:6px;
                        position:relative;
                        top:-4px;
                    }

                    .icon-shanchu{
                        margin-right:6px;
                        font-size:24px;
                    }
                }
                &:hover{
                    .tool{
                        display: inline-block;
                    }
                }
            }
            
        }
        .right-wrap{
            width: 740px;
            box-sizing: border-box;
            border-left: 1px solid rgba($color: #000000, $alpha: 0.2);
            background-color: white;
        }
    }
    .router-link-active{
        background-color: rgb(238,238,238);
    }
}
</style>