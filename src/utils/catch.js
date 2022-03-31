export default class CatchStorage {
  constructor(prefix = "catch") {
    this.prefix = prefix + "_";
  }

  // 设置缓存数据
  // expires 单位分钟 默认5分钟
  setCatchItem(key, value, expires = 5) {
    const expiresMillisecond = expires * 60 * 1000;
    let data = {
      key,
      value,
      startTime: new Date().getTime(),
      expires: expiresMillisecond
    };
    localStorage.setItem(this.prefix + key, JSON.stringify(data));
  }

  // 获取缓存数据
  getCatchItem(key) {
    const data = JSON.parse(localStorage.getItem(this.prefix + key));
    if (data) {
      const nowTimeStamp = new Date().getTime();
      if (nowTimeStamp - data.startTime > data.expires) {
        //过期 移除缓存 返回null
        this.removeCatchItem(key);
        return null;
      } else {
        //未过期 返回数据
        return data.value;
      }
    } else {
      //取不到key对应的数据 直接返回null
      return null;
    }
  }

  // 移除缓存数据
  removeCatchItem(key) {
    localStorage.removeItem(this.prefix + key);
  }

  // 移除所有缓存数据
  clearCatch() {
    const localStorageData = JSON.parse(JSON.stringify(localStorage));
    // console.log(localStorageData);
    for (let key in localStorageData) {
      if (key.startsWith(this.prefix)) {
        // console.log("删除",key);
        localStorage.removeItem(key);
      }
    }
  }
}
