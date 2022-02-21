import {systemApi} from '@/api';


// 用户状态管理
export default {
    namespaced: true,
    state: {
        userInfo:{
          userId:0,//用户id
          avatarUrl:'',//用户头像
          nickname:'',//用户昵称
          gender:'',//性别
          birthday:'',//生日
          signature:'',//签名
        },//用户信息
        userState:{
          isLogin:false,//是否登入
          cookie:'',//登入成功后返回的cookie
        },//用户状态
  
    },
    mutations: {
      updateUserInfo(state,{profile}){
        // console.log(profile);
        const {userId,avatarUrl,nickname,gender,birthday,signature} = profile;
        state.userInfo ={userId,avatarUrl,nickname,gender,birthday,signature};
      },
      updateUserState(state,{userState}){
        state.userState = userState;
      }
    },
    actions: {
      //退出登入
      async logout({state,commit}){
        console.log("退出登入");
        const res =  await systemApi.logout();
        if(res.code == 200){
          //成功退出 刷新登入状态 并改变vuex中的用户状态
          commit("updateUserInfo",{profile:{}})
          commit("updateUserState",{userState:{
            isLogin:false,
            cookie:'',
          }})
        }
        // systemApi.loginRefresh()
        // .then(res=>{
        //   console.log(res);
        // })
        // .catch(err=>{
        //   console.log(err);
        // })
  
        return true;
      }
    },
  }
  