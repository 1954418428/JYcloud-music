<template>
  <!-- 收藏歌单 -->
  <div class="collect-sheet-box" v-show="collectBox.isShow">
    <div class="collect-sheet-wrap">
      <div class="title">
        添加到歌单
        <i
          class="iconfont icon-guanbi"
          title="关闭"
          @click="asyncUpdateCollectBoxIsShow({ isShow: false })"
        ></i>
      </div>
      <div
        class="create-sheet"
        @click="asyncupdateCreateBoxIsShow({ isShow: true })"
      >
        <i class="iconfont icon-tianjia"></i>
        新建歌单
      </div>
      <ul class="sheet-list">
        <li
          @click="addSong(item.id)"
          v-for="(item, index) in userCreatedPlaylist"
          :key="item.id + '-' + index"
        >
          <div>
            <img :src="item.coverImgUrl" alt="" class="s-img" />
            <span class="s-name">{{ item.name }}</span>
            <span class="s-count">{{ item.trackCount }} 首</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { sheetApi } from "@/api";
export default {
  name: "",
  components: {},
  data() {
    return {
      userCreatedPlaylist: [] //用户创建的歌单列表
    };
  },
  props: {},
  computed: {
    ...mapState("CollectModule", ["collectBox", "collect"]),
    ...mapState("UserModule", ["userInfo"]),
    ...mapState("CreateSheetModule", ["create"])
  },
  watch: {
    "userInfo.userId": {
      handler() {
        const { userId } = this.userInfo;
        // console.log("当前登入用户的id",userId);
        if (userId) {
          this.initUserPlayList();
        } else {
          this.userCreatedPlaylist = [];
        }
      },
      immediate: true
    },
    "create.isOver"() {
      if (this.create.isOver && this.create.model == 1) {
        //本次操作是新建歌单
        console.log(this.create.model, this.create.playlist);
        this.create.playlist.trackCount = 0;
        this.userCreatedPlaylist.splice(1, 0, this.create.playlist);
      }
    },
    "collectBox.isShow": {
      handler() {
        if (this.collectBox.isShow) {
          sheetApi.getUserPlayList(this.userInfo.userId).then((res) => {
            const CreatedPlaylist = [];
            console.log("请求了");
            res.playlist.forEach((item) => {
              if (!item.subscribed) {
                CreatedPlaylist.push(item);
              }
            });
            this.userCreatedPlaylist = CreatedPlaylist;
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions("CollectModule", ["asyncUpdateCollectBoxIsShow"]),
    ...mapActions("CreateSheetModule", ["asyncupdateCreateBoxIsShow"]),
    initUserPlayList() {},
    addSong(pid) {
      const tracks = this.collect.tracks;
      let queryTracks = "";
      //逗号拼接id
      tracks.forEach((item) => {
        queryTracks += item + ",";
      });
      //去掉最后一个逗号
      queryTracks = queryTracks.substring(0, queryTracks.lastIndexOf(","));
      // console.log(queryTracks);
      sheetApi
        .addOrDeleteSong({
          op: "add",
          pid: pid,
          tracks: queryTracks
        })
        .then((res) => {
          console.log(res);
          if (res.body.code == 200) {
            this.$message({
              message: `已成功收藏到歌单`,
              type: "success",
              duration: 1500
            });
            this.asyncUpdateCollectBoxIsShow({ isShow: false });
            //修改对应歌单的歌数量
            for (let i = 0; i < this.userCreatedPlaylist.length; i++) {
              if (pid == this.userCreatedPlaylist[i].id) {
                this.userCreatedPlaylist[i].trackCount += tracks.length;
                break;
              }
            }
            //删除缓存
            this.catchStorage.removeCatchItem(`playlistDetail:${pid}`);
            this.catchStorage.removeCatchItem(`playlistSongs:${pid}`);
          } else {
            this.$message({
              message: res.body.message,
              type: "error",
              duration: 1500
            });
          }
        });
    }
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
.collect-sheet-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 503;

  .collect-sheet-wrap {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    height: 414px;
    background-color: rgb(255, 255, 255);
    box-sizing: border-box;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.8);
    .title {
      height: 38px;
      line-height: 38px;
      padding: 0 18px;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      background: #2d2d2d;
      i {
        float: right;
        cursor: pointer;
      }
    }
    .create-sheet {
      padding: 10px;
      height: 36px;
      line-height: 36px;
      font-size: 18px;
      font-weight: 600;
      background-color: rgb(230, 230, 230);
      cursor: pointer;
      i {
        font-size: 20px;
        position: relative;

        margin-left: 10px;
      }
    }
    .sheet-list {
      height: 320px;
      overflow-y: auto;
      li {
        height: 42px;
        line-height: 42px;
        padding: 6px 18px;
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
        div {
          .s-img {
            width: 40px;
            height: 40px;
            margin-right: 6px;
            vertical-align: middle;
            float: left;
          }
          .s-name {
            float: left;
          }
          .s-count {
            float: right;
            margin-right: 16px;
          }

          &::after {
            display: block;
            content: "";
            clear: both;
          }
        }
        &:hover {
          cursor: pointer;
          background-color: rgb(242, 242, 242);
        }
      }
    }
  }
}
</style>
