<template>
    <div class="songplaying-box">
        <div class="songplaying-wrap">
            <div  class="left-wrap">
                <div class="PlayingSheet-wrap">
                    <PlayingSheet></PlayingSheet>
                </div>
            </div>

            <div class="right-wrap">
                <div class="Lyric-wrap">
                    <Lyric></Lyric>
                </div>
                <div class="MusicPlayerTools-wrap">
                    <MusicPlayerTools></MusicPlayerTools>
                </div>
            </div>

     
            <div class="floor-wrap">
                <Replay></Replay>
                <Comment v-for="o in 50" :key="o"></Comment>
            </div>

        </div> 
    </div>
</template>

<script>
import MusicPlayerTools from '../../components/system/MusicPlayerTools';
import PlayingSheet from '../../components/system/PlayingSheet';
import Lyric from '../../components/song/Lyric';

import Replay from '../../components/system/Replay';
import Comment from '../../components/system/Comment';


export default {
    name: "",
    components: {PlayingSheet,MusicPlayerTools,Lyric,Replay,Comment},
    data() {
        return {
      
        };
    },
    props:{},
    computed: {},
    watch: {},
    methods: {},
    beforeCreated() {},
    created() {

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
.songplaying-wrap{
    width: 1160px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0;
    .left-wrap{

        height: 588px;
        width: 400px;
        border-radius: 50px;
        .PlayingSheet-wrap{
            /deep/ .bofang-list{
                        background-color: rgba(46, 46, 46, 0.9);

                padding: 10px;
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
                .list-h{
                }
                ul{
                    height: 548px;
                    .icon-bofang{
                        margin-left: 2px;
                    }
                }
            }
             
        }
    }
    .right-wrap{
        height: 608px;
        width: 760px;
        color: white;
        .Lyric-wrap{
            height: 500px;
            background-color: rgba(66,66,66,0.3);
            border-top-right-radius: 20px;
            /deep/ .lyric-ul{
                height: 400px;
            }
        }
        .MusicPlayerTools-wrap{
        background-color: rgba(66, 66, 66, 0.9);
            border-bottom-right-radius: 20px;
            /deep/ .top{
                padding: 6px;
                height: 36px;
                line-height: 36px;
                
            }
            /deep/ .music-slider{
                height: 26px;
                line-height: 26px;
               .slider{
                   position: relative;
                   top: -6px;
               }
                .music-time{
                    width: 10%;
                    margin-left: 16px;
                }
            }
            /deep/ .m-t{
                justify-content: center;
                // padding: 10px 0;
                i{
                    margin: 0 20px;
                }
            }
        }
    }
    
    .floor-wrap{
        width: 100%;
        
        margin-top: 20px;
        // background-color: red;
    }
}
</style>