import request from '@/utils/request';

//系统api
export default {
    //手机登入（密码登入或验证码登入）
    //传入验证码后密码无效
    login:function(data){
        return new Promise((resolve,reject)=>{
            //phone: 手机号码
            //password: 密码
            //captcha 验证码
            data.timestamp=new Date().getTime();
            request.get('/login/cellphone',{
                ...data
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //获取用户登入状态
    getLoginStatus:function(){
        return new Promise((resolve,reject)=>{
            request.get('/login/status',{
                timestamp:new Date().getTime()
            })
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //刷新登入状态
    loginRefresh:function(){
        return new Promise((resolve,reject)=>{
            request.get('/login/refresh',{
                timestamp:new Date().getTime()
            })
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //退出登入 
    logout:function(){
        return new Promise((resolve,reject)=>{
            request.get('/logout',{
                timestamp:new Date().getTime()
            })
            .then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },

    //发送验证码
    sendCaptcha:function(phone){
        return new Promise((resolve,reject)=>{
            request.get('/captcha/sent',{
                phone
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //验证验证码
    verifyCaptcha:function(phone,captcha){
            request.get('/captcha/verify',{
                phone,captcha
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
    },
     //首页轮播图数据
     //targetType 1004:mv  1:新歌首发 10:专辑
     getBanner:function(type = 0){
        return new Promise((resolve,reject)=>{
            request.get('/banner',{
                type:type,//0pc 1android 2iphone 3ipad 默认0
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },

    //二维码key生成接口
    getQRKey:function(){
        return new Promise((resolve,reject)=>{
            request.get('/login/qr/key',{
                timestamp:new Date().getTime()
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //根据获得的key生成二维码
    createQR:function (key) {
        return new Promise((resolve,reject)=>{
            request.get('/login/qr/create',{
                key,
                timestamp:new Date().getTime(),
                qrimg:true
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })

    },
    //二维码检测扫码状态接口
    checkQRState:function(key){
        return new Promise((resolve,reject)=>{
            request.get('/login/qr/check',{
                key,
                timestamp:new Date().getTime(),
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //搜索
    search:function(data){
        //keywords 搜索关键字
        //type 搜索类型
        //limit 数量
        //offset 偏移量

        //1单曲 10专辑 100歌手 1000歌单 1002用户 1004mv 1006歌词 1009电台 1014视频 1018综合 2000声音
        return new Promise((resolve,reject)=>{
            request.get('/cloudsearch',{
                ...data
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //推荐搜索
    suggestSearch:function(keywords){
        return new Promise((resolve,reject)=>{
            request.get('/search/suggest',{
                keywords,
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },

    //评论
    comment:function(data){
        //t:1 发送, 2 回复
        //type: 0:歌曲 1:mv  2:歌单 3:专辑
        //id:对应资源 id
        // content :要发送的内容
        // commentId :回复的评论 id (回复评论时必填)
        data.timeStamp=new Date().getTime()
        return new Promise((resolve,reject)=>{
            request.get('/comment',{
                ...data,
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }

}