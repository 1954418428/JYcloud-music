import router from '@/router';
import { MessageBox } from 'element-ui';

// 收藏歌单状态管理
export default {
    namespaced: true,
    state: {
      collectBox:{
        isShow:false,//收藏歌单的div是否显示
      },
      collect:{
        tracks:[],//要添加或删除的音乐id列表
      }
    },
    mutations: {
      updateCollectBoxIsShow(state,{isShow}){
        state.collectBox.isShow = isShow;
      },
      updateCollectTracks(state,{tracks}){
        state.collect.tracks =tracks;
      }
    },
    actions: {
      //修改收藏歌单div的限时状态
      asyncUpdateCollectBoxIsShow({state,commit,dispatch,rootState},{isShow}){
        if(rootState.UserModule.userState.isLogin || isShow==false){
          commit('updateCollectBoxIsShow',{isShow})
          if(!isShow){
            commit("updateCollectTracks",{tracks:[]})
          }
          return true;
        }else{
          MessageBox('您未登入！是否跳转登入界面？', '提示')
          .then(() => {
            router.push({path:'/login'})
          }).catch(()=>{
          })
          return false;
        }
      },
      //修改要添加或删除的音乐id列表
      asyncUpdateCollectTracks({state,commit,dispatch,rootState},{tracks}){
        commit("updateCollectTracks",{tracks})
      },
      //收藏按钮被单击
      async collectClicked({state,commit,dispatch,rootState},{tracks}){
        console.log("音乐id列表:",tracks);
        if(tracks[0] ==0){
          return;
        }
        //传入要添加或删除的音乐id列表 并显示收藏歌单div
        const r= await dispatch("asyncUpdateCollectBoxIsShow",{isShow:true});
        // console.log(r);
        if(r) {
          //成功显示
           dispatch("asyncUpdateCollectTracks",{tracks})
        }else{
            console.log("未成功显示");
        }
  
      }
    },
  }