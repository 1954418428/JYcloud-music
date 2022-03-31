<template>
  <div>
    <div
      class="topbar-box"
      :style="isFixed ? 'position:fixed;width: 100%;' : ''"
    >
      <div class="topbar-wrap">
        <h1>
          <router-link to="/" class="web-link">
            <img class="web-logo" src="@/assets/img/web-logo.jpeg" alt="" />
            简易云音乐
          </router-link>
        </h1>

        <ul class="menu-warp">
          <li>
            <router-link
              :to="'/'"
              active-class="menu-router-link-active"
              :class="
                ['playlist', 'topplaylist', 'search'].indexOf($route.name) != -1
                  ? 'menu-router-link-active'
                  : ''
              "
              exact
            >
              <em>发现音乐</em>
              <i class="iconfont icon-shangsanjiaoxing"></i>
            </router-link>
          </li>
          <li>
            <router-link
              :to="'/mymusic'"
              active-class="menu-router-link-active"
            >
              <em>我的音乐</em>
              <i class="iconfont icon-shangsanjiaoxing"></i>
            </router-link>
          </li>
          <li>
            <router-link
              :to="'/discoverplaylist'"
              active-class="menu-router-link-active"
            >
              <em>歌单</em>
              <i class="iconfont icon-shangsanjiaoxing"></i>
            </router-link>
          </li>
          <li>
            <router-link
              :to="'/discoversinger'"
              active-class="menu-router-link-active"
              :class="
                $route.fullPath.indexOf('singer') != -1
                  ? 'menu-router-link-active'
                  : ''
              "
            >
              <em>歌手</em>
              <i class="iconfont icon-shangsanjiaoxing"></i>
            </router-link>
          </li>
          <li>
            <router-link
              :to="'/discovermv'"
              active-class="menu-router-link-active"
              :class="
                ['mv'].indexOf($route.name) != -1
                  ? 'menu-router-link-active'
                  : ''
              "
            >
              <em>MV</em>
              <i class="iconfont icon-shangsanjiaoxing"></i>
            </router-link>
          </li>
        </ul>

        <div style="margin: 19px 30px 0 30px">
          <SearchBox></SearchBox>
        </div>

        <div class="user-wrap">
          <div
            @mouseover="userToolsIsShow = true"
            @mouseleave="userToolsIsShow = false"
            v-if="userState.isLogin"
          >
            <router-link :to="`/user/home?id=${userInfo.userId}`">
              <img
                :src="userInfo.avatarUrl + '?param=40y40'"
                alt=""
                class="head-img"
              />
            </router-link>
            <ul class="user-tools" v-show="userToolsIsShow">
              <li>
                <router-link :to="`/user/home?id=${userInfo.userId}`">
                  <i class="iconfont icon-yonghu"></i>
                  <em>我的主页</em>
                </router-link>
              </li>
              <li>
                <a href="#">
                  <i class="iconfont icon-shezhi"></i>
                  <em>个人设置</em>
                </a>
              </li>
              <li>
                <a @click.prevent="logoutClicked">
                  <i class="iconfont icon-tuichu"></i>
                  <em>退出</em>
                </a>
              </li>
            </ul>
          </div>

          <div v-else>
            <router-link
              to="/login"
              style="
                line-height: 70px;
                color: rgb(245, 245, 245);
                font-size: 14px;
              "
              >登入</router-link
            >
          </div>
        </div>
      </div>

      <div class="hr-wrap"></div>
    </div>
    <div v-show="isFixed" style="height: 75px"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import SearchBox from "./SearchBox";

export default {
  name: "",
  components: { SearchBox },
  data() {
    return {
      isFixed: false,
      userToolsIsShow: false
    };
  },
  props: {},
  computed: mapState("UserModule", ["userInfo", "userState"]),
  watch: {
    $route: function () {
      // console.log(this.$route.path);
      // console.log(this.$route.fullPath);
      if (
        this.$route.fullPath.indexOf("/mymusic") != -1 ||
        this.$route.path == "/songplaying"
      ) {
        // console.log("isFixed变为true");
        this.isFixed = true;
      } else {
        if (this.isFixed) {
          // console.log("isFixed变为false");
          this.isFixed = false;
        }
      }
    }
  },
  methods: {
    ...mapActions("UserModule", ["logout"]),
    async logoutClicked() {
      //退出时 先删除推荐歌单 然后那会监听到退出登入 发请求获取新的未登入的推荐歌单
      sessionStorage.removeItem("true:PersonalizedPlayList");
      sessionStorage.removeItem("false:PersonalizedPlayList");

      const r = await this.logout();
      // console.log(r);
      this.$router.push("/");
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
.menu-router-link-active {
  background: #000;
  color: #fff;
  i {
    display: block !important;
  }
}

.topbar-box {
  position: relative;
  z-index: 500;
  box-sizing: border-box;
  background-color: #242424;
  min-width: 980px;
  .topbar-wrap {
    height: 70px;
    width: 1100px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    .web-link {
      color: white;
      display: inline-block;
      line-height: 70px;
      margin-right: 20px;
      .web-logo {
        width: 50px;
        height: 50px;
        vertical-align: middle;
        border-radius: 10px;
      }
    }
    .menu-warp {
      color: #cccccc;
      display: flex;
      a {
        position: relative;
        min-width: 60px;
        line-height: 70px;
        padding-left: 20px;
        padding-right: 20px;
        text-align: center;
        display: block;
        &:hover {
          @extend .menu-router-link-active;
        }
        i {
          line-height: 12px;
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          display: none;
          color: #c20c0c;
        }
      }
    }

    .user-wrap {
      position: relative;
      margin: 0 50px;
      .head-img {
        width: 40px;
        height: 40px;
        border-radius: 40px;
        margin-top: 15px;
      }
      .user-tools {
        position: absolute;
        left: -59px;
        width: 158px;
        background: #2b2b2b;
        border: 1px solid #202020;
        box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        color: #ccc;
        cursor: pointer;
        li {
          height: 34px;
          line-height: 34px;
          a {
            padding-left: 24px;
            display: block;
            i {
              margin-right: 6px;
            }
          }

          &:hover {
            color: white;
            background-color: rgb(53, 53, 53);
          }
        }
      }
    }
  }
}
.hr-wrap {
  height: 5px;
  background-color: #fff;
  background-color: #c20c0c;
}
</style>
