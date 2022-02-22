import axios from 'axios';
import router from '@/router';

const baseURL = 'https://fzy-netease-cloud-music.vercel.app/' //默认路径，这里也可以使用env来判断环境

const Axios = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    timeout: 30000,
    baseURL: baseURL, //接口请求地址
})
//发请求带上cookie
Axios.defaults.withCredentials = true

// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log("请求拦截器");
    // console.log(config);
    const cookie=   JSON.parse(localStorage.getItem("vuex-data")).root.UserModule.userState.cookie;
    if(cookie){
        config.params.cookie = cookie;
    }
    // console.log(config);
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log("响应拦截器");

    // console.log(response);

    return response;
  }, function (error) {
    // 对响应错误做点什么
    console.log(error);
    router.push('/notFound')
    return Promise.reject(error);
  });


export default {
    //get请求
    get:function(url,data={}){
        // console.log('get');
        return  new Promise((resolve,reject)=>{
            Axios.get(url,{
                params:data
            },{headers: {'fzy': '666'}}).then(response=>{
                resolve(response.data)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //post请求
    post:function (url,data={}){
        return  new Promise((resolve,reject)=>{
            Axios.post(url,data)
            .then(response=>{
                resolve(response.data)
            }).catch(err=>{
                reject(err)
            })
        })
    }

}
    
