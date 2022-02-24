import {systemApi} from '@/api';


// 用户状态管理
export default {
    namespaced: true,
    state: {
        commentQueryData:{
            t:1,//1发送, 2 回复
            type:0,//0:歌曲 1:mv  2:歌单 3:专辑
            id:0,//对应资源 id
            content:'',//要发送的内容
            commentId:0,//回复的评论 id (回复评论时必填)
            msg:'',//回复的评论 用于展示回复谁
            rc:'',//回复的评论内容
            beRepliedCommentId:0,//回复的评论的id
        }
    },
    mutations: {
      initCommentQueryData(state,commentQueryData){
        state.commentQueryData.t = 1;
        state.commentQueryData.type = commentQueryData.type;
        state.commentQueryData.id = commentQueryData.id;
        state.commentQueryData.content = '';
        state.commentQueryData.commentId = 0;
        state.commentQueryData.msg = '快来评论吧！';
        state.commentQueryData.rc = '';
        state.commentQueryData.beRepliedCommentId = 0;

      },
      updateCommentId(state,{commentId,nickname,rc,beRepliedCommentId}){
        state.commentQueryData.t = 2;
        state.commentQueryData.commentId = commentId
        state.commentQueryData.msg = "回复："+nickname
        state.commentQueryData.rc = rc
        state.commentQueryData.beRepliedCommentId = beRepliedCommentId;


      },
      deleteCommentId(state){
        state.commentQueryData.t = 1;
        state.commentQueryData.content = '';
        state.commentQueryData.commentId = 0;
        state.commentQueryData.msg = '快来评论吧！';
        state.commentQueryData.rc = '';
        state.commentQueryData.beRepliedCommentId = 0;

      },
  
      updateContent(state,content){
        state.commentQueryData.content= content
      }
    
    },
    actions: {
  
    },
  }
  