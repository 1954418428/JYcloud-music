<template>
  <div class="floor-box" v-if="isShow">
    <div class="floor-wrap">
      <div class="left">
        <p class="web-service-item">
          <a
            href="//st.music.163.com/official-terms/service"
            target="_blank"
            class=""
            >服务条款</a
          ><span class="line">|</span>
          <a
            href="//st.music.163.com/official-terms/privacy"
            target="_blank"
            class=""
            >隐私政策</a
          ><span class="line">|</span>
          <a
            href="//st.music.163.com/official-terms/children"
            target="_blank"
            class=""
            >儿童隐私政策</a
          ><span class="line">|</span>
          <a
            href="//music.163.com/st/staticdeal/complaints.html"
            target="_blank"
            class=""
            >版权投诉指引</a
          ><span class="line">|</span>
          <a
            id="g_feedback"
            href="#"
            class=""
            onclick="nm.x.feedback();return false;"
            hidefocus="true"
            >意见反馈</a
          ><span class="line">|</span>
          <a href="https://music.163.com/ui/resource" class="">广告合作</a>
        </p>
        <p>
          <span class="">网易公司版权所有©1997-2022</span
          ><span class="span">杭州乐读科技有限公司运营：</span>
          <a
            class=""
            href="https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/8282703158/452a/ca0c/3a10/caad83bc8ffaa850a9dc1613d74824fc.png"
            target="_blank"
            >浙网文[2021] 1186-054号</a
          >
        </p>
        <p>
          <span class="">违法和不良信息举报电话：0571-89853516</span>
          <span class="">举报邮箱：</span
          ><a class="alink" href="mailto:ncm5990@163.com">ncm5990@163.com</a>
        </p>
        <p>
          <a
            href="https://beian.miit.gov.cn/#/Integrated/index"
            rel="noopener noreferrer"
            target="_blank"
            class=""
            >粤B2-20090191-18&nbsp;&nbsp;工业和信息化部备案管理系统网站</a
          >
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902002564"
            rel="noopener noreferrer"
            target="_blank"
            class=""
          >
            <span class=""></span>
            <span class="">浙公网安备 33010902002564号</span>
          </a>
        </p>
      </div>

      <ul class="right">
        <div class="author-wrap">
          <a
            href="https://github.com/1954418428/jycloud-music"
            target="_blank"
            class="img-a"
            title="项目github地址"
          >
            <img src="../../assets/img/github.png" alt="" />
          </a>

          <p>作者：fzy</p>
          <p>微信：madmanfzy</p>
          <!-- <p>QQ：1954418428</p> -->
        </div>
        <div class="img-wrap">
          <img
            class="img-item"
            src="@/assets/img/wx-erweima.jpg"
            title="扫码加作者微信"
            alt="微信：madmanfzy"
          />
          <!-- <img
            class="img-item"
            src="@/assets/img/qq-erweima.png"
            title="扫码加作者qq"
            alt="QQ：1954418428"
          /> -->
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Floor",
  components: {},
  data() {
    return {
      isShow: true
    };
  },
  props: {},
  computed: {},
  watch: {
    $route: function () {
      if (
        this.$route.fullPath.indexOf("/mymusic") != -1 ||
        this.$route.path == "/songplaying"
      ) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
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
<style lang="scss" scoped>
.floor-box {
  height: 170px;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgb(211, 211, 211);
  box-sizing: border-box;
  background: rgb(242, 242, 242);
  min-width: 980px;
  .floor-wrap {
    width: 980px;
    margin: 0 auto;
    display: flex;
    padding: 20px;
    .left {
      width: 520px;
      .web-service-item {
        color: #999999;
        .line {
          margin-left: 10px;
          margin-right: 8px;
        }
      }
      p {
        height: 24px;
        margin-bottom: 3px;
        &:not(.web-service-item) {
          color: #666666;

          line-height: 24px;
          & :first-child {
            margin-right: 14px;
          }
        }
      }
    }
    .right {
      display: flex;
      .author-wrap {
        width: 160px;
        p {
          color: #333333;
          margin-bottom: 1px;
        }
        .img-a {
          display: inline-block;
          // text-align: center;
          img {
            height: 48px;
            width: 48px;
          }
        }
      }
      .img-wrap {
        .img-item {
          width: 100px;
          height: 100px;
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
