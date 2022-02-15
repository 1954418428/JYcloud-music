<template>
    <div class="singer-list-wrap">
        <ul class="singer-list">
            <li v-for="item in singerList" :key="item.id">
                <div>
                    <router-link :to="`/singer?id=${item.id}`">
                        <img :src="item.picUrl+'?param=160y160'" alt="">
                    </router-link>
                </div>
                <router-link :to="`/singer?id=${item.id}`" class="singer-name">
                    <span>
                        {{item.name}}
                    </span>
                    <span v-if="item.alias">
                        {{item.alias[0]}}
                    </span>
                </router-link>
                <div>
                    <span style="margin-right:16px">专辑：{{item.albumSize}}</span>
                    <span>mv：{{item.mvSize}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {userApi} from '@/api';
export default {
    name: "",
    components: {},
    data() {
        return {
            singerList:[]
        };
    },
    props:{},
    computed: {},
    watch: {},
    methods: {},
    beforeCreated() {},
    created() {
        userApi.getCollectSingerList()
        .then(res=>{
            this.singerList = res.data;
        })
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
.singer-list-wrap{
    margin: 20px 0;
    .singer-list{
        display: flex;
        flex-wrap: wrap;
        
        li{
            margin-top: 10px;
            margin-bottom: 16px;
            margin-left: 66px;
            img{
                width: 160px;
                height: 160px;
            }
            .singer-name{
                display: inline-block;
                margin-top: 6px;
                font-size: 14px;
                & > span:nth-child(2){
                    font-size: 12px;
                    margin-left: 3px;
                    color: #666;
                }
            }
        }
    }
}
</style>