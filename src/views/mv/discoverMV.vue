<template>
    <div class="dc-mv-box">
        <div class="dc-mv-wrap">
            <div>
                <div>
                    <span>
                        地区：
                    </span>
                    <ul class="area">
                        <li v-for="(val) in areaData" :key="val">
                            <router-link :to="{path:'/discovermv',query:{area:val,type:page.type,order:page.order}}" :class="page.area == val ?'active':''">{{val}}</router-link>
                        </li>
           
                    </ul>
                </div>
                
                <div>
                    <span>
                        类型：
                    </span>
                    <ul class="type">
                        <li v-for="(val) in typeData" :key="val">
                            <router-link :to="{path:'/discovermv',query:{area:page.area,type:val,order:page.order}}" :class="page.type == val ?'active':''">{{val}}</router-link>
                        </li>
                    </ul>
                </div>
               
                <div>
                    <span>
                        排序：
                    </span>
                    <ul class="order">
                        <li v-for="(val) in orderData" :key="val">
                            <router-link :to="{path:'/discovermv',query:{area:page.area,type:page.type,order:val}}" :class="page.order == val ?'active':''" >{{val}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="mv-list-wrap" v-if="mvList.length">
                <ul class="mv-list">
                    <li v-for="item in mvList" :key="item.id">
                        <div class="mv-img">
                            <router-link :to="`/mv?id=${item.id}`">
                                 <img 
                                v-lazy="{src: item.cover+'?param=290y160', error: require('@/assets/img/mv.png'), loading: require('@/assets/img/mv.png')}"
                                 alt="">
                            </router-link>
                            <span class="play-count">
                                <i class="iconfont icon-video"></i>
                                {{parseCount(item.playCount)}}
                            </span>
                        </div>

                        <p class="mv-name"  >
                            <router-link :to="`/mv?id=${item.id}`">{{item.name}}</router-link>
                        </p>
                        
                        <router-link  v-for="a in item.artists" :key="a.id"  :to="`/singer?id=${a.id}`" class="author-name">
                            {{a.name}}
                        </router-link>
                        
                    </li>
                </ul>
                <p v-show="isLoading">正在努力加载新数据！</p>
                <p v-if="!more">我们是有底线的！</p>
            </div>

            <div v-else style="font-size:24px;font-weight:700">
                正在努力加载数据！
            </div>
        </div>
    </div>
</template>

<script>
import {mvApi} from '@/api';

export default {
    name: "",
    components: {},
    data() {
        return {
            scrollBottom:0,
            isLoading:false,//是否 加载新数据
            more:true,//是否 有下一页数据
            currentIndex:1,//当前页数
            areaData:["全部","内地","港台","欧美","韩国","日本"],
            typeData:["全部","官方版","原声","现场版","网易出品"],
            orderData:["上升最快","最热","最新"],
            page:{
                area:'全部',//-1全部 7华语 96欧美 8日本 16韩国 0其他
                type:'全部',//-1全部 1男歌手 2女歌手 3乐队
                order:"上升最快",//-1热门 0# 字母|名字以首字母开头的
                limit:12,//数量
                offset:0,//第一页
            },
            mvList:[]
        };
    },
    props:{},
    computed: {},
    watch: {
        'isLoading':async function(){
            if(this.isLoading){
                    this.currentIndex +=1;
                    this.page.offset = (this.currentIndex-1) * this.page.limit;
                    const res = await mvApi.getMvList(this.page);
                    this.more = res.hasMore
                    this.mvList = this.mvList.concat(res.data)
           
                    this.isLoading=false;
            }
        },
        '$route.query': {
            async handler (){
                if( Object.keys(this.$route.query).length !=0){
                    console.log("进来了");
                    this.page.area = this.$route.query.area;
                    this.page.type = this.$route.query.type;
                    this.page.order = this.$route.query.order;
                    this.page.offset = 0;
                    this.currentIndex = 1;
                }
                const res = await mvApi.getMvList(this.page);
                this.mvList = res.data
            },
            immediate: true
        }
    },
    methods: {
         // 监听滚动条
        scrollHandler(){
             //变量scrollTop是滚动条滚动时，距离顶部的距离
            let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
            //变量windowHeight是可视区的高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            //变量scrollHeight是滚动条的总高度
            let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            // console.log(scrollTop,windowHeight,scrollHeight);
            //滚动条距离底部的距离
            let scrollBottom =  scrollHeight - scrollTop -windowHeight
            // console.log(scrollBottom);
            this.scrollBottom  = scrollBottom;
            if(this.scrollBottom<300 && this.more){
                this.isLoading = true;
            }
        },
        fun(area,type,order){
            this.page.area = area;
            this.page.type = type;
            this.page.order = order;
            console.log(area,type,order);
        }
    },
    beforeCreated() {
    },
    created() {
        window.addEventListener('scroll',this.scrollHandler)
    },
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {
        window.removeEventListener('scroll',this.scrollHandler)
    },
    destroyed() {},
    //被keep-alive缓存的组件激活时调用
    activated() {},
    deactivated() {},
    }
</script>
<style lang="scss" scoped>
.dc-mv-box{
    .dc-mv-wrap{
        width: 920px;
        margin: 0 auto;
        background-color: white;
        padding: 30px;
        span{
            float: left;
            height: 24px;
            line-height: 24px;
        }
        .area,.type,.order{
            display: flex;
            flex-wrap: wrap;
            li{
                min-width: 46px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                margin-right: 6px;
                margin-bottom: 8px;

                .active{
                    color: rgb(236,65,65);
                    background-color: rgb(253,245,245);

                }
                a{
                    display: block;
                    padding: 0 6px;

                    color: #666;
                    border-radius: 16px;
                    &:hover{
                        @extend .active
                    }
                }
            }
        }
   
   
    }

    .mv-list-wrap{
        margin: 20px 0;
        .mv-list{
            display: flex;
            flex-wrap: wrap;
            li{
                margin-right: 10px;
                margin-bottom: 20px;
                .mv-img{
                    position: relative;
                    img{
                        width: 290px;
                        height: 160px;
                    }
                    .play-count{
                        background-color: rgba($color: #000000, $alpha: 0.2);
                        border-radius: 3px;
                        padding: 0 2px;
                        position:absolute;
                        color: white;
                        top: 3px;
                        right: 6px;
                        i{
                            position: relative;
                            top: 1px;
                            margin-right: 2px;
                        }
                    }
                }
                
                .mv-name{
                    width: 290px;
                    margin-top: 6px;
                    margin-bottom: 3px;
                    font-size: 16px;
                }
                .author-name{
                    display: inline-block;
                    margin-top: 6px;
                    margin-right: 8px;
                    font-size: 14px;
                    color: #666;
                }
                
            }
        }
        & > p{
            font-size: 24px;
            font-weight: 700;
            text-align: center;
        }
    }
}

</style>