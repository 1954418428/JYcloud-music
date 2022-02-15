<template>
    <!-- 歌单 -->
    <div class="song-sheet">
        <div class="s-top">
            <h3>歌曲列表</h3>
            <span>{{trackCount}}首歌</span>
            <div v-if="playCount">
                播放:
                <strong>{{playCount}}</strong>
                次
            </div>
        </div>
        <div class="sheet-table-wrap">
            <el-table

            :data="songs"
            style="width:100%"
            v-loading="songs.length == 0"
            element-loading-text="拼命加载中"
            stripe
            @row-click="rowClick"
            ref="sheettable"
            >
    
                <el-table-column
                    label="操作"
                    :width="c1"
                >
                    <template slot-scope="scope">
                        <div class="operation">
                            <span> {{ scope.$index + 1}}</span>
                            <i class="iconfont  icon-bofang" @click.stop="btnBf(scope.$index)" title="播放"></i>
                            <i class="iconfont  icon-xiazai"></i>
                        </div>
                        
                    </template>
                </el-table-column>

                <el-table-column
                    label="歌曲标题"
                    show-overflow-tooltip 
                    :width="c2"
                >
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                         <a v-if="scope.row.mv" href="javascript:void(0)" @click.prevent="gotoMv(scope.row.mv)"
                             style=" font-size: 18px;
                                    position: relative;
                                    top: 1px;
                                    color: rgb(236, 65, 65);"  
                         >
                            <i class="iconfont icon-MV" 
                           ></i>
                        </a>
                    </template>
                </el-table-column>

                <el-table-column
                    label="时间"
                    :width="c3"
                >
                    <template slot-scope="scope">
                    {{ formatTime(scope.row.dt / 1000) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="歌手"
                    :width="c4"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.ar" >
                            <router-link :to="`/singer?id=${item.id}`"   v-for="(item,index) in scope.row.ar" :key="item.id+index">
                                {{index!=0?'|':''}} {{ item.name }} 
                            </router-link>
                        </div>
                       
                    </template>
                </el-table-column>

                <el-table-column
                    label="专辑"
                    :width="c5"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <router-link :to="`/album?id=${scope.row.al.id}`">
                            {{ scope.row.al.name }}
                        </router-link>
                    </template>
                </el-table-column>

                <el-table-column
                    label="次数"
                    :width="160"
                    show-overflow-tooltip
                    v-if="c6IsShow"
                >
                   <template slot-scope="scope">
                        <span>
                            {{scope.row.recordPlayCount}}
                        </span>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="menu" ref="menu" v-show="menuIsShow">
            <ul>
                <li @click="bofang">
                    <i class="iconfont icon-bofang"></i>
                    立即播放
                </li>
                <li class="next-bofang" @click="nextBofang">
                    <i class="iconfont icon-bofang1"></i>
                    下一首播放
                </li>
                <!-- <li class="quanbu" @click="bofangALL">
                    <i class="iconfont icon-quanbu-15"></i>
                    播放全部
                </li> -->
              
                <li @click="collectSongClicked">
                    <i class="iconfont icon-shoucang"></i>
                    收藏到歌单
                </li>
                <li>
                    <i class="iconfont icon-lianjie"></i>
                    复制链接
                </li>
                <li v-if="isMeCreated" @click="deleteSong">
                    <i class="iconfont icon-shanchu"></i>
                    从歌单中移除
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
import {mapActions,mapMutations} from 'vuex';
import closeTargetEle from '@/utils/closeTargetEle';
import {sheetApi} from '@/api';
export default {
    name: "",
    components: {},
    data() {
        return {
            menuIsShow:false,
            currentIndex:-1,//被单击的歌曲索引
        };
    },
    props:{
        songs:{
            type:Array,
            required:true
        },
        playCount:{
            type:Number,
        },
        trackCount:{
            type:Number,
        },
        //是否是自己创建的歌单
        isMeCreated:{
            type:Boolean,
            default:false
        },
        //第一列宽度
        c1:{
            type:Number,
            default:120
        },
        //第二列宽度
        c2:{
            type:Number,
            default:188
        },
        //第三列宽度
        c3:{
            type:Number,
            default:80
        },
        //第四列宽度
        c4:{
            type:Number,
            default:150
        },
        //第五列宽度
        c5:{
            type:Number,
            default:110
        },
        c6IsShow:{
            type:Boolean,
            default:false
        }
        
    },
    computed: {},
    watch: {
    },
    methods: {
        ...mapMutations('PlayerModule',[
            "pause"
        ]),
         ...mapActions('PlayerModule',[
            "cutSongSheet","asyncUpdateIsLock","addNextSong","asyncUpdateIsLock"
        ]),
        ...mapActions('CollectModule',[
           "collectClicked"
        ]),
        rowClick(row, column, event){
            const {clientX,clientY}=event;
            const menuEle=this.$refs.menu;
            menuEle.style.top=clientY+10+"px";
            menuEle.style.left=clientX+"px";
            this.menuIsShow=true;
           
            const currentIndex = this.getCurrentIndex(row,this.songs);
            this.currentIndex = currentIndex;
            console.log("rowClick",currentIndex);
            // console.log(this.currentIndex);
        },
        NonTargetIsClicked(e){
            if(this.menuIsShow){
                const target = e.target;
                const showTargetEle = this.$refs.menu;
                const triggerTargetEle = document.getElementsByTagName("table")[1];
                const flag = closeTargetEle(target,showTargetEle,triggerTargetEle);
                if(!flag){
                    this.menuIsShow = false;
                    this.currentIndex = -1;
                    // console.log(this.currentIndex);
                }
            }
        },
        //获取被单击的歌 在歌曲列表中的索引
        getCurrentIndex(song,songs){
            let currentIndex = 0;
            while(currentIndex < songs.length){
                if(songs[currentIndex].id == song.id){
                    return currentIndex;
                }
                currentIndex++;
            }
            return -1;
        },
        btnBf(index){
            this.currentIndex = index;
            this.bofang();
        },
        //播放歌曲
        bofang(){
            this.cutSongSheet({
                songs:this.songs,
                currentIndex:this.currentIndex    
            })
            this.asyncUpdateIsLock({
                isLock:true
            })
            this.menuIsShow = false;
            this.currentIndex = -1;
            
        },
        //下一首播放
        nextBofang(){
            const song = this.songs[this.currentIndex];
            console.log(song);
            this.addNextSong({songs:[song]})

            this.menuIsShow = false;
            this.currentIndex = -1;
        },
        //播放全部
        bofangALL(){

        },
        gotoMv(mvid){
            console.log(mvid);
            this.pause();
            this.$router.push({path:`/mv?id=${mvid}`});
            this.asyncUpdateIsLock({
                    isLock:false
            })
        },
        //收藏到歌单 被单击
        collectSongClicked(){
            const song = this.songs[this.currentIndex];
            this.collectClicked({tracks:[song.id]})
            this.menuIsShow=false;
        },
        //从歌单移除歌曲
        deleteSong(){
                const song = this.songs[this.currentIndex];
                const deleteIndex=this.currentIndex;
                console.log(song);
                this.$confirm(`确定从歌单中删除歌曲 《${song.name}》 ?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //发请求删歌
                    sheetApi.addOrDeleteSong({
                        op:'del',
                        pid:this.$route.query.id,
                        tracks:song.id
                    }).then(res=>{
                    //从列表中移除这首歌
                    this.$emit("emitDeleteCreatedPlaylistSong",deleteIndex);
                    this.menuIsShow=false;
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                
                    }) 
                }).catch(() => {
                
                });      
        }
    },
    beforeCreated() {},
    created() {
        document.addEventListener('click',this.NonTargetIsClicked)

    },
    beforeMount() {
    },
    mounted() {
    },
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {
        // console.log("NonTargetIsClicked解除");
        document.removeEventListener('click',this.NonTargetIsClicked)
    },
    destroyed() {
    },
    //被keep-alive缓存的组件激活时调用
    activated() {},
    deactivated() {},
    }
</script>
<style lang="scss" scoped>


.song-sheet{
    margin:20px 0;
    cursor: pointer;
    .s-top{
        height: 35px;
        line-height: 35px;
        padding: 0 8px;
        h3{
            float: left;
            font-size: 20px;
            font-weight: 700;
        }
        span{
            float: left;
            margin-left: 16px;
            color:#666
        }
        div{
            float: right;
            strong{
                font-weight: 600;
                color: rgb(214,28,28);
            }
        }
        &::after{
            display: block;
            content: "";
            clear: both;
        }
    }
    .sheet-table-wrap{
        position: relative;
        .operation{
            text-align: center;
            span{
                margin-left: 10px;            
            }
            i{
                @extend span;
                cursor: pointer;
                &:hover{
                    color: #333
                }
            }
        }
    }
    .menu{
        position: fixed;
        z-index: 1000;
        width: 180px;
        border:1px solid rgba($color: #000000, $alpha: 0.3);
        background-color: rgb(250, 250, 250);
        border-radius: 10px;
        padding: 6px 0;
        ul{
            li{
                font-size: 14px;
                height: 24px;
                line-height: 24px;
                padding: 8px;
                cursor: pointer;
           
                i{
                    margin-right: 6px;
                }
                &:hover{
                    background-color:rgb(245,245,245);
                }
            }
            .next-bofang{
                border-bottom:1px solid #999;
            }
            
        }
    }
}
</style>