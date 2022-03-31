<template>
  <div>
    <SongSheet :songs="songs" :trackCount="songs.length"></SongSheet>
  </div>
</template>

<script>
import SongSheet from "../../components/song/SongSheet";

import { singerApi } from "@/api";
export default {
  name: "",
  components: { SongSheet },
  data() {
    return {
      songs: [] //歌手热门50首
    };
  },
  props: {},
  computed: {},
  watch: {
    "$route.query": {
      async handler() {
        if (this.$route.query.id) {
          this.songs = [];
          const songsRes = await singerApi.getSingerHotPlayList(
            this.$route.query.id
          );
          this.songs = songsRes.songs;
        } else {
          console.log("错误 无歌手 id");
        }
      },
      immediate: true
    }
  },
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
<style scoped></style>
