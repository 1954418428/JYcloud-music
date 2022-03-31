<template>
  <div class="notfount-box">
    <div class="notfount-wrap">
      <div class="m">
        <p>很抱歉，你要查找的网页找不到</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  props: {},
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
  deactivated() {}
};
</script>
<style lang="scss" scoped>
.notfount-box {
  height: 100vh;
  margin-top: -75px;
  margin-bottom: -170px;
  min-height: 800px;
  padding-top: 75px;
  padding-bottom: 170px;
  box-sizing: border-box;
  .notfount-wrap {
    width: 980px;
    // box-sizing: border-box;
    margin: 0 auto;
    background-color: rgb(242, 242, 242);
    height: 100%;
    position: relative;
    .m {
      position: absolute;
      //  width: 800px;
      // height: 500px;
      // // top: 50%;
      // // left: 50%;
      // // transform: translate(-50%,-50%);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("../../assets/img/404.jpeg");
      background-size: 100% auto;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      margin-bottom: 60px;
      p {
        text-align: center;
        font-size: 32px;
        font-weight: 700;
      }
    }
  }
}
</style>
