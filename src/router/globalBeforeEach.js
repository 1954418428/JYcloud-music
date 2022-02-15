
//引入store
import store from '@/store/index.js';

//判断需要参数的路由 是否正确携带参数
//1. 必须包含 requiredQuery中的所有参数
function checkRequiredQuery(to){
    const requiredQuery = to.meta.requiredQuery;
    const  query = to.query;
   
    if(requiredQuery && requiredQuery.length!=0){
        //如果这个路由 需要参数 而 query中没有参数 直接返回false
        //queryKeys 携带的参数
        // console.log("携带的参数",query);
        const queryKeys =  Object.keys(query);
        if(queryKeys.length == 0){
            return false;
        }else{
             //如果有参数 则判断
            //hasQuery中的参数 必须全在携带的query参数中  否则返回false
            for(let i =0;i<requiredQuery.length;i++){
                if(queryKeys.indexOf(requiredQuery[i]) == -1){
                    return false;
                }else{
                    console.log(query[requiredQuery[i]]);
                    if( !query[requiredQuery[i]] ){
                        console.log("参数无值!无效！");
                        return false;
                    }
                }
            }
        }
    }
    return true;
}
//2. 如果包含了fullQuery其中一个 则必须全部包含
function checkFullQuery(to) {  
    const fullQuery = to.meta.fullQuery;
    const  query = to.query;
   
    if(fullQuery && fullQuery.length!=0){
        // console.log("携带的参数",query);
        const queryKeys =  Object.keys(query);
        let fullQueryLength = fullQuery.length;//获得fullQuery有几个参数
        //循环遍历fullQuery  每找到一个则fullQueryLength-1 
        for(let i =0;i<fullQuery.length;i++){
            if(queryKeys.indexOf(fullQuery[i]) != -1){
                fullQueryLength--;
                //包括 但是没有值 直接返回false
                if(!query[fullQuery[i]] ){
                    return false;
                }
            }
        }
        // 全有或全没有
        if(fullQueryLength == 0 || fullQueryLength == fullQuery.length){
            return true;
        }else{
            return false;
        }
    }

}


export default function(to, from,next){
    //from  将要离开的路由
    //to    将要去的路由
    document.title = to.meta.title
    
    if(checkRequiredQuery(to) == false || checkFullQuery(to) ==false){
        next({path: '/notFound',replace:true},)
    }

    // 其他特殊的需要拦截的路由
    const otherFullPath = ['/playlist?id=daily']
    if(to.meta.isLogin || otherFullPath.indexOf(to.fullPath)!=-1 ){
        // console.log("from",from);
        // console.log("to",to,"\n");
        // console.log("拦截");
        //表示这个界面需要登入后才能访问
        const {UserModule} = store.state;
        if(UserModule.userState.isLogin){
            next()
        }else{
            next({path: '/login'})
        }
    }else{
        next()
    }
}