import request from '@/utils/request';

//歌手api

export default {
    //获取歌手分类列表 
    getSingerList:function(data){
        return new Promise((resolve,reject)=>{
            //limit 数量
            //offet 偏移量 默认0
            //type 取值:
                // -1:全部
                // 1:男歌手
                // 2:女歌手
                // 3:乐队
            //area 取值:
                // -1:全部
                // 7华语
                // 96欧美
                // 8:日本
                // 16韩国
                // 0:其他
            //initial 取值:
                // 字母
                // -1:热门
                // 0:#
            request.get('/artist/list',{
                ...data
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //收藏或取消收藏歌手
    collectSinger:function(id,t){
        //id 歌手id
        //t  1为收藏 其他为取消是收藏
        return new Promise((resolve,reject)=>{
            request.get('/artist/sub',{
                id,t
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取收藏的歌手列表 /artist/sublist
    getCollectSingerList:function(){
        return new Promise((resolve,reject)=>{
            request.get('/artist/sublist')
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },

    //歌手热门50首歌曲
    getSingerHotPlayList:function(id){
        return new Promise((resolve,reject)=>{
            request.get('/artist/top/song',{
                id
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取歌手详情
    getSingerDetail:function(id){
        return new Promise((resolve,reject)=>{
            request.get('/artist/detail',{
                id
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取相似歌手
    getSimiSinger:function(id){
        return new Promise((resolve,reject)=>{
            request.get('/simi/artist',{
                id
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    
}