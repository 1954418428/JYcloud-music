import request from '@/utils/request';

//专辑 api

export default {
    //获取歌手专辑
    //专辑形似歌单 但不是歌单！
    getSingerAlbumList:function(data){
        // id 歌手id
        // limit 数量
        // offset 偏移量
        return new Promise((resolve,reject)=>{
            request.get('/artist/album',{
                ...data
            })
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取专辑列表 有歌列表也有专辑信息
    getAlbum:function(id){
        // id 专辑id
        return new Promise((resolve,reject)=>{
            request.get('/album',{
                id
            })
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
}