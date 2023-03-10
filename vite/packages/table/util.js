const path = require("path");
export function getLogo(logo, local_dir, fileProtocol = true) {
  if (logo === "local") {
    return (fileProtocol ? "file://" : "") + path.join(local_dir, "logo.png");
  } else {
    return logo;
  }
}

export function getBgColorFromEntry(entry) {
  let color = "black";
  if (entry) {
    color = entry.bgColor;
  }
  return color;
}
export function timeStamp(time) {
  let date = new Date(time);
  let dateTime = {};
  let weeks = [
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日",
  ];
  dateTime.year = date.getFullYear();
  dateTime.month = date.getMonth() + 1;
  dateTime.day = date.getDate();
  dateTime.hours = date.getHours();

  let minutes = date.getMinutes();

  let seconds = date.getSeconds();

  if (minutes < 10) {
    dateTime.minutes = "0" + String(minutes);
  } else {
    dateTime.minutes = minutes;
  }
  if (seconds < 10) {
    dateTime.seconds = "0" + String(seconds);
  } else {
    dateTime.seconds = seconds;
  }
  dateTime.week = weeks[date.getDay() - 1];
  return dateTime;
}
export function getDateTime(date = new Date()) {
  let dateTime = {};
  let weeks = [
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日",
  ];
  dateTime.year = date.getFullYear();
  dateTime.month = date.getMonth() + 1;
  dateTime.day = date.getDate();
  dateTime.hours = date.getHours();

  let minutes = date.getMinutes();

  let seconds = date.getSeconds();

  if (minutes < 10) {
    dateTime.minutes = "0" + String(minutes);
  } else {
    dateTime.minutes = minutes;
  }
  if (seconds < 10) {
    dateTime.seconds = "0" + String(seconds);
  } else {
    dateTime.seconds = seconds;
  }
  dateTime.week = weeks[date.getDay() - 1];
  return dateTime;
}
export function transDate(s, e) {
  let start = new Date(s).getTime();
  let end = new Date(e).getTime();
  var result = Math.abs(end - start);
  var minute = result / 1000 / 60;
  if (minute == 0 || isNaN(minute) || minute == null) {
    return 0;
  }
  return Math.floor(result / (24 * 3600 * 1000));
}

export const myStore = {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  /**
   * 读入一个app的数据
   * @param $app
   */ loadAppData($app, defaultValue) {
    let saved = localStorage.getItem("appData." + $app);
    if (saved) {
      let data = JSON.parse(saved);
      return data;
    } else {
      return defaultValue;
    }
  },
  /**
   * 读入全部的设置
   */
  loadSettings(defaultValue) {
    let saved = localStorage.getItem("settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("应用设置载入错误，自动使用默认值");
      }
    }
    return defaultValue;
  },
};
