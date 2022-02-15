import request from '@/utils/request';

//榜单 api

export default {
    //所有榜单 前四个官方版 后面的都是全球版
    //榜单也是一种歌单
    getTopList:function(){
        return new Promise((resolve,reject)=>{
            request.get('/toplist')
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },

}