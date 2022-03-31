<template>
  <div class="lyric-wrap" v-if="clyric.isShow">
    <div class="tool-s">
      <i
        class="iconfont icon-suoxiao"
        title="缩小"
        @click="updateClyricShow"
      ></i>
    </div>

    <Lyric></Lyric>
  </div>
</template>

<script>
import Lyric from "../song/Lyric";

import { mapState, mapMutations } from "vuex";

export default {
  name: "",
  components: { Lyric },
  data() {
    return {
      playing: false
    };
  },
  props: {},
  computed: mapState("PlayerModule", ["clyric", "audio", "player"]),
  watch: {},
  methods: {
    ...mapMutations("PlayerModule", ["updateClyricShow"])
  },
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
.lyric-wrap {
  position: fixed;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 740px;
  height: 540px;
  border-radius: 10px;
  background-color: rgba(250, 250, 250, 0.95);
  z-index: 502;

  .tool-s {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    i {
      cursor: pointer;
      font-size: 28px;
      &:hover {
        color: #333;
      }
    }
  }
}
</style>
