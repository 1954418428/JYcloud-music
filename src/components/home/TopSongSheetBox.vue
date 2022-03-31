<template>
  <div class="top-song-sheet-list">
    <div class="top-sheet-wrap">
      <TopSongSheetItem
        v-for="item in topList"
        :key="item.id"
        class="top-song-sheet-item"
        :topPlayList="item"
      ></TopSongSheetItem>
    </div>
  </div>
</template>

<script>
import TopSongSheetItem from "../song/TopSongSheetItem.vue";

import { toplistApi } from "@/api";

export default {
  name: "",
  components: { TopSongSheetItem },
  data() {
    return {
      topList: []
    };
  },
  props: {},
  computed: {},
  watch: {},
  methods: {},
  beforeCreated() {},
  async created() {
    if (sessionStorage.getItem("topList")) {
      const list = JSON.parse(sessionStorage.getItem("topList"));
      this.topList = list.slice(0, 4);
    } else {
      const res = await toplistApi.getTopList();
      sessionStorage.setItem("topList", JSON.stringify(res.list));
      this.topList = res.list.slice(0, 4);
    }

    this.$emit("emitFirstTopPlayListId", this.topList[0].id);
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
.top-song-sheet-list {
  margin-bottom: 40px;
  .top-sheet-wrap {
    display: flex;
    justify-content: center;
    .top-song-sheet-item {
      border: 1px solid rgba(51, 51, 51, 0.3);
    }
    /deep/ .top-wrap {
      background-color: rgb(232, 232, 232);
    }
    /deep/ li {
      border-top: 1px solid rgba(153, 79, 79, 0.3);
      background-color: rgb(244, 244, 244);
    }
  }
}
</style>
