<template>
    <!-- 歌单入口 -->
    <div class="song-sheet-item-box"  @mouseover="bofangBtnIsShow =  true" 
        @mouseleave="bofangBtnIsShow = false">
        <router-link :to="`/playlist?id=${songSheetItem.id}`"  class="img-a"
       
        >
            <img  
            v-lazy="{src: (songSheetItem.picUrl ||songSheetItem.coverImgUrl)+'?param=160y160', error: require('@/assets/img/歌单.png'), loading: require('@/assets/img/歌单.png')}"
            alt=""
            class="song-sheet-img"
            > 

            <router-link :to="`/playlist?id=${songSheetItem.id}`" class="bofang-btn" v-show="bofangBtnIsShow" 
            @mouseover="bofangBtnIsShow =  true" 
            @mouseleave="bofangBtnIsShow = false">
                <i class="iconfont icon-bofang">
                </i>
            </router-link>
        </router-link>
        
        <div class="song-sheet-name">
            <router-link :to="`/playlist?id=${songSheetItem.id}`" >
                {{songSheetItem.name}}
            </router-link>
            <router-link :to="`/singer`" v-if="songSheetItem.creator">
                by {{songSheetItem.creator.nickname}}
            </router-link>
        </div>

        <span class="song-sheet-play-count">
            <i class="iconfont icon-bofang"> 
            </i>
            {{parseCount(this.songSheetItem.playCount)}}
        </span>
    </div>
</template>

<script>
export default {
    name: "",
    components: {
      
    },
    data() {
        return {
            bofangBtnIsShow:false
        };
    },
    props:{
        songSheetItem:{
            type:Object,
            required:true
        }
    },
    computed: {
    },
    watch: {},
    methods: {},
    beforeCreated() {},
    async created() {
        // const id = this.songSheetItem.id;
        // const playListDetail = await  sheetApi.getPlayListDetail(id);
        // console.log(playListDetail);
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
.song-sheet-item-box{
    width: 160px;
    position: relative;
    .img-a{
        height: 160px;
        display: inline-block;
        position: relative;
        .song-sheet-img{
            width: 160px;
            height: 160px;
            border-radius: 10px;
        }
        .bofang-btn{
            position:absolute;
            bottom: 5px;
            right: 5px;
            i{
                font-size: 36px;
                background-color: white;
                border-radius: 36px;
                color: rgb(236,65,65);
            }
        }
    }

    .song-sheet-name{
        padding: 6px 0;
        a{
            color: #666;
            display: block;
            margin-bottom: 4px;
            &:hover{
                color: #333;
            }
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
    .song-sheet-play-count{
        background-color: rgba($color: #000000, $alpha: 0.2);
        padding: 2px;
        border-radius: 6px;
        i{
            position: relative;
            top: 1px;
            left: 1px;
        }
        position:absolute;
        top: 5px;
        right: 5px;
        color: white;
    }

    

}
</style>