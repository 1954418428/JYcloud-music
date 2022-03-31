import request from "@/utils/request";

//用户api

export default {
  //获取账号信息
  getUserAccountInfo: function (cookie) {
    return new Promise((resolve, reject) => {
      request
        .get("/user/account", {
          cookie
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  //获取用户详情
  getUserDetail: function (uid) {
    return new Promise((resolve, reject) => {
      request
        .get("/user/detail", {
          uid: uid
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //更新用户信息
  updateUserInfo: function (obj) {
    return new Promise((resolve, reject) => {
      /*
                gender,//性别
                signature,//用户签名
                city,//城市id
                nickname,//昵称
                birthday,//出生日期时间戳
                province,//省份id
            */
      request
        .get("/user/detail", {
          ...obj
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //获取收藏的歌手列表 需要登入
  getCollectSingerList: function () {
    return new Promise((resolve, reject) => {
      request
        .get("/artist/sublist")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //获取每日推荐歌曲列表 需要登入
  getDailySongs: function () {
    return new Promise((resolve, reject) => {
      request
        .get("/recommend/songs")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //获取收藏的mv列表  需要登入
  getCollectMvList: function () {
    return new Promise((resolve, reject) => {
      request
        .get("/mv/sublist")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //获取用户信息，歌单，收藏，mv，dj数量
  getUserSubcount: function () {
    return new Promise((resolve, reject) => {
      request
        .get("/user/subcount", {
          timestamp: new Date().getTime()
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //获取用户听歌排行记录
  getUserRecord(uid, type = 1) {
    return new Promise((resolve, reject) => {
      request
        .get("/user/record", {
          uid,
          type,
          timestamp: new Date().getTime()
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};
