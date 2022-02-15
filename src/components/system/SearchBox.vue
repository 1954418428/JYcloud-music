<template>
    <div class="search-box">
        <div class="search-wrap">
            <span class="parent">
                <i class="iconfont icon-sousuo" style="margin-left:8px"></i>

                <input class="search-input" type="text" placeholder="音乐/歌手/mv/用户"
                v-on:keyup.enter="searchSubmit"
                @input="inputKey"
                @focus="keywords?searchReslutIsShow=true : searchReslutIsShow=false"
                @blur="inputBlur"
                v-model="keywords"
                >
            </span>
            
            <div class="search-reslut" 
            v-show="searchReslutIsShow" 
            >
            <!-- -->
                <p class="user-item" v-if="keywords">
                    <router-link :to="`/search?keywords=${keywords}&type=1002`">搜索“{{keywords}}”相关用户 ></router-link>
                    
                </p>
                <div class="song-item" v-show="songs && songs.length">
                    <h3>
                        <i class="iconfont icon-yinle"></i>
                        单曲
                    </h3>
                    <ul>
                        <li v-for="item in songs" :key="item.id">
                            <router-link :to="`/songplaying?id=${item.id}`">
                            {{item.name}}-{{item.artists[0].name}}
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="singer-item" v-show="artists && artists.length">
                    <h3>
                        <i class="iconfont icon-yonghu"></i>
                        歌手
                    </h3>
                    <ul>
                        <li v-for="item in artists" :key="item.id">
                            <router-link :to="`/singer?id=${item.id}`">
                            {{item.name}}
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="album-item" v-show="albums && albums.length">
                    <h3>
                        <i class="iconfont icon-zhuanji" style="position: relative;left: -3px;"></i>
                        专辑
                    </h3>
                    <ul>
                        <li v-for="item in albums" :key="item.id">
                            <router-link :to="`/album?id=${item.id}`">
                            {{item.name}}-{{item.artist.name}}
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="playlist-item" v-show="playlists && playlists.length">
                    <h3>
                        <i class="iconfont icon-gedan1" style="position: relative;left: -3px;"></i>
                        歌单
                    </h3>
                    <ul>
                        <li v-for="item in playlists" :key="item.id">
                            <router-link :to="`/playlist?id=${item.id}`">
                            {{item.name}}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import {systemApi} from '@/api';
export default {
    name: "SearchBox",
    components: {
        
    },
    data() {
        return {
            searchReslutIsShow:false,
            keywords:'',//搜索关键字
            albums:[],//专辑列表
            artists:[],//歌手列表
            playlists:[],//歌单列表
            songs:[],//单曲列表


        };
    },
    props:{
        searchKey:{
            type:String
        }
    },
    computed: {},
    watch: {
        'searchKey':{
            handler(){
              if(!this.keywords){
                this.keywords = this.searchKey;
              }
            },
            immediate:true
        },
        '$route.query.type':{
            handler(){
                if(this.$route.query.type && this.searchKey ==  this.$route.query.keywords){
                    this.keywords = this.$route.query.keywords;
                }
            }
        }
    },
    methods: {
        searchSubmit(){
            if(this.keywords){
                this.$router.push({path:`/search?keywords=${this.keywords}&type=1`})
                this.$emit("emitInputEnter");
                this.$emit("emitInputValue",this.keywords);
                this.searchReslutIsShow = false;
            }
            // console.log("searchSubmit");
        
            

        },
        async inputKey(e){
            const {value} = e.target
            this.keywords = value
             if(value){
                //  console.log(value);
                    const res = await systemApi.suggestSearch(value);
                    // console.log(res);
                    const {albums,artists,playlists,songs} =  res.result;
                    this.albums = albums || [];
                    this.artists = artists || [];
                    this.playlists = playlists|| [];
                    this.songs = songs || [];
                    if(this.albums.length == 0 &&
                        this.artists.length == 0 &&
                        this.playlists.length == 0 &&
                        this.songs.length == 0 
                    ){
                        this.searchReslutIsShow = false;
                        return;
                    }

                     this.searchReslutIsShow = true;
                }else{
                    this.albums = [];
                    this.artists = [];
                    this.playlists = [];
                    this.songs = [];
                    this.searchReslutIsShow = false;
                }
        },
        inputBlur(e,ee){
            setTimeout(() => {
                this.searchReslutIsShow=false
            }, 100);
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
.search-wrap{
    position: relative;
    .parent{
        width: 150px;
        height: 32px;
        line-height: 32px;
        border-radius: 32px;
        display:inline-block;
        background-color: white;
        .search-input{
            width: 110px;
            margin-left: 3px;
            margin-right: 3px;
        }
    }

    .search-reslut{
        min-width: 240px;
        background-color: white;
        z-index: 10;
        position: absolute;
        top: 38px;
        left: 0;
        box-sizing: border-box;
        border: 1px solid #bebebe;
        border-radius: 4px;

        .user-item{
            color: #666;
            padding: 10px;
            border-bottom: 1px solid #e2e2e2;
            
        }
        div{
            display: flex;
            h3{
                line-height: 24px;
                width: 60px;
                border-right: 1px solid #e2e2e2;
                text-align: center;
            }
            ul{
                flex-grow: 1;
                border-bottom: 1px solid #e2e2e2;
                li{
                    height: 24px;
                    line-height: 24px;
                    a{
                        display: block;
                        max-width: 145px;
                        padding: 0 16px;
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        &:hover{
                            background-color: rgb(227,229,231);
                        }
                    }
                }
            }
        }
    }
    
}

</style>