<template>
<div>
    <div class="comment-item-box" :style="comment.commentId?'min-height: 80px;':''">
        <img v-if="comment.commentId" :src="comment.user.avatarUrl" alt="" class="user-img">
        <div class="right-box" :style="comment.commentId?'border-bottom: 1px dashed  rgb(0, 0, 0,0.5);':''">
            <!-- `?id=${comment.user.userId}` -->
            <router-link :to="`/user/home?id=${comment.user.userId}`" class="user-name">{{comment.user.nickname}}</router-link>
            <div class="comment-content">
             <!-- <span>回复 <a>张三</a> :</span> -->
                {{comment.content}}
            </div>

            <div v-if="comment.beReplied && comment.beReplied.length!=0">
                <Comment :comment= "comment.beReplied[0]" style="background-color: rgb(240,240,240);padding:0 4px"></Comment>
            </div>

            <div class="right-bottom-box" v-if="comment.commentId">
                <span class="comment-time" v-if="comment.time">{{moment(parseInt(comment.time)).format('YYYY/MM/DD hh:mm:ss')}}</span>
                <span class="comment-liked-count"><i class="iconfont icon-dianzan"></i>{{comment.likedCount}}</span>
                <span @click="replyIsChecked" 
                style="cursor: pointer;">回复</span>
            </div>
        </div>
    </div>

    
</div>
</template>

<script>
import {mapState,mapActions,mapMutations} from 'vuex';

export default {
    name: "Comment",
    components: {},
    data() {
        return {

        };
    },
    props:{
        comment:{
            type:Object,
            required:true
        }
    },
    computed: {
         ...mapState("UserModule",[
            'userState'
        ]),
    },
    watch: {},
    methods: {
         ...mapMutations('CommentModule',[
            'updateCommentId'
        ]),
        replyIsChecked(){
            if(this.userState.isLogin){
                this.updateCommentId({
                    commentId:this.comment.commentId,
                    nickname:this.comment.user.nickname,
                    rc:this.comment.content,
                    beRepliedCommentId:  this.comment.beReplied.length? this.comment.beReplied[0].beRepliedCommentId : 0
                });
                this.$eventBus.$emit("move");
            }else{
                this.$confirm('您未登入！是否跳转登入界面？', '提示',
                {
                    customClass:'b'
                })
                .then(() => {
                    this.$router.push({path:'/login'})
                }).catch(()=>{
                })
            }
            
        }
    },
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
<style scoped>
.comment-item-box{
    display: flex;
    margin: 8px 0;
}
.user-img{
    height: 60px;
    width: 60px;
    border-radius: 30px;
    border:1px solid rgb(0, 0, 0,0.2);
    margin-right: 6px;
    flex-shrink: 0;
    box-sizing: content-box;
}
.right-box{
    flex-grow: 1;
    padding-bottom: 6px;
    
}
.user-name{
    font-size: 16px;
    color: #72afd2;
    font-weight: 600;
}
.comment-content{
    font-size: 16px;
    width: 100%;
    /* word-wrap:break-word !important; */
    word-wrap:break-word;

}
.comment-liked-count:hover{
    color: rgb(255, 0, 0);
}
.right-bottom-box > :nth-child(n){
    color: #888;
    font-size: 14px;
    margin-right: 8px;
}

.b{
    background-color: red !important;
}

</style>