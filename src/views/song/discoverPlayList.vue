<template>
  <div class="discoverplaylist-box">
    <div class="discoverplaylist-wrap">
      <div class="head">
        <h3>
          {{ page.cat }}
          <a
            href="javascript:void(0)"
            class="choose"
            ref="choose"
            @click="categorysIsShow = !categorysIsShow"
          >
            选择分类
            <i class="iconfont icon-xiangxiajiantou"></i>
          </a>
        </h3>

        <div class="categorys" v-show="categorysIsShow" ref="categorys">
          <!-- <i class="xiangshangjiantou"></i> -->
          <div class="all">
            <router-link :to="`/discoverplaylist?cat=全部`">
              全部风格
            </router-link>
          </div>
          <div class="c-list">
            <div
              class="categorys-wrap"
              v-for="item in playListCatlist"
              :key="item.id"
            >
              <div class="category-item">
                <i :class="item.iconClass"></i>
                <span>
                  {{ item.name }}
                </span>
              </div>
              <ul class="tags-wrap">
                <li v-for="sub in item.subs" :key="sub.name" class="tag-item">
                  <router-link
                    :to="`/discoverplaylist?cat=${sub.name}`"
                    :class="page.cat == sub.name ? 'active' : ''"
                    >{{ sub.name }}</router-link
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ul class="hot-playlist-wrap">
          <li v-for="item in hotPlayList" :key="item.id">
            <router-link
              :to="`/discoverplaylist?cat=${item.name}`"
              :class="page.cat == item.name ? 'active' : ''"
            >
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <div v-if="playList.length" class="sheet-list-wrap">
        <ul class="sheet-list">
          <li v-for="item in playList" :key="item.id">
            <SongSheetItem :songSheetItem="item"></SongSheetItem>
          </li>
        </ul>
        <p v-show="isLoading">正在加载新数据！</p>
        <p v-if="!more">我们是有底线的！</p>
      </div>

      <div v-else style="font-size: 24px; font-weight: 700">
        正在努力加载数据！
      </div>
    </div>
  </div>
</template>

<script>
import SongSheetItem from "../../components/song/SongSheetItem";

import closeTargetEle from "../../utils/closeTargetEle";
import { sheetApi } from "@/api";

export default {
  name: "",
  components: { SongSheetItem },
  data() {
    return {
      categorysIsShow: false,
      scrollBottom: 0,
      isLoading: false, //是否 加载新数据
      more: true, //是否 有下一页数据
      currentIndex: 1, //当前页数
      page: {
        cat: "全部",
        order: "hot",
        limit: 20, //数量 最大100
        offset: 0 //偏移量  （页数-1）*数量
      },
      hotPlayList: [], //热门分类
      playListCatlist: [], //全部分类
      playList: [] //歌单
    };
  },
  props: {},
  computed: {},
  watch: {
    isLoading: async function () {
      if (this.isLoading) {
        this.currentIndex += 1;
        this.page.offset = (this.currentIndex - 1) * this.page.limit;
        const res = await sheetApi.getTopPlayList(this.page);
        this.more = res.more;
        this.playList = this.playList.concat(res.playlists);
        this.isLoading = false;
      }
    },
    "$route.query": {
      async handler() {
        if (Object.keys(this.$route.query).length != 0) {
          console.log("进来了");
          this.page.cat = this.$route.query.cat;
          this.page.offset = 0;
          this.currentIndex = 1;
        }

        const res = await sheetApi.getTopPlayList(this.page);
        this.playList = res.playlists;
        this.categorysIsShow = false;
      },
      // 深度观察监听
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 监听滚动条
    scrollHandler() {
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      //变量windowHeight是可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //变量scrollHeight是滚动条的总高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      // console.log(scrollTop,windowHeight,scrollHeight);
      //滚动条距离底部的距离
      let scrollBottom = scrollHeight - scrollTop - windowHeight;
      // console.log(scrollBottom);
      this.scrollBottom = scrollBottom;
      if (this.scrollBottom < 300 && this.more) {
        this.isLoading = true;
      }
    },
    NonTargetIsClicked(e) {
      if (this.categorysIsShow) {
        const target = e.target;
        const showTargetEle = this.$refs.categorys;
        const triggerTargetEle = this.$refs.choose;
        const flag = closeTargetEle(target, showTargetEle, triggerTargetEle);
        if (!flag) {
          this.categorysIsShow = false;
        }
      }
    },
    async initHotPlayList() {
      if (sessionStorage.getItem("hotPlayList")) {
        const hotPlayList = JSON.parse(sessionStorage.getItem("hotPlayList"));
        this.hotPlayList = hotPlayList;
      } else {
        // 获取热门歌单分类
        sheetApi.getHotPlayList().then((res) => {
          this.hotPlayList = res.tags;
          sessionStorage.setItem(
            "hotPlayList",
            JSON.stringify(this.hotPlayList)
          );
        });
      }
    },
    async initPlayListCatlist() {
      if (sessionStorage.getItem("playListCatlist")) {
        const playListCatlist = JSON.parse(
          sessionStorage.getItem("playListCatlist")
        );
        this.playListCatlist = playListCatlist;
      } else {
        sheetApi.getPlayListCatlist().then((res) => {
          const categorys = res.categories;
          const sub = res.sub;
          for (let key in categorys) {
            const obj = {};
            const k = parseInt(key);
            obj.id = k;
            obj.name = categorys[key];

            switch (parseInt(key)) {
              case 0:
                obj.iconClass = "iconfont icon-duoyuyan";
                break;
              case 1:
                obj.iconClass = "iconfont icon-gangqin";
                break;
              case 2:
                obj.iconClass = "iconfont icon-kafei";
                break;
              case 3:
                obj.iconClass = "iconfont icon-xiaolian";
                break;
              case 4:
                obj.iconClass = "iconfont icon-yinle1";
                break;
            }
            obj.subs = sub.filter((item) => {
              return item.category == key;
            });
            this.playListCatlist.push(obj);
          }
          sessionStorage.setItem(
            "playListCatlist",
            JSON.stringify(this.playListCatlist)
          );
        });
      }
    }
  },
  beforeCreated() {},
  async created() {
    document.addEventListener("click", this.NonTargetIsClicked);
    window.addEventListener("scroll", this.scrollHandler);

    this.initHotPlayList();
    this.initPlayListCatlist();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {
    // console.log("NonTargetIsClicked解除");
    document.removeEventListener("click", this.NonTargetIsClicked);
    window.removeEventListener("scroll", this.scrollHandler);
  },
  destroyed() {},
  //被keep-alive缓存的组件激活时调用
  activated() {},
  deactivated() {}
};
</script>
<style lang="scss" scoped>
.discoverplaylist-wrap {
  width: 900px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgb(255, 255, 255);
  .head {
    position: relative;
    height: 42px;
    line-height: 42px;
    border-bottom: 2px solid rgb(194, 12, 12);
    h3 {
      float: left;
      font-size: 24px;
      font-weight: 700;
      a {
        position: relative;
        top: -5px;
        display: inline-block;
        font-size: 14px;
        width: 84px;
        height: 32px;
        line-height: 32px;
        color: rgb(12, 115, 194);
        background-color: rgb(254, 254, 254);
        border: 1px solid rgba($color: #000000, $alpha: 0.2);
        border-radius: 5px;
        text-align: center;
      }
      i {
        font-size: 12px;
      }
    }
    .hot-playlist-wrap {
      float: right;
      display: flex;
      a {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        margin: 0 6px;
        color: #666;
        &:hover {
          color: #333;
        }
      }
    }
  }

  .sheet-list {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    li {
      margin-left: 20px;
    }
  }
  p {
    font-size: 24px;
    font-weight: 700;
    text-align: center;
  }
}

.categorys {
  .xiangshangjiantou {
    position: absolute;
    top: -13px;
    left: 130px;
    display: inline-block;
    width: 0;
    height: 0;
    border-bottom: 12px solid #999;
    border-right: 12px solid transparent;
    border-left: 12px solid transparent;
  }
  position: absolute;
  top: 48px;
  width: 720px;
  background-color: white;
  border: 1px solid rgba($color: #000000, $alpha: 0.2);
  border-radius: 6px;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.2);
  z-index: 5;
  a {
    display: inline-block;
    text-align: center;
  }
  .all {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
    a {
      width: 76px;
      height: 24px;
      margin-left: 24px;
      padding: 3px;
      line-height: 24px;
      border: 1px solid rgba($color: #000000, $alpha: 0.2);
      border-radius: 6px;
    }
  }
  .c-list {
    .categorys-wrap {
      display: flex;
      height: 68px;
      align-content: center;
      .category-item {
        flex-grow: 1;
        padding: 8px;
        text-align: center;
        font-weight: 600;
        border-right: 1px solid rgba($color: #000000, $alpha: 0.2);
      }

      .tags-wrap {
        height: 60px;
        width: 624px;
        display: flex;
        flex-wrap: wrap;
        line-height: 60px;
        align-content: center;
        li {
          height: 30px;
          line-height: 30px;
          margin-left: 6px;
          margin-right: 12px;
          box-sizing: border-box;
          a {
            color: #666;
            min-width: 36px;
            height: 24px;
            // line-height: 24px;
            &:hover {
              color: #000;
            }
          }
        }
      }
    }
  }
}

.active {
  color: rgb(194, 12, 12) !important;
}
</style>
