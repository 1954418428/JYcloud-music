<template>
    <!-- 创建或修改歌单 -->
    <div class="create-sheet-box" v-show="createBox.isShow">
        <div class="create-sheet-wrap">
            <div class="title">
                {{create.model==1?'新建':'修改'}}歌单
                <i class="iconfont icon-guanbi" title="关闭"
                @click="asyncupdateCreateBoxIsShow({isShow:false})"
                ></i>
            </div>

            <div class="playlist">
                <div class="name-input">
                    <label for="name-input">歌单名：</label>
                    <el-input
                        placeholder="请输入歌单名"
                        v-model="create.playlist.name"
                        clearable
                        class="name-input"
                        id="name-input"
                        >
                    </el-input>
                </div>

                <p v-if="create.model==1">
                可通过“收藏”将音乐添加到新歌单中
                </p>

                <div v-else>
                    <div class="desc-input">
                        <div style="height:40px;line-height:40px">
                            <label for="name-input">标签：</label>
                            <el-tag
                            v-for="(item,index) in create.playlist.tags" :key="item"
                            closable
                            style="margin-right:6px"
                            @close="closeTag(index)"
                            disable-transitions
                            >
                            {{item}}
                            </el-tag>
                            <span v-show="create.playlist.tags.length==0"
                                style="font-size:14px"
                            >选择适合的标签，最多选3个</span>
                        </div>
                    



                        <div class="categorys" >
                        
                            <div class="c-list">
                                <div class="categorys-wrap" v-for="item in playListCatlist" :key="item.id">

                                    <div class="category-item">
                                        <i :class="item.iconClass"></i>
                                        <span>
                                            {{item.name}}
                                        </span>  
                                    </div>

                                    <ul class="tags-wrap">
                                        <li v-for="sub in item.subs" :key="sub.name" class="tag-item">
                                            <span @click="addTag(sub.name)">
                                                {{sub.name}}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="name-input">
                            <label for="desc-input">介绍：</label>
                            <el-input
                                type="textarea"
                                placeholder="请输入歌单描述"
                                v-model="create.playlist.desc"
                                clearable
                                class="desc-input"
                                id="desc-input"
                                >
                            </el-input>
                    </div>
                </div>



                <div class="btn">
                    <el-button type="primary" v-if="create.model==1"
                     @click="createPlaylist"
                    >新建</el-button>

                    <el-button type="primary" v-else
                        @click="updatePlaylist"
                    >保存</el-button>

                    <el-button type="info"
                        @click="asyncupdateCreateBoxIsShow({isShow:false})"
                    >取消</el-button>

                </div>
            </div>

            
        </div>
     
    </div>
</template>

<script>
import {mapState,mapActions,mapMutations} from 'vuex';
import {sheetApi} from '@/api';
export default {
    name: "",
    components: {},
    data() {
        return {
            playListCatlist:[],//全部分类
        };
    },
    props:{},
     computed: {
        ...mapState('CreateSheetModule',[
        "createBox","create"
        ]),
        ...mapState('CreateSheetModule',[
        "create"
        ])
    },
    watch: {
       
    },
    methods: {
         ...mapActions('CreateSheetModule',[
           'asyncupdateCreateBoxIsShow'
       ]),
         ...mapMutations('CreateSheetModule',[
           'updateIsOver',"updateCreate"
       ]),
       createPlaylist(){
           if(this.create.playlist.name){
               sheetApi.createPlaylist(this.create.playlist.name)
               .then(res=>{
                   console.log(res);
                //res.id 新建成功的歌单id  res.playlist 新建成功的歌单对象
                   this.$message({
                        message:`新建歌单成功`,
                        type: 'success',
                        duration:1500
                    });
                    this.updateCreate({
                        model:1,
                        playlist:{
                            id:res.id,
                            name:res.playlist.name,
                            coverImgUrl:res.playlist.coverImgUrl,
                            tags:res.playlist.tags,
                            desc:res.playlist.description
                        }
                    })
                    this.updateIsOver({over:true});
                    setTimeout(() => {
                        this.asyncupdateCreateBoxIsShow({isShow:false})
                    }, 100);
               }).catch(err=>{
                    this.$message({
                        message:`新建歌单失败,已报告管理员`,
                        type: 'error',
                        duration:1500
                    });
               })
           }else{
                this.$message({
                        message:`请输入歌单名`,
                        type: 'warning',
                        duration:1500
                });
           }
       },
       updatePlaylist(){
            const {tags} = this.create.playlist
            let queryTags ='';
            tags.forEach(t=>{
                queryTags+=(t+";")
            })
            queryTags=queryTags.substring(0, queryTags.lastIndexOf(";"));
           sheetApi.updatePlaylist({
               id:this.create.playlist.id,
               name:this.create.playlist.name,
               desc:this.create.playlist.desc,
               tags:queryTags
           })
           .then( (res)=>{
               console.log(res);
               this.$message({
                        message:`修改歌单成功`,
                        type: 'success',
                        duration:1500
                });
                this.updateIsOver({over:true});
                setTimeout(() => {
                    this.asyncupdateCreateBoxIsShow({isShow:false})
                }, 100);
           }
           ).catch(err=>{

           })
       },
       addTag(tag){
           if(this.create.playlist.tags.length<3){
               this.create.playlist.tags.push(tag)
           }else{
               this.$message({
                        message:`最多允许选择3个标签`,
                        type: 'warning',
                        duration:1500
                });
           }
           
       },
       closeTag(index){
           this.create.playlist.tags.splice(index,1)
       }
    
    },
    beforeCreated() {},
    created() {
        if(sessionStorage.getItem('playListCatlist')){
                const playListCatlist = JSON.parse(sessionStorage.getItem('playListCatlist'));
                this.playListCatlist = playListCatlist;
            }else{
                console.log("请求playListCatlist");
                sheetApi.getPlayListCatlist().then(res=>{
                        const categorys = res.categories;
                        const sub =res.sub;
                        for(let key  in categorys){
                            const  obj = {
                            }
                            const  k= parseInt(key);
                            obj.id =k;
                            obj.name=categorys[key];

                            switch(parseInt(key)){
                                case  0: obj.iconClass="iconfont icon-duoyuyan"
                                break;
                                case  1: obj.iconClass="iconfont icon-gangqin"
                                break;
                                case  2: obj.iconClass="iconfont icon-kafei"
                                break;
                                case  3: obj.iconClass="iconfont icon-xiaolian"
                                break;
                                case  4: obj.iconClass="iconfont icon-yinle1"
                                break;
                            }
                            obj.subs = sub.filter(item=>{
                                return item.category == key
                            })
                            this.playListCatlist.push(obj)
                        }
                        sessionStorage.setItem("playListCatlist",JSON.stringify(this.playListCatlist))
                });
            }
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
.create-sheet-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 504;

    .create-sheet-wrap{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width:480px;
        min-height:264px;
        background-color: rgb(255,255,255);
        box-sizing: border-box;
        box-shadow: 0 5px 16px rgba(0,0,0 ,0.8);
        .title{
            height: 38px;
            line-height: 38px;
            padding: 0 18px;
            font-size: 14px;
            font-weight: 600;
            color: #fff;
            background: #2d2d2d;
            i{
                float: right;
                cursor: pointer;
            }
        }

        .playlist{
            padding: 24px;
            & > :nth-child(n){
                margin-bottom: 20px;
            }
            .name-input{
                label{
                    font-size: 16px;
                }
                .name-input{
                    width:360px
                }
            }
            .desc-input{
                label{
                    font-size: 16px;
                }
                .desc-input{
                    width:360px
                }
            }
            p{
                margin-left: 64px;
            }
            .btn{
                margin-left: 64px;
            }
        }
       
    }
}


.categorys{
    margin: 10px 0;
    height: 260px;
    overflow-y:scroll ;
    width: 430px;
    border: 1px solid rgba($color: #000000, $alpha: 0.2);
    border-radius: 6px;
    z-index: 5;
    a{
        display: inline-block;
        text-align: center;
    }

    .c-list{
        .categorys-wrap{
            display: flex;
            align-content: center;
            .category-item{
                width: 60px;
                min-height: 22px;
                text-align: center;
                font-weight: 600;
                padding: 10px 0;
                
                border-right: 1px solid rgba($color: #000000, $alpha: 0.2);
                i{
                    font-size: 18px;
                }
            }

            .tags-wrap{
                width: 370px;
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;
                padding: 6px 2px;
                li{
                    height: 30px;
                    line-height: 30px;
                    min-width: 60px;
                    span{
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>