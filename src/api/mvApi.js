import request from '@/utils/request';

//mv api

export default {
    //获取mv地址
    getMvUrl:function(id){
        return new Promise((resolve,reject)=>{
            request.get('/mv/url',{
                id
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取mv数据(详情)
    //带上cookie subed为true 表示该mv被自己收藏
    getMvDetail:function(mvid){
        return new Promise((resolve,reject)=>{
            request.get('/mv/detail',{
                mvid
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //筛选mv
    getMvList:function(data){
        // area     可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部 
        // type     可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部 
        // order    可选值为上升最快,最热,最新,不填则为上升最快
        // limit    数量
        // offset   偏移量
        return new Promise((resolve,reject)=>{
            request.get('/mv/all',{
                ...data
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取相似mv
    getSimiMv:function(mvid){
        return new Promise((resolve,reject)=>{
            request.get('/simi/mv',{
                mvid
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取mv评论 有热评(只有15条) 有最新评论（默认20条）
    // 带上cookie liked为true表示自己赞了这条评论
    // beReplied 是这条评论回复的评论
    getMvCommentList:function(data){
        // id mv id
        // limit 数量
        // offset 偏移量
        return new Promise((resolve,reject)=>{
            request.get('/comment/mv',{
                ...data
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //收藏或取消收藏mv
    collectMv:function(mvid ,t){
        //mvid  mv id
        //t  1为收藏 其他为取消是收藏
        return new Promise((resolve,reject)=>{
            request.get('/mv/sub',{
                mvid ,t
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取歌手mv
    getArtistMvList:function(data){
        //歌手id
        //limit 数量
        //offset 偏移量
        return new Promise((resolve,reject)=>{
            request.get('/artist/mv',{
                ...data
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
}