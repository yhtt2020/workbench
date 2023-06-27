export default {
  // 添加数据到localStorage，并添加时间戳
  set: function (key, value, timeout = undefined) {
    const item = {
      value,
      times: timeout !== undefined ? new Date().getTime() + timeout : undefined,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  // 判断数据是否已超时
  isExpired: function (key) {
    const item = JSON.parse(localStorage.getItem(key));
    if (item && item.times !== undefined && item.times < new Date().getTime()) {
      return true; // 数据已超时
    }
    return false; // 获取缓存数据
  },
  get: function (key) {
    const item = JSON.parse(localStorage.getItem(key));
    if (item && !this.isExpired(key)) {
      return item.value; // 返回缓存数据的值
    }
    return null; // 缓存不存在或已超时
  },
  // 删除缓存数据
  del: function (key) {
    localStorage.removeItem(key);
  },
};
