<template>
    <div class="reply-item-box" id="reply-box" ref="replyBox">
        <div style="text-align:center;margin-right:8px">
            <img 
            v-lazy="{src:userInfo.avatarUrl, error: require('@/assets/img/用户.png'), loading: require('@/assets/img/用户.png')}"
            alt="" class="user-img" :style="{height: size + 'px',width: size + 'px'}">
            <div class="user-name">
                {{userInfo.nickname || '用户名'}}
            </div>
        </div>

        <div style="width:100%">
            <textarea class="input-conntent" 
            v-model="content" rows="3"
            :placeholder="commentQueryData.msg"
            >
            </textarea>
            <span class="btn" @click="sendComment">
                发表评论
            </span>
            <span class="btn" @click="deleteCommentId"
                style="margin-left:10px;background-color: #999;"
                v-show="commentQueryData.t == 2"
            >
                取消回复
            </span>

        </div>            
    </div>
</template>

<script>
import {mapState,mapActions,mapMutations} from 'vuex';
import {systemApi} from '@/api';
export default {
    name: "ReplyItem",
    components: {},
    data() {
        return {
       
        };
    },
    props:{
       size:{
           default:60
       },

    },
    computed: {
        ...mapState("UserModule",[
            'userState','userInfo'
        ]),
        ...mapState("CommentModule",[
            'commentQueryData'
        ]),
        content: {
            get () {
                return this.$store.state.CommentModule.commentQueryData.content;
            },
            set (val) {
                this.updateContent(val)
            }
        }
    },
    watch: {},
    methods: {
        ...mapMutations('CommentModule',[
            'updateContent','deleteCommentId'
        ]),
  
        sendComment(){
            if(this.userState.isLogin){
                if(this.commentQueryData.content){
                // console.log(this.commentQueryData);
                systemApi.comment(
                    {
                        t:this.commentQueryData.t,
                        type:this.commentQueryData.type,
                        id:this.commentQueryData.id,
                        content:this.commentQueryData.content,
                        commentId:this.commentQueryData.commentId,
                    }
                )
                .then(res=>{
                    console.log(res);
                    if(res.code ==200){
                        this.$message({
                        message: '评论成功!',
                        type: 'success'
                        })
                    
                        let beReplied =[]; 

                        if(res.comment.beRepliedUser && res.comment.beRepliedUser.userId){
                            let obj = {};
                            obj.beRepliedCommentId = this.commentQueryData.beRepliedCommentId;
                            obj.content = this.commentQueryData.rc;
                            obj.user = res.comment.beRepliedUser;
                            beReplied.push(obj)
                        }

                        const commentId =  res.comment.commentId;
                        const content = res.comment.content;
                        const time = res.comment.time;
                        const user = res.comment.user;
                        const comment = {
                            beReplied,
                            commentId,
                            content,
                            liked:false,
                            likedCount:0,
                            time,
                            user
                        }
                        // console.log('comment',comment);
                        this.$emit('emitAddComment', comment);
                        this.deleteCommentId()
                    
                    }else{
                        this.$message({
                            message: '评论太频繁,请稍后再评论!',
                            type: 'warning'
                        })
                    }
                   
                })
                }else{
                    this.$message({
                        message: '请输入评论内容',
                        type: 'warning'
                    })
                }
            }else{
                this.$confirm('您未登入！是否跳转登入界面？', '提示')
                .then(() => {
                    this.$router.push({path:'/login'})
                }).catch(()=>{
                })
            }
        },
        move(){
            const  replyBox = this.$refs.replyBox;
            window.scrollTo(0,replyBox.offsetTop-200);
        }
    },
    beforeCreated() {},
    created() {
        this.$eventBus.$on("move",this.move);
        
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
<style scoped>
.reply-item-box{
    /* width: 100%; */
    /* height: 80px; */
    display: flex;
    margin: 5px 0;
}
.user-img{
    height: 60px;
    width: 60px;
    border-radius: 30px;
    box-sizing: content-box;
    border:1px solid rgb(0, 0, 0,0.2);
}
.input-conntent{
    font-size: 14px;
    padding: 6px;
    resize:none;
    width: 95%;
    outline: none;
}
.btn{
    width: 82px;
    height: 34px;
    line-height: 34px;
    display: inline-block;
    text-align: center;
    color: #fff;
    background-color: #f39c12;
    cursor: pointer;
}
.btn:hover{
    background-color: #e99815;
}
</style>