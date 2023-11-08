/**
 * @description 用于操作localStorage
 */
 export default {
  /**
   * @description 将数据保存到localStorage中
   * @param {string} key - 数据的键名
   * @param {any} value - 数据的值
   * @param {any} timeout - 数据的过期时间，默认为undefined，表示永不过期
   */
  set: function (key: string, value: any, timeout: any = undefined) {
    let item: any = {
      value,
      time: timeout,
    };
    // 设为today 限制缓存为当天
    if (timeout === "today") {
      const endTime = new Date();
      endTime.setHours(23, 59, 59, 999);
      item.time = endTime.getTime();
    } else {
      item.time = timeout ? new Date().getTime() + timeout : undefined;
    }
    // 将数据保存到localStorage中
    localStorage.setItem(key, JSON.stringify(item));
  },
  /**
   * @description 判断指定键名的数据是否过期
   * @param {string} key - 数据的键名
   * @returns {boolean} 如果数据不存在或已过期，返回false；否则返回true
   */
  isExpired: function (key: string) {
    const item = JSON.parse(localStorage.getItem(key)!);
    if (item && item.time !== undefined && item.time < new Date().getTime()) {
      return false; // 数据不存在或已过期
    }
    return true; // 数据存在且未过期
  },
  /**
   * @description 从localStorage中获取指定键名的数据
   * @param {string} key - 数据的键名
   * @param {any} error - 如果数据不存在或已过期，返回的错误信息，默认为null
   * @returns {any} 如果数据存在且未过期，返回数据；否则返回error
   */
  get: function (key: string, error: any = null) {
    const item = JSON.parse(localStorage.getItem(key)!);
    if (item && this.isExpired(key)) {
      return item.value; // 返回数据
    }
    return error; // 缓存不存在或已超时
  },
  /**
   * @description 从localStorage中删除指定键名的数据
   * @param {string} key - 数据的键名
   */
  del: function (key: string) {
    localStorage.removeItem(key);
  },
};
