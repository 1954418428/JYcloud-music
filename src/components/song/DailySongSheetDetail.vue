<template>
  <div class="song-sheet-detail">
    <div class="sheet-img-wrap">
      <img
        :src="require('@/assets/img/rili/' + new Date().getDate() + '.png')"
        alt=""
        class="sheet-img"
      />
    </div>

    <div class="sheet-info-wrap">
      <div class="title">
        <i class="iconfont icon-gedan">歌单</i>
        <h2>每日歌曲推荐</h2>
      </div>
      <div class="operation">
        <a href="" class="bofang-all">
          <i class="iconfont icon-bofang"></i>
          播放全部
        </a>
        <a href="" class="install-all">
          <i class="iconfont icon-xiazai"></i>
          下载全部
        </a>
      </div>

      <div class="desc">
        <p>介绍：根据你的口味生成,每天6:00更新</p>
      </div>

      <div class="count">
        <span> 歌曲：{{ playListDetail.trackCount }} 首 </span>
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
  props: {
    playListDetail: {
      type: Object,
      required: true
    },
    songs: {
      type: Array,
      require: true
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
  deactivated() {}
};
</script>
<style lang="scss" scoped>
.song-sheet-detail {
  display: flex;
  flex-wrap: wrap;
  width: 650px;
  .sheet-img-wrap {
    height: 208px;
    .sheet-img {
      height: 208px;
      width: 208px;
    }
  }
  .sheet-info-wrap {
    width: 410px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    & > div:nth-child(n) {
      margin-bottom: 10px;
      width: 100%;
    }
    padding: 18px 16px;
    .title {
      i {
        float: left;
        padding: 2px;
        font-size: 16px;
        margin-right: 12px;
        display: inline-block;
        border-radius: 3px;
        color: white;
        background-color: rgb(214, 28, 28);
      }
      h2 {
        float: left;
      }
      &::after {
        display: block;
        content: "";
        clear: both;
      }
    }
    .user {
      img {
        width: 30px;
        height: 30px;
        border-radius: 30px;
        vertical-align: middle;
      }
      & :nth-child(n) {
        margin-right: 10px;
      }
    }
    .operation {
      i {
        position: relative;
        top: 1px;
      }
      a {
        display: inline-block;
        margin-right: 6px;
        text-align: center;
        height: 32px;
        line-height: 32px;
        border-radius: 32px;
      }
      .bofang-all {
        width: 100px;
        color: white;
        background-color: rgb(236, 65, 65);
        &:hover {
          background-color: rgb(204, 50, 50);
        }
      }
      .install-all {
        border: 1px solid rgb(223, 223, 223);
        &:hover {
          background-color: rgb(242, 242, 242);
        }
      }
      .install-all {
        width: 100px;
      }
    }

    .count {
      & :nth-child(n) {
        margin-right: 10px;
      }
    }
  }
  .desc {
    width: 100%;
    color: #666;
  }
}
</style>
