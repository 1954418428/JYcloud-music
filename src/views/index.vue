<template>
    <div>
            <!-- <component :is="'Carousel'"></component> -->
        <Carousel></Carousel>


        <div class="middle-box">
            <div class="content-wrap">
                <div class="wrap-head">
                    <i class="iconfont icon-ditu-huan"></i>
                    <a href="/discoverplaylist">
                        推荐歌单
                        <i class="iconfont icon-xiangyoujiantou"></i>
                    </a>
                </div>
                <SongSheetBox></SongSheetBox>
            </div>

            <div class="content-wrap">
                <div class="wrap-head">
                    <i class="iconfont icon-ditu-huan"></i>
                    <a href="/topplaylist">
                        榜单
                        <i class="iconfont icon-xiangyoujiantou"></i>
                    </a>
                </div>
                <TopSongSheetBox></TopSongSheetBox>
            </div>
            
        </div>
    
    </div>
    
</template>

<script>
import Carousel from '../components/home/Carousel';
import SongSheetBox from '../components/home/SongSheetBox';
import TopSongSheetBox from '../components/home/TopSongSheetBox';



export default {
    name: "index",
    components: {Carousel,SongSheetBox,TopSongSheetBox},
    data() {
        return {

        };
    },
    props:{},
    computed: {},
    watch: {},
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
.middle-box{
    width: 980px;
    margin:0 auto;
    .content-wrap{
        background-color: white;
        .wrap-head{
            font-size: 20px;
            font-weight: 700;
            padding-top: 12px;
            margin: 0 10px;
            margin-bottom: 12px;
            color: #333;
            border-bottom: 2px solid #C10D0C;

            .icon-ditu-huan{
                font-size: 20px;
                color: rgb(193,13,12);
                margin-right: 6px;
            }
            a:hover{
                color: #000;
            }
        }
    }
    
}
</style>