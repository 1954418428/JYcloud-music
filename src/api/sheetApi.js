import request from '@/utils/request';

//歌单api

export default {
    //获取用户歌单 subscribed为true表示是自己收藏的 为false表示是自己创建的
    getUserPlayList:function(uid,limit=30){
        return new Promise((resolve,reject)=>{
            request.get('/user/playlist',{
                uid,
                limit,
                timestamp:new Date().getTime(),
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取歌单详情 包括歌单详情 和 歌曲列表（trackIds完整 tracks未登入时不完整）
    getPlayListDetail:function(id){
        return new Promise((resolve,reject)=>{
            request.get('/playlist/detail',{
                id,timestamp:new Date().getTime()
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    
    //获取歌单所有歌曲
    getPlayListTrackAll:function(data){
        /**
         * id       歌单id
         * limit    数量
         * offset   偏移量 0开始
         * 你传入limit=10&offset=1，你会得到第11-20首歌曲
         */
        return new Promise((resolve,reject)=>{
            request.get('/playlist/track/all',{
                ...data
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取推荐歌单 
    getPersonalizedPlayList:function(data){
        return new Promise((resolve,reject)=>{
            request.get('/personalized',{
                ...data
            })
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取相关歌单推荐
    getRelatedPlayList:function(id){
        /**
         * id       歌单id
         * limit    数量
         */
        return new Promise((resolve,reject)=>{
            request.get('/related/playlist',{
                id
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取热门歌单分类 就是华语、流行、摇滚那些 
    getHotPlayList:function(){
        return new Promise((resolve,reject)=>{
            request.get('/playlist/hot')
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取所有歌单分类 sub是全部分类 categories是所有大类 sub中每个分类的category对应categories其中一个
    getPlayListCatlist:function(){
        return new Promise((resolve,reject)=>{
            request.get('/playlist/catlist')
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //筛选歌单  total该类歌单总数 more为true表示有下一页 cat当前分类名
    getTopPlayList:function(data){
        return new Promise((resolve,reject)=>{
        // order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
        // cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
        // limit: 取出歌单数量 , 默认为 50
        // offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
            request.get('/top/playlist',{
                ...data
            })
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //取消或收藏歌单 需要登入
    collectPlayList:function(id,t){
        //id 歌单id
        //t  1为收藏 2取消是收藏
        return new Promise((resolve,reject)=>{
            request.get('/playlist/subscribe',{
                id,t,timestamp:new Date().getTime(),
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //对歌单添加或删除歌曲
    addOrDeleteSong:function(data){
      //op add添加 del删除
      //pid 歌单id
      //tracks 歌单id 可逗号分隔
        return new Promise((resolve,reject)=>{
            request.get('/playlist/tracks',{
                ...data
                ,timestamp:new Date().getTime(),
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //新建歌单
    createPlaylist:function(name){
        return new Promise((resolve,reject)=>{
            request.get('/playlist/create',{
                name
                ,timestamp:new Date().getTime(),
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //删除歌单
    deletePlaylist:function(id){
        console.log(id);
        return new Promise((resolve,reject)=>{
            request.get('/playlist/delete',{
                id
                ,timestamp:new Date().getTime(),
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //修改歌单
    // /playlist/update?id=24381616&name=新歌单&desc=描述&tags=欧美
    updatePlaylist:function (data) {
        //id 歌单id
        //name 歌单名字
        //desc 歌单描述
        //tags 歌单标签 多个用;分隔
        return new Promise((resolve,reject)=>{
            request.get('/playlist/update',{
                ...data
                ,timestamp:new Date().getTime(),
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }
    
}