export default {
  // 添加数据到localStorage，并添加时间戳
  set: function (key, value, timeout = undefined) {
    if (timeout && timeout === "today") {
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const item = {
        value,
        times: endOfToday.getTime(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } else {
      const item = {
        value,
        times:
          timeout !== undefined ? new Date().getTime() + timeout : undefined,
      };
      localStorage.setItem(key, JSON.stringify(item));
    }
  },
  // 判断数据是否已超时
  isExpired: function (key) {
    const item = JSON.parse(localStorage.getItem(key)!);
    if (item && item.times !== undefined && item.times < new Date().getTime()) {
      return true; // 数据已超时
    }
    return false; // 获取缓存数据
  },
  get: function (key, error: any = null) {
    const item = JSON.parse(localStorage.getItem(key)!);
    if (item && !this.isExpired(key)) {
      return item.value; // 返回缓存数据的值
    }
    return error; // 缓存不存在或已超时
  },
  // 删除缓存数据
  del: function (key) {
    localStorage.removeItem(key);
  },
};
