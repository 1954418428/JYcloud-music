<template>
    <div>
        <ul class="album-list">
            <li class="album-item" v-for="(item) in hotAlbums" :key="item.id">
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

        <div class="page-wrap">
            <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="page.limit+0"
            :current-page="currentIndex"
            @current-change="currentChange"
            >
            </el-pagination>
        </div>
    </div>
    
</template>

<script>
import {albumApi} from '@/api';
export default {
    name: "",
    components: {},
    data() {
        return {
            hotAlbums:[],
            currentIndex:1,//当前页数
            total:0,//z总记录数
            page:{
                id:0,
                limit:12,
                offset:0
            },
            
        };
    },
    props:[
        'artist'
    ],
    computed: {},
    watch: {
        '$route.query': {
            async handler (){
                if(this.$route.query.id){
                    this.page.id= this.$route.query.id;
                    if(this.$route.query.offset && this.$route.query.limit){
                        this.page.offset = parseInt(this.$route.query.offset);
                        this.page.limit = parseInt(this.$route.query.limit);
                    }
                    const res = await albumApi.getSingerAlbumList(this.page);
                    this.hotAlbums = res.hotAlbums
                    this.total= parseInt(res.artist.albumSize);
                    
                }else{
                    console.log("错误 无歌手 id");
                }
            },
            immediate: true
        }
    },
    methods: {
        currentChange(currentIndex){
            // console.log(currentIndex);
            this.currentIndex = currentIndex
            this.page.offset = (this.currentIndex-1) * this.page.limit;
            this.$router.push({path:'/singer/allalbum',query:{...this.page}});
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
    activated() {
        console.log("allAlbum激活");
        const {limit,offset} = this.$route.query;
        const {albumSize} = this.artist;
        let pagesize =  albumSize/limit;
        if(pagesize < pagesize+1){
            pagesize+=1;
        }
        
        // console.log(`共${pagesize}页`);
        // console.log(parseInt(offset/limit +1 ));

       this.currentIndex = parseInt(offset/limit +1 )

    },
    deactivated() {},
    }
</script>
<style lang="scss" scoped>
.album-list{
    display: flex;
    flex-wrap: wrap;
    .album-item{
        margin-right: 17px;
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
 .page-wrap{
        margin: 16px 0;
        text-align: center;
}
</style>