<template>
  <div class="login-box">
    <div class="login-wrap">
      <div class="lg">
        <div class="phone-login-wrap" v-show="loginModel == 1">
          <div class="login-title">用户登入</div>
          <div class="login-form">
            <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules">
              <el-form-item prop="phone">
                <el-input
                  type="text"
                  v-model="loginForm.phone"
                  placeholder="请输入登入手机号"
                  size="large"
                  style="height: 48px; line-height: 48px"
                >
                  <i slot="prefix" class="iconfont icon-yonghu"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="loginForm.password"
                  show-password
                  placeholder="请输入登入密码"
                  size="large"
                  style="height: 48px; line-height: 48px"
                >
                  <i slot="prefix" class="iconfont icon-shuyi_guansuo"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleSubmit('loginForm')"
                  style="margin-top: 8px; width: 100%"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="item-list">
            <a href="/#">注册用户</a>
            <a>忘记密码</a>
            <a>登入遇到问题</a>
            <router-link to="/">主页</router-link>
          </div>
        </div>

        <div class="qr-login-wrap" v-show="loginModel == 2">
          <div class="qr_guide-wrap">
            <img src="@/assets/img/qr_guide.png" alt="" />
          </div>
          <div class="qr-wrap">
            <div class="t">扫码登入</div>
            <div class="qr-img">
              <img :src="qr.base64" alt="" />
              <div class="qr-isExpire" v-if="qr.isExpire">
                <div>
                  <span> 二维码已经失效 </span>
                  <br />
                  <a href="#" @click.prevent="checkQRLogin">点击刷新</a>
                </div>
              </div>
            </div>
            <div class="b">
              使用<a href="https://music.163.com/#/download">网易云音乐APP</a
              >扫码登入
            </div>
          </div>
          <div class="update-btn">
            <a href="#" @click.prevent="checkPhoneLogin">选择其他登入方式</a>
          </div>
        </div>

        <img
          src="@/assets/img/qr-login.png"
          alt="二维码登入"
          class="qr-login"
          v-show="loginModel == 1"
          @click="checkQRLogin"
        />
      </div>

      <!-- <button @click="a">登入状态</button>
        <div>{{fromPath}}</div> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { systemApi, userApi } from "@/api";
export default {
  name: "Login",
  components: {},
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写登入手机号"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("您输入的手机号格式错误"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写登入密码"));
      } else if (value.length < 8) {
        callback(new Error("密码长度不能小于8位"));
      } else {
        callback();
      }
    };
    return {
      loginModel: 1, //登入模式 1手机号 2二维码
      loginForm: {
        phone: "13142211138",
        password: "",
        captcha: ""
      },
      loginFormRules: {
        phone: [{ validator: validatePhone, required: true, trigger: "blur" }],
        password: [
          { validator: validatePassword, required: true, trigger: "blur" }
        ]
      },
      qr: {
        unikey: "",
        base64: "", //二维码base64
        isExpire: true
      },
      fromPath: "" //从哪个路由跳转过来
    };
  },
  props: {},
  computed: {},
  watch: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {});
  },
  methods: {
    ...mapMutations("UserModule", ["updateUserInfo", "updateUserState"]),
    //切换方式为二维码登入
    async checkQRLogin() {
      const r = await this.initQR();
      if (r) {
        this.loginModel = 2;
        this.qr.isExpire = false;
        //每隔2秒监听一次二维码 轮询是否被扫描
        this.checkQR(2000);
      } else {
        console.log("二维码初始化错误");
      }
    },
    //切换方式为手机号码登入
    async checkPhoneLogin() {
      if (this.QRTimer) {
        clearInterval(this.QRTimer);
      }
      this.loginModel = 1;
    },
    //监听二维码是否被扫描
    checkQR(t) {
      console.log("等待用户扫码！");
      this.QRTimer = setInterval(() => {
        systemApi.checkQRState(this.qr.unikey).then(async (res) => {
          console.log(res);
          //二维码被扫了 授权中  一直不授权的话 超时也会过期
          // if(res.code == 802){
          //     //可以拿到avatarUrl和nickname
          //     console.log(res.avatarUrl);
          //     console.log(res.nickname);
          //     return;
          // }
          // 确定授权 登入成功
          if (res.code == 803) {
            //可以拿登入后的cookie
            console.log(res.cookie);
            const r = await userApi.getUserAccountInfo(res.cookie);
            this.updateUserInfo({ profile: r.profile });
            this.updateUserState({
              userState: {
                isLogin: true,
                cookie: res.cookie
              }
            });
            this.$router.push("/");
            return;
          }
          //过一定时间没扫 或者 扫过了 二维码就会过期 code返回800
          if (res.code == 800) {
            this.qr.isExpire = true;
            clearInterval(this.QRTimer);
            return;
          }
        });
      }, t);
    },
    //获取二维码
    async initQR() {
      return new Promise((resolve, reject) => {
        //获得二维码key
        systemApi
          .getQRKey()
          .then((res) => {
            this.qr.unikey = res.data.unikey;
            return systemApi.createQR(res.data.unikey);
          })
          .then((res) => {
            //五分钟过期
            this.qr.base64 = res.data.qrimg;
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          systemApi
            .login(this.loginForm)
            .then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.updateUserInfo({ profile: res.profile });
                this.updateUserState({
                  userState: {
                    isLogin: true,
                    cookie: res.cookie
                  }
                });
                this.$router.push("/");
              } else {
                console.log(res.code);
                this.$message({
                  message: "密码错误！",
                  type: "error"
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                message: "账号不存在！",
                type: "error"
              });
            });
          // this.$router.replace('/');
        } else {
          this.$message({
            message: "请输入正确格式的账号与密码！",
            type: "error"
          });
        }
      });
    },

    a() {
      systemApi.getLoginStatus().then((res) => {
        console.log("登入状态:", res);
      });
    }
  },
  beforeCreated() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {
    if (this.QRTimer) {
      clearInterval(this.QRTimer);
    }
  },
  destroyed() {},
  //被keep-alive缓存的组件激活时调用
  activated() {},
  deactivated() {}
};
</script>
<style lang="scss" scoped>
.login-wrap {
  width: 980px;
  height: 700px;
  margin: 0 auto;
  background-color: white;
  box-sizing: border-box;
  padding: 60px;
  .lg {
    width: 360px;
    margin: 0 auto;
    border-radius: 10px;
    background-color: rgba($color: #000000, $alpha: 0.1);
    padding: 30px;
    position: relative;
    .phone-login-wrap {
      .login-title {
        height: 45px;
        line-height: 45px;
        color: rgb(111, 104, 223);
        text-align: center;
        padding: 15px;
        font-size: 30px;
        font-weight: 800;
        box-sizing: content-box;
      }
      .item-list {
        padding: 10px 0;
      }
      .item-list a {
        color: #3c8dbc;
        font-size: 14px;
        text-decoration: none;
        font-weight: 800;
        letter-spacing: 1px;
        margin-right: 8px;
      }
    }
    .qr-login-wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .qr_guide-wrap {
        img {
          width: 125px;
          height: 220px;
        }
      }
      .qr-wrap {
        .t {
          font-size: 18px;
          text-align: center;
        }
        .b {
          font-size: 14px;
          text-align: center;
          a {
            color: #0c73c2;
          }
        }
        .qr-img {
          text-align: center;
          position: relative;
          img {
            width: 160px;
            height: 160px;
            margin: 8px 0;
          }
          .qr-isExpire {
            position: absolute;
            background-color: rgba(229, 229, 229, 0.9);
            color: #333;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-weight: 600;
            a {
              display: inline-block;
              width: 64px;
              height: 24px;
              line-height: 24px;
              margin-top: 6px;
              text-align: center;
              border-radius: 6px;
              background-color: rgb(121, 210, 121);
              color: rgb(245, 245, 245);
            }
          }
        }
      }
      .update-btn {
        width: 100%;
        height: 32px;
        line-height: 32px;
        margin-top: 10px;
        text-align: center;
        a {
          display: inline-block;
          width: 118px;
          height: 28px;
          line-height: 28px;
          border: 1px solid #979797;
          border-radius: 15px;
        }
      }
    }

    .qr-login {
      position: absolute;
      top: 0;
      right: 0;
      width: 60px;
      height: 60px;
      border-top-right-radius: 10px;
      cursor: pointer;
    }
  }
}
</style>
