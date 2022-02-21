// 新建或修改歌单状态管理
export default  {
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