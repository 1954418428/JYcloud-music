<template>
    <div class="reply-item-box">
        <div style="text-align:center;margin-right:8px">
            <img src="@/assets/img/web-logo.jpeg" alt="" class="user-img" :style="{height: size + 'px',width: size + 'px'}">
            <div class="user-name">范得乐</div>
        </div>

        <div style="width:100%">
            <textarea class="input-conntent" v-model="conntent" rows="3">
            </textarea>
            <span class="btn">
                发表评论
            </span>
        </div>            
    </div>
</template>

<script>

export default {
    name: "ReplyItem",
    components: {},
    data() {
        return {
            conntent:'11'
        };
    },
    props:{
       size:{
           default:60
       }
    },
    computed: {},
    watch: {},
    methods: {},
    beforeCreated() {},
    created() {},
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
    //被keep-alive缓存的组件激活时调用
    activated() {},
    deactivated() {},
    }
</script>
<style scoped>
.reply-item-box{
    /* width: 100%; */
    /* height: 80px; */
    display: flex;
    margin: 5px 0;
}
.user-img{
    height: 60px;
    width: 60px;
    border-radius: 30px;
    box-sizing: content-box;
    border:1px solid rgb(0, 0, 0,0.2);
}
.input-conntent{
    font-size: 14px;
    padding: 6px;
    resize:none;
    width: 95%;
    outline: none;
}
.btn{
    width: 82px;
    height: 34px;
    line-height: 34px;
    display: inline-block;
    text-align: center;
    color: #fff;
    background-color: #f39c12;
}
.btn:hover{
    background-color: #e99815;
}
</style>