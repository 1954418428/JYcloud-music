<template>
  <div class="top-song-sheet-item-box">
    <div class="top-wrap">
      <router-link
        :to="{ path: '/topplaylist', query: { id: topPlayList.id } }"
      >
        <img
          :src="topPlayList.coverImgUrl"
          :alt="topPlayList.name"
          class="top-img"
        />
      </router-link>

      <div>
        <router-link
          :to="{ path: '/topplaylist', query: { id: topPlayList.id } }"
          >{{ topPlayList.name }}</router-link
        >
        <br />
        <span>{{ topPlayList.updateFrequency }}</span>
        <br />

        <router-link
          :to="{ path: '/topplaylist', query: { id: topPlayList.id } }"
        >
          <i
            class="iconfont icon-bofang"
            style="position: relative; top: 10px"
          ></i>
        </router-link>
      </div>
    </div>
    <ul>
      <li v-for="(item, index) in songs" :key="item.id">
        <span :style="index < 3 ? 'color:#c10d0c' : ''">{{ index + 1 }}</span>
        <a href="javascript:void(0)">{{ item.name }}</a>

        <span class="tools">
          <a href="javascript:void(0)" @click.prevent="bofangClicked(index)">
            <i class="iconfont icon-bofang"></i>
          </a>
          <a href="javascript:void(0)" @click.prevent="shoucangClicked(index)">
            <i class="iconfont icon-shoucang"></i>
          </a>
        </span>
      </li>
      <li>
        <router-link
          :to="{ path: '/topplaylist', query: { id: topPlayList.id } }"
        >
          查看全部
          <i class="iconfont icon-xiangyoujiantou"></i>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { sheetApi } from "@/api";

export default {
  name: "",
  components: {},
  data() {
    return {
      toolsIsShow: false,
      songs: []
    };
  },
  props: {
    topPlayList: {
      type: Object,
      required: true
    }
  },
  computed: {},
  watch: {},
  methods: {
    ...mapActions("PlayerModule", [
      "cutSongSheet",
      "asyncUpdateIsLock",
      "addNextSong",
      "asyncUpdateIsLock"
    ]),
    ...mapActions("CollectModule", ["collectClicked"]),
    bofangClicked(index) {
      const song = this.songs[index];
      // console.log(song);
      this.cutSongSheet({
        songs: this.songs,
        currentIndex: index
      });
      this.asyncUpdateIsLock({
        isLock: true
      });
    },
    shoucangClicked(index) {
      const song = this.songs[index];
      const id = song.id;
      this.collectClicked({ tracks: [id] });
    }
  },
  beforeCreated() {},
  async created() {
    const songs = JSON.parse(
      sessionStorage.getItem(`topplayId:${this.topPlayList.id}`)
    );
    if (songs && songs.length != 0) {
      this.songs = songs;
    } else {
      const query = {
        id: this.topPlayList.id,
        limit: 10,
        offset: 0
      };
      const res = await sheetApi.getPlayListTrackAll(query);
      // console.log(res);
      this.songs = res.songs;
      sessionStorage.setItem(
        `topplayId:${this.topPlayList.id}`,
        JSON.stringify(this.songs)
      );
    }
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
.top-song-sheet-item-box {
  width: 240px;
  .top-wrap {
    padding: 20px;
    .top-img {
      width: 120px;
      height: 120px;
      vertical-align: middle;
      margin-right: 6px;
    }
    div {
      display: inline-block;
      position: relative;
      top: 16px;
      a {
        color: #666;
        font-size: 24px;
        font-weight: 700;
        display: inline-block;
        margin-bottom: 6px;
        &:hover {
          color: #333;
        }
      }
      i {
        font-size: 20px;
        cursor: pointer;
        &:hover {
          color: rgb(236, 65, 65);
        }
      }
    }
  }

  ul {
    li {
      position: relative;
      padding-left: 24px;
      height: 32px;
      line-height: 32px;
      span {
        width: 32px;
        height: 32px;
        font-size: 16px;
        margin-right: 3px;
        text-align: center;
        display: inline-block;
      }
      a {
        &:hover {
          color: rgb(236, 65, 65);
        }
      }
      .tools {
        a {
          margin-right: 10px;
        }
        position: absolute;
        right: 36px;
        display: none;
      }
      &:hover {
        .tools {
          display: inline-block;
        }
      }
    }

    & li:last-of-type {
      text-align: right;
      padding-right: 16px;
      a {
        font-size: 16px;
        color: #666;
        &:hover {
          color: #333;
        }
      }
    }
  }
}
</style>
