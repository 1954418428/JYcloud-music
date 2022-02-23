<template>
    <div class="dc-singer-box">
        <div class="dc-singer-wrap">
            <div> 
                <div>
                    <span>
                        语种：
                    </span>
                    <ul class="language">
                        <li v-for="(val, key) in areaData" :key="key">
                            <router-link :to="{path:'/discoversinger',query:{area:key,type:page.type,initial:page.initial}}" :class="page.area == key ?'active':''">{{val}}</router-link>
                        </li>
           
                    </ul>
                </div>
                
                <div>
                    <span>
                        分类：
                    </span>
                    <ul class="category">
                        <li v-for="(val, key) in typeData" :key="key">
                            <router-link  :to="{path:'/discoversinger',query:{area:page.area,type:key,initial:page.initial}}" :class="page.type == key ?'active':''">{{val}}</router-link>
                        </li>
                    </ul>
                </div>
               
                <div>
                    <span>
                        筛选：
                    </span>
                    <ul class="surname">
                        <li v-for="(val, key) in initialData" :key="key">
                            <router-link  :to="{path:'/discoversinger',query:{area:page.area,type:page.type,initial:key}}" :class="page.initial == key ?'active':''">{{val}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="singer-list-wrap" v-if="artists.length">
                <ul class="singer-list">
                    <li v-for="item in artists" :key="item.id">
                        <div>
                            <router-link :to="`/singer?id=${item.id}`">
                                <img  
                                 v-lazy="{src: item.picUrl+'?param=160y160', error: require('@/assets/img/歌手.png'), loading: require('@/assets/img/歌手.png')}"
                                 alt=""> 
                            </router-link>
                        </div>
                        <router-link :to="`/singer?id=${item.id}`" class="singer-name">{{item.name}}</router-link>
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
import {singerApi} from '@/api';

export default {
    name: "",
    components: {},
    data() {
        return {
            scrollBottom:0,
            isLoading:false,//是否 加载新数据
            more:true,//是否 有下一页数据
            currentIndex:1,//当前页数
            areaData:{
                '-1':'全部',
                '7':'华语',
                '96':'欧美',
                '8':'日本',
                '16':'韩国',
                '0':'其他'
            },
            typeData:{
                '-1':'全部',
                '1':'男歌手',
                '2':'女歌手',
                '3':'乐队',
            },
            initialData:{},
            page:{
                area:'-1',//-1全部 7华语 96欧美 8日本 16韩国 0其他
                type:'-1',//-1全部 1男歌手 2女歌手 3乐队
                initial:"-1",//-1热门 0# 字母|名字以首字母开头的
                limit:20,//数量 最大100
                offset:0,//偏移量  （页数-1）*数量
            },
            artists:[],
           
        };
    },
    props:{},
    computed: {

    },
    watch: {
        'isLoading':async function(){
            if(this.isLoading){
                    this.currentIndex +=1;
                    // console.log(this.currentIndex,this.page.limit);
                    this.page.offset = (this.currentIndex-1) * this.page.limit;
                    // console.log(this.page.offset );
                    const res = await singerApi.getSingerList(this.page);
                    this.more = res.more
                    this.artists = this.artists.concat(res.artists)
                    // console.log(res);
                    // console.log("加载了");
                    this.isLoading=false;
            }
        },
        '$route.query': {
            async handler (){
                if( Object.keys(this.$route.query).length !=0){
                    console.log("进来了");
                    this.page.area = this.$route.query.area;
                    this.page.type = this.$route.query.type;
                    this.page.initial = this.$route.query.initial;
                    this.page.offset = 0;
                    this.currentIndex = 1;
                }
                const res = await singerApi.getSingerList(this.page);
                this.artists = res.artists
            },
            // 深度观察监听
            deep: true,
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
        initInitialData(){
            const initialDataObj={}
            initialDataObj['-1']='热门'
            let i = 0 ;
            while(i < 26){
                let c= String.fromCharCode(65+i);
                initialDataObj[c]=c;
                i++;
            }
            initialDataObj['0']='#'
            this.initialData = initialDataObj;
        },
    },
    beforeCreated() {
    },
    created() {
        window.addEventListener('scroll',this.scrollHandler)
        this.initInitialData();
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
.dc-singer-box{
    .dc-singer-wrap{
        width: 920px;
        margin: 0 auto;
        background-color: white;
        padding: 30px;
        span{
            float: left;
            height: 24px;
            line-height: 24px;
        }
        .language,.category,.surname{
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
        .language,.category{
            & > li:last-child{
                order: -1;
            }
        }
        .surname{
            & > li:nth-child(1){
                order: 2;
            }
            & > li:nth-child(2){
                order: -1;
            }
        }
    }

    .singer-list-wrap{
        margin: 20px 0;
        .singer-list{
            display: flex;
            flex-wrap: wrap;
            li{
                margin-right: 24px;
                margin-bottom: 16px;
                img{
                    width: 160px;
                    height: 160px;
                }
                .singer-name{
                    display: inline-block;
                    margin-top: 6px;
                    font-size: 14px;
                }
            }
        }
        p{
            font-size: 24px;
            font-weight: 700;
            text-align: center;
        }
    }
}

</style>