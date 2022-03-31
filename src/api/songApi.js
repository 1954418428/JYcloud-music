import request from "@/utils/request";

//音乐api

export default {
  //获取音乐url
  getSongUrl: function (id) {
    return new Promise((resolve, reject) => {
      request
        .get("/song/url", {
          id
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //获取音乐歌词
  getLyric: function (id) {
    return new Promise((resolve, reject) => {
      request
        .get("/lyric", {
          id
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //查看音乐是否可用 返回 { success: true, message: 'ok' } 或者 { success: false, message: '亲爱的,暂无版权' }
  checkMusic: function (id) {
    return new Promise((resolve, reject) => {
      request
        .get("/check/music", {
          id
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //获取歌曲详情
  getSongDetail: function (ids) {
    //逗号分隔id 可用获得多首歌详情
    return new Promise((resolve, reject) => {
      request
        .get("/song/detail", {
          ids
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //喜欢或取消音乐喜欢 这歌会被加入"我喜欢的音乐" 并返回playlistId 我喜欢的音乐 歌单的id
  likeSong: function (id, like) {
    //like true表喜欢 false表不喜欢
    return new Promise((resolve, reject) => {
      request
        .get("/like", {
          id,
          like
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //喜欢的音乐列表
  getLikeList: function (uid) {
    //uid 用户id
    return new Promise((resolve, reject) => {
      request
        .get("/likelist", {
          uid
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //获取歌曲评论  有热评 有最新评论
  getSongCommentList: function (data) {
    // id 音乐id
    // limit 数量
    // offset 偏移量
    data.timeStamp = new Date().getTime();
    return new Promise((resolve, reject) => {
      request
        .get("/comment/music", {
          ...data
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // 每日推荐歌曲列表
  // 要携带用户登入的cookie
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
  }
};
