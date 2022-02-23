module.exports = {
    configureWebpack:config=>{
        config.externals={
            'vue':'Vue',
            'vuex':'Vuex',
            'vue-router': 'VueRouter',
            'element-ui':'ELEMENT',
            'axios':'axios',
        }
    }
}