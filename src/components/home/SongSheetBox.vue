<template>
    <div class="song-sheet-list">

        <div class="DailySongsItem">
            <router-link  class="img-a" to="/playlist?id=daily"
            >
                <img :src="require( '@/assets/img/rili/'+dailySongsItem.day+'.png')" alt="" class="song-sheet-img">
            </router-link>
            
            <div class="ct">
                <h3>
                    <router-link to="/playlist?id=daily" >
                        每日歌曲推荐
                        |&nbsp;{{  dailySongsItem.weekDay}}
                    </router-link>
                </h3>
                <p>根据你的口味生成</p>
                <p>每天6:00更新</p>
            </div>
        </div>

        <SongSheetItem v-for="(item) in PersonalizedPlayList" :key="item.id" class="song-sheet-item"
            :song-sheet-item="item"
        ></SongSheetItem>
    </div>
</template>

<script>
import SongSheetItem from '../song/SongSheetItem';
import {sheetApi} from '@/api';

import {mapState} from 'vuex';

export default {
    name: "",
    components: {SongSheetItem},
    data() {
        return {
            PersonalizedPlayList:[],
            dailySongsItem:{},
        };  
    },
    props:{},
    computed: mapState('UserModule',[
        "userState"
    ]),
    watch: {
        "userState.isLogin":{
            async handler(){

                const personalizedPlayList = JSON.parse(sessionStorage.getItem(`${this.userState.isLogin}:PersonalizedPlayList`));

                if(personalizedPlayList && personalizedPlayList.length!=0){
                    this.PersonalizedPlayList = personalizedPlayList;
                }else{
                    const res = await sheetApi.getPersonalizedPlayList({timestamp:new Date().getTime()});
                    this.PersonalizedPlayList  = res.result.slice(0,9)
                    sessionStorage.setItem(`${this.userState.isLogin}:PersonalizedPlayList`,JSON.stringify(this.PersonalizedPlayList))
                }
                this.initDailySongsItem()  
            },
            immediate:true
        }
    },
    methods: {
        initDailySongsItem(){
            // 星期几
            const weekDay ="星期"+"日一二三四五六".charAt(new Date().getDay())
            // 几号
            const day = new Date().getDate()
            this.dailySongsItem= {
                day,
                weekDay,
            }
        },

    },
    beforeCreated() {},
    created() {

    },
    beforeMount() {},
    mounted() {
    },
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
    //被keep-alive缓存的组件激活时调用
    activated() {
        
    },
    deactivated() {},
    }
</script>
<style lang="scss" scoped>
.song-sheet-list{
    display: flex;
    flex-wrap: wrap;
    
    .DailySongsItem{
         margin: 0 18px 20px 18px;
        img{
            width: 160px;
            height: 160px;
            border-radius: 10px;

        }
        .ct{
            padding: 6px 0;
            p{
                color:  #666;
            }
        }

    }

    .song-sheet-item{
        // text-align: center;
        margin: 0 18px 20px 18px;
    }
}

</style>