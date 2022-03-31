<template>
  <div class="songplaying-box">
    <div class="songplaying-wrap">
      <div class="left-wrap">
        <div class="PlayingSheet-wrap">
          <PlayingSheet></PlayingSheet>
        </div>
      </div>

      <div class="right-wrap">
        <div class="Lyric-wrap">
          <Lyric></Lyric>
        </div>
        <div class="MusicPlayerTools-wrap">
          <MusicPlayerTools></MusicPlayerTools>
        </div>
      </div>

      <div class="music-comment">
        <div class="comment-head">
          <h3>评论</h3>
          <span> 共{{ page.total }}条评论 </span>
        </div>
        <div class="reply-wrap">
          <Replay @emitAddComment="addComment"></Replay>
        </div>

        <div v-show="hotComments.length">
          <h4>热门评论</h4>
          <ul>
            <li v-for="item in hotComments" :key="item.commentId">
              <Comment :comment="item"></Comment>
            </li>
          </ul>
        </div>

        <div v-show="comments.length">
          <h4>最新100条评论</h4>
          <ul>
            <li v-for="item in comments" :key="item.commentId">
              <Comment :comment="item"></Comment>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MusicPlayerTools from "../../components/system/MusicPlayerTools";
import PlayingSheet from "../../components/system/PlayingSheet";
import Lyric from "../../components/song/Lyric";

import Replay from "../../components/system/Replay";
import Comment from "../../components/system/Comment";

import { mapState, mapMutations } from "vuex";
import { songApi } from "@/api";
export default {
  name: "",
  components: { PlayingSheet, MusicPlayerTools, Lyric, Replay, Comment },
  data() {
    return {
      page: {
        currentIndex: 1, //当前评论是第几页
        limit: 100, //数量
        offset: 0, //偏移量
        total: 0 //评论总数
      },
      hotComments: [], //热评
      comments: [] //新评论
    };
  },
  props: {},
  computed: {
    ...mapState("PlayerModule", ["audio"])
  },
  watch: {
    "$route.query.id": {
      handler() {
        this.initCommentQueryData({
          t: 1,
          type: 0,
          id: this.$route.query.id
        });

        this.hotComments = [];
        this.comments = [];
        songApi
          .getSongCommentList({
            id: this.$route.query.id,
            limit: 100,
            offset: 0
          })
          .then((res) => {
            // console.log(res);
            //评论总数
            this.page.total = res.total;
            //热评
            this.hotComments = res.hotComments;
            //新评
            this.comments = res.comments;
          });
      },
      immediate: true
    },
    "audio.id": {
      handler() {
        this.$router.push(`/songplaying?id=${this.audio.id}`);
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations("CommentModule", ["initCommentQueryData"]),
    addComment(comment) {
      console.log("comment", comment);
      this.page.total += 1;
      this.comments.unshift(comment);
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
.songplaying-wrap {
  width: 1160px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;
  .left-wrap {
    height: 588px;
    width: 400px;
    border-radius: 50px;
    .PlayingSheet-wrap {
      /deep/ .bofang-list {
        background-color: rgba(46, 46, 46, 0.9);

        padding: 10px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        .list-h {
        }
        ul {
          height: 548px;
          .icon-bofang {
            margin-left: 2px;
          }
        }
      }
    }
  }
  .right-wrap {
    height: 608px;
    width: 760px;
    color: white;
    .Lyric-wrap {
      height: 500px;
      background-color: rgba(66, 66, 66, 0.3);
      border-top-right-radius: 20px;
      /deep/ .lyric-ul {
        height: 400px;
      }
    }
    .MusicPlayerTools-wrap {
      background-color: rgba(66, 66, 66, 0.9);
      border-bottom-right-radius: 20px;
      /deep/ .top {
        padding: 6px;
        height: 36px;
        line-height: 36px;
      }
      /deep/ .music-slider {
        height: 26px;
        line-height: 26px;
        .slider {
          position: relative;
          top: -6px;
        }
        .music-time {
          width: 10%;
          margin-left: 16px;
        }
      }
      /deep/ .m-t {
        justify-content: center;
        // padding: 10px 0;
        i {
          margin: 0 20px;
        }
      }
    }
  }

  .music-comment {
    width: 100%;
    margin-top: 20px;
    .comment-head {
      height: 32px;
      line-height: 32px;
      border-bottom: 2px solid #c20c0c;
      h3 {
        float: left;
        font-size: 20px;
        margin-right: 16px;
      }
      span {
        float: left;
      }
    }
    h4 {
      padding: 4px;
      font-size: 14px;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
    }
  }
}
</style>
