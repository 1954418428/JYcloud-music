<template>
    <div class="singer-desc">
        <div class="name">
            {{artist.name+"简介"}}
        </div>
        <p>
          {{artist.briefDesc}}
        </p>
    </div>
</template>

<script>

export default {
    name: "",
    components: {},
    data() {
        return {

        };
    },
    props:
        ["artist"]
    ,
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
<style lang="scss" scoped>
   .singer-desc{
       .name{
           margin: 3px 0;
           padding: 0px 6px;
       }
        div{
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            font-weight: 600;
        }
        p{
            text-indent: 2em;
            color: #666;
            line-height: 18px;
        }
    }
</style>