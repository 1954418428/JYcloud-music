import Vue from 'vue'
import Vuex from 'vuex'
import createVuexAlong  from 'vuex-along'
import { MessageBox } from 'element-ui';
import router from '@/router';

import {songApi,systemApi} from '@/api';


Vue.use(Vuex)

// 音乐播放器状态管理
const PlayerModule = {
  namespaced: true,
  state: {
      audio:{
        id:0,//音乐id
        url:'',//音乐url
        name:'',//音乐名
        alia:[''],//歌曲别名
        artist: [
          {
              id: 0,//作者id
              name: '',//作者名
          }
        ],
        album: {
          id: 0,//专辑id
          name: "",//专辑名字
          picUrl: "",//专辑图片 也是这首歌的图片
        },
        maxTime: 0,//音频最大播放时长 单位秒
        currentTime:0,//音频当前播放到的时长 单位秒
      },//当前正在播放的音乐对象
      player:{
        songs:[],//音乐列表
        isDrag:false,//播放进度条是否被拖动
        playing:false,//是否正在播放音乐
        muted:false,//是否静音
        volume:50,//音量
        playType:0,//播放类型 0顺序 1随机 2循环 3单曲循环
        currentIndex:0,//当前播放的歌曲 在音乐列表中的索引
        audioObj:null,//媒体对象
        randomSongs:[
         
        ],//存储随机播放的音乐次序
        isLock:false,//播放器是否显示(固定)
      },//播放器对象
      clyric:{
        isShow:false,//歌窗口是否显示
      },//歌词对象
      
  },

  mutations: {
    // 初始化媒体对象(audio元素那个对象)
    initAudioObj(state,{audioObj}){
      state.player.audioObj=audioObj;
      state.player.playing=false
    },
    // 修改歌曲列表
    // 单击歌单中的某首歌,将该歌单中的音乐列表变为正在播放的音乐列表,并传入单击的歌在音乐列表中的索引
    updateSongs(state,{songs}){
      state.player.songs = songs;
    },
    // 切换正在播放的音乐
    // 单击正在播放的音乐列表中的某首歌,获取列表中这首歌的信息,并获得其url、设置audio为这首歌的信息
    updateAudio(state,{currentIndex,audio}){
      state.player.playing=false;
      state.player.currentIndex = currentIndex; 
      state.audio = audio
    },
    //修改播放状态
    updatePlayState(state,{playing}){
      // console.log('playing',playing);
      state.player.playing = playing;
    },
    //播放音乐
    play(state){
      // console.log("播放",state.player.audioObj);
      if(state.audio.url){
        state.player.audioObj.play()
      }
      
    },
    //暂停音乐
    pause(state){
      // console.log("暂停",state.player.audioObj);
      if(state.audio.url){
        state.player.audioObj.pause()
      }
    },
    //修改音量
    updateVolume(state,{type}){
      // console.log("type",type);
      if(type == 'up'){
        if(state.player.volume < 100){
          state.player.volume +=5;
          state.player.audioObj.volume = state.player.volume/100;
        }
      }else if(type == 'down'){
        if(state.player.volume > 0){
          state.player.volume -=5;
          state.player.audioObj.volume = state.player.volume/100;
        }
      }else if(type == 'muted'){
        state.player.muted =!state.player.muted;
        state.player.audioObj.muted =state.player.muted;
      }
    },
    //修改播放类型
    updatePlayType(state){
      state.player.playType = (state.player.playType +1) % 4
      //playType:0,//播放类型 0顺序 1随机 2循环 3单曲循环
      if(state.player.playType == 1){
        //播放类型为随机的话 将当前播放的歌曲 压入 随机播放歌曲列表
        state.player.randomSongs.push(
          {
            index:state.player.currentIndex
          }
        )
      }else{
        //播放类型为其他的话 置空 随机播放歌曲列表
        state.player.randomSongs=[];
      }
    },
    //监听音乐播放 用来更新音频流的当前播放时间
    //大概每隔一秒钟执行一次
    onTimeupdate(state,e) {
      if(!state.player.isDrag){
        state.audio.currentTime = e.target.currentTime;
      }
    },
    //监听媒体加载 加载完毕后执行
    onLoadedmetadata(state,e) {
      state.player.audioObj.play()
    },     
    //拖动滑块 改变当前音乐播放的时间
    changeCurrentTime(state,index){
      // console.log(index);
        state.player.audioObj.currentTime =index;
        state.player.isDrag = false;     
        // console.log(state.player.isDrag);
    },
    //修改滑块的状态 是否被拖动
    updateIsDrag(state,s){
      state.player.isDrag = s;
      // console.log(state.player.isDrag);
    },
    //修改播放器窗口显示状态
    updateIsLock(state,isLock){
      state.player.isLock = isLock;
    },
    //修改歌词窗口显示状态
    updateClyricShow(state){
      state.clyric.isShow =  !state.clyric.isShow
    },
    //添加歌曲列表 到当前播放的歌曲列表
    addSongs(state,{songs}){
      if(songs.length==0){
        return;
      }

      if(state.player.currentIndex !=-1){
        //当前已选中了歌曲
        //添加到已选取列表的后面一首
        state.player.songs.splice(state.player.currentIndex+1,0,...songs);
      }else{
        //没有选择 则添加到列表最后
        state.player.songs.push(...songs)
      }
    },
    //从歌曲列表中 移出歌
    removeSong(state,{removeIndex}){
   
      state.player.songs.splice(removeIndex,1);

      if(state.player.songs.length == 0){
        state.player.currentIndex =  -1;
      }
    }

  },
  actions: {
    // 修改Audio对象
    asyncUpdateAudio({state,commit},{currentIndex}){
      const  song = state.player.songs[currentIndex];
      // console.log(song);
       // 获取音乐url
       songApi.getSongUrl(song.id)
       .then(res=>{
          const audio={
            id:song.id,//音乐id
            url:res.data[0].url  ,//音乐url
            name:song.name,//音乐名
            alia:song.alia,//歌曲别名
            artist: song.ar,
            album: {
              id: song.al.id,//专辑id
              name: song.al.name,//专辑名字
              picUrl: song.al.picUrl,//专辑图片 也是这首歌的图片
            },
            maxTime: song.dt / 1000,//音频最大播放时长 单位秒
            currentTime:0,//音频当前播放到的时长 单位秒
          }
          commit('updateAudio',{currentIndex,audio})
       });

    },
    // 修改歌曲列表 （切换歌单）
    //（单击歌单某首歌播放 将该歌单歌曲列表 添加进播放器  
    // 并播放刚刚单击的歌）
    cutSongSheet({state,dispatch,commit},{songs,currentIndex}){

      songs = JSON.parse(JSON.stringify(songs)) 
      
      //切换歌单
      commit('updateSongs',{songs});
      //播放刚刚单击的歌
      dispatch('asyncUpdateAudio',{currentIndex})
    },
    // 切歌:上一首或下一首
    cutSong({state,dispatch,commit},{type}){
      // 随机播放 上一首下一首都是随机的
      if(state.player.playType == 1){
      
        //随机生成 0 <= r <= songs.length-1
        let currentIndex = Math.round(Math.random() * (state.player.songs.length-1));
        while( currentIndex == state.player.currentIndex){
          currentIndex = Math.round(Math.random() * (state.player.songs.length-1));
        }
        // 随机生成的currentIndex 不等于当前正在播放的音乐索引
        if(type =='next'){
          //表示 当前播放的歌曲 是随机列表的最后一首歌 需要加入新的歌到随机列表
          if( state.player.currentIndex == state.player.randomSongs[ state.player.randomSongs.length-1].index){
            state.player.randomSongs.push(
              {
                index:currentIndex
              }
            )
          }else{
          //表示 当前播放的歌曲 不是随机列表的最后一首歌 它的后面还有歌 直接播放它的下一首歌
            //找个随机列表中 这首歌的下一首歌的索引
            //从前往后遍历
            let i = 0;
            while(i < state.player.randomSongs.length){
              if(state.player.currentIndex ==  state.player.randomSongs[i].index){
                break;
              }
              i++;
            }
            currentIndex = state.player.randomSongs[i+1].index
            console.log("下一首索引",currentIndex);
          }

        
        }if(type == 'pre'){
          //表示 当前播放的歌曲 是随机列表的第一首歌 需要加入新的歌到随机列表
          if( state.player.currentIndex == state.player.randomSongs[0].index){
            state.player.randomSongs.unshift(
              {
                index:currentIndex
              }
            )
          }else{
          //表示 当前播放的歌曲 不是随机列表的第一首歌 它的前面还有歌 直接播放它的上一首歌
            //找个随机列表中 这首歌的上一首歌的索引
            //从后往前遍历
            let i = state.player.randomSongs.length-1;
            while(i >=0){
              if(state.player.currentIndex ==  state.player.randomSongs[i].index){
                break;
              }
              i--;
            }
            currentIndex = state.player.randomSongs[i-1].index
            console.log("上一首索引",currentIndex);
          }
         
        }
        dispatch("asyncUpdateAudio",{currentIndex});
        return;
      }

      let currentIndex = -1;
      if(type =='next'){
        //切换到下一首
        currentIndex = (state.player.currentIndex + 1) % state.player.songs.length;
      }else if(type == 'pre'){
        //切换到上一首
        if(state.player.currentIndex - 1 < 0){
          currentIndex = state.player.songs.length-1;
        }else{
          currentIndex = state.player.currentIndex - 1;
        }
      }
      dispatch("asyncUpdateAudio",{currentIndex});

    },
    // 监听音乐播放结束的事件
    onEnded({state,dispatch,commit}){
      //playType:0,//播放类型 0顺序 1随机 2循环 3单曲循环
      if(state.player.playType == 3){
        //重置歌曲时间
        state.audio.currentTime = 0;
        //开始播放(循环播放)
        commit('play')
      }else if(state.player.playType == 0 && state.player.currentIndex!=state.player.songs.length-1){
        //顺序播放  除了列表最后一首歌都直接切换到下一首
        dispatch('cutSong',{type:'next'})
      }else if(state.player.playType == 2){
        //循环播放 每首歌放完都直接切换到下一首
        dispatch('cutSong',{type:'next'})
      }
    },
    // 修改播放器窗口显示状态
    asyncUpdateIsLock({state,commit,dispatch},{isLock}){
      commit("updateIsLock",isLock)
    },
    // 清空听歌列表
    clearSongs({state,commit,dispatch}){
  
      commit("updateSongs",{songs:[]})
      commit("updateAudio",{currentIndex:-1,
        audio:{
          id:0,//音乐id
          url:'',//音乐url
          name:'',//音乐名
          alia:[''],//歌曲别名
          artist: [
            {
                id: 0,//作者id
                name: '',//作者名
            }
          ],
          album: {
            id: 0,//专辑id
            name: "",//专辑名字
            picUrl: "",//专辑图片 也是这首歌的图片
          },
          maxTime: 0,//音频最大播放时长 单位秒
          currentTime:0,//音频当前播放到的时长 单位秒
        }})
        
    },

     //添加一首歌或歌曲列表  为下一首播放
    addNextSong({state,commit,dispatch},{songs}){
      //判断是一首歌 还是 歌曲列表
      if(songs.length == 1){
          const song = songs[0];
          console.log(song);
          //判断这首歌有没有在当前歌单列表
          let index = -1;
          const  flag = state.player.songs.some(item=>{
              index ++;
              return song.id == item.id;
            })

          //存在当前列表中 将原列表中的这首歌 移到当前播放音乐的后面一首
          if(flag){
              //如果这首歌已存在于列表 并且位于当前选择歌的前面
              //将currentIndex -1   这首歌替换选择的歌 选中的歌前移一位
              if(index < state.player.currentIndex){
                state.player.currentIndex -=1;
              }
              //先删
              state.player.songs.splice(index,1);
              //再加
              commit("addSongs",{songs:[song]})
          }else{
            //不存在当前列表中 加到当前播放音乐的后面一首
            commit("addSongs",{songs:[song]})
          }
      }else{
        //已经存在于歌曲列表的歌 不再添加
        const filterSongs = songs.filter((item=>{
          return !(state.player.songs.some(s =>{
            //如果相等 表示已存在于列表 最后返回false 过滤这首歌
              return item.id == s.id
          }));
        }))
        console.log("要添加的歌曲列表",filterSongs);
        commit("addSongs",{songs:filterSongs})
      }

     
    },

    //移除正在播放列表中的歌曲
    asyncRemoveSong({state,commit,dispatch},{removeIndex}){
      // console.log("删除的歌索引",removeIndex);
      // console.log("正在的播歌索引",state.player.currentIndex);
      //删歌
      commit("removeSong",{removeIndex})
      //删完后 列表空了
      if(state.player.songs.length==0){
        // console.log("全删完了");
        dispatch("clearSongs")
        return;
      }

      if(removeIndex == state.player.currentIndex){
        //删除的歌 是正在播放的歌 则切歌
        //由于这首歌 已经被删了 所以下一首歌到了这首歌的位置 
          //这时 state.player.currentIndex 未变 指向的是被删歌的下首歌
        // console.log("切歌了");

        // if(removeIndex == 0 ){
        //   console.log("removeIndex == 0");
        //     //如果删除的歌是列表第一首歌
        //     //由于这首歌 已经被删了 所以下一首歌到了这首歌的位置 
        //     //这时 state.player.currentIndex 未变 指向的是被删歌的下首歌
        // }else
         if(removeIndex == state.player.songs.length){
          // console.log("removeIndex == state.player.songs.length");
            //因为已经歌已经被删了 所以比较时 state.player.songs.length不需要减一
            //如果删除的歌列表的最后一首歌 先让currentIndex 前移
            //即指向最后一首歌的上一首歌 再切歌
            state.player.currentIndex-=1;
        }
        //切换正在播放的歌曲对象
        dispatch("asyncUpdateAudio",{currentIndex:state.player.currentIndex})
      }else if(removeIndex < state.player.currentIndex){ //删除的歌 在这首歌的前面
        //歌已经被删了 当前播放的歌 前移了一位 所以state.player.currentIndex也需要前移一位
        state.player.currentIndex-=1;
      }
      
      //后面的歌 删完 无需操作
      
    
    
    }

    
  },
}

// 用户状态管理
const UserModule = {
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

// 收藏歌单状态管理
const CollectModule={
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

// 新建或修改歌单状态管理
const CreateSheetModule={
  namespaced: true,
  state: {
    createBox:{
      isShow:false,//收藏歌单的div是否显示
    },
    create:{
      model:1,//1创建 2修改
      //要修改的歌单对象
      playlist:{
        id:-1,//-1时 表示新建  非-1时表示要修改的歌单id,
        name:'',//歌单名
        desc:'',//描述
        tags:[],//标签 最多三个
      },
      isOver:false//本次操作数据库是否完成
    }
  },
  mutations: {
    updateCreateBoxIsShow(state,{isShow}){
      state.createBox.isShow = isShow;
    },
    updateCreate(state,{model,playlist}){
      state.create.model = model;
      state.create.playlist = playlist;
    },
    updateIsOver(state,{over}){
      console.log("updateIsOver",over);
      state.create.isOver =over
    }
  },
  actions: {
    asyncupdateCreateBoxIsShow({state,commit,dispatch},{isShow,model=1,playlist={
      id:-1,
      name:'',
      desc:'',
      tags:[],
    }}){
      // console.log("asyncupdateCreateBoxIsShow");
      commit('updateCreateBoxIsShow',{isShow})
      commit('updateCreate',{model,playlist})
      commit('updateIsOver',{over:false})
      
    },
  },
}

export default new Vuex.Store({
  modules: {
    PlayerModule,
    UserModule,
    CollectModule,
    CreateSheetModule
  },
  plugins: [createVuexAlong(
    {
      name:'vuex-data',
      local:{
        list:["UserModule"]
      },
      session: {
        list: ["PlayerModule","CollectModule","CreateSheetModule"] // 保存 count 和模块 ma 中的 a1 到 sessionStorage
      },
    }
  )]//vuex-along
})