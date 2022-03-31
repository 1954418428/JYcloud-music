<template>
  <div class="mv-list-wrap">
    <ul class="mv-list">
      <li v-for="item in mvList" :key="item.vid">
        <div class="mv-img">
          <router-link :to="`/mv?id=${item.vid}`">
            <img :src="item.coverUrl + '?param=290y160'" alt="" />
          </router-link>
          <span class="play-time" v-if="item.durationms">
            <i class="iconfont icon-video"></i>
            {{ formatTime(item.durationms / 1000) }}
          </span>
        </div>

        <p class="mv-name">
          <router-link :to="`/mv?id=${item.vid}`">{{ item.title }}</router-link>
        </p>

        <router-link
          :to="`/singer?id=${c.userId}`"
          class="author-name"
          v-for="c in item.creator"
          :key="c.userId"
        >
          {{ c.userName }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { userApi } from "@/api";
export default {
  name: "",
  components: {},
  data() {
    return {
      mvList: []
    };
  },
  props: {},
  computed: {},
  watch: {},
  methods: {},
  beforeCreated() {},
  created() {
    userApi.getCollectMvList().then((res) => {
      this.mvList = res.data;
    });
  },
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
.mv-list-wrap {
  margin: 20px 0;
  .mv-list {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-evenly;
    li {
      // margin-right: 10px;
      margin-left: 52px;
      margin-bottom: 20px;
      width: 290px;
      .mv-img {
        position: relative;
        img {
          width: 290px;
          height: 160px;
        }
        .play-time {
          position: absolute;
          color: white;
          top: 3px;
          right: 6px;
          background-color: rgba($color: #000000, $alpha: 0.3);
          padding: 0 1px;
          border-radius: 3px;
          display: inline-block;
          i {
            position: relative;
            top: 1px;
            margin-right: 2px;
          }
        }
      }

      .mv-name {
        width: 290px;
        margin-top: 6px;
        margin-bottom: 3px;
        font-size: 16px;
      }
      .author-name {
        display: inline-block;
        margin-top: 6px;
        font-size: 14px;
        color: #666;
        margin-right: 8px;
      }
    }
  }
}
</style>
