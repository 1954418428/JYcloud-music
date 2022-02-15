<template>
    <div class="carousel-box">
        <div class="carousel-wrap">
            <div class="carousel-out-wrap">
                <el-carousel 
                arrow="never"
                class="carousel"
                ref="carousel"
                indicator-position="none"
                >
                    <el-carousel-item v-for="(item,index) in banners" :key="index" class="carousel-item">
                        <a href="#">
                            <img :src="item.imageUrl" alt="">
                        </a>
                    </el-carousel-item>
                </el-carousel>
                <a href="javascript:void(0)" @click.prevent="$refs.carousel.prev()" class="pre-btn"><i class="iconfont icon-xiangzuojiantou"></i></a>
                <a href="javascript:void(0)" @click.prevent="$refs.carousel.next()" class="next-btn"><i class="iconfont icon-xiangyoujiantou"></i></a>
            </div>
            
            <div class="down-wrap">
                <a href="https://music.163.com/#/download"></a>
                <p>PC 安卓 iPhone WP iPad Mac 六大客户端</p>
            </div>

        </div>
      
    </div>
</template>

<script>
import {systemApi} from '@/api';
export default {
    name: "",
    components: {},
    data() {
        return {
            banners:[]
        };
    },
    props:{},
    computed: {},
    watch: {},
    methods: {
     
    },
    beforeCreated() {},
    async created() {
        const res =  await  systemApi.getBanner();
        this.banners  = res.banners;
        // console.log(res);
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
.carousel-box{
    background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);
    .carousel-wrap{
        position: relative;
        width: 980px;
        margin:0 auto;
        display: flex;

        .carousel-out-wrap{
            width: 730px;
            .carousel{
                width: 730px;
                height: 300px;
                .carousel-item{
                img{
                    width: 730px;
                    height: 300px;
                }
            }
         
            }
            .pre-btn,.next-btn{
                padding: 6px 3px;
                position: absolute;
                color: white;
                z-index: 100;
                top: 50%;
                transform: translateY(-50%);
                i{
                    font-size: 48px;
                }
                &:hover{
                    background-color:rgb(76,59,62);
                }
            }
            .pre-btn{
                left: -64px;
            }
            .next-btn{
                right:-64px;
            }

        }

        .down-wrap{
            position: relative;
            flex-grow: 1;
            background: url("../../assets/img/download.png") no-repeat 0 0;
            background-size: 100% 100%;
            cursor: pointer;
            a{
                position:absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
            p{
                margin: 10px 13px;
                text-align: center;
                position:absolute;
                bottom: 0;
                color: #8D8D8D;
            }
        }
    }
    
}

</style>