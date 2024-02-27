import { message } from "ant-design-vue";
import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
import { useEnv } from "../useEnv";
import { getUserInfo } from "../api/login";

/**
 * 获取用户信息
 */
const setUserInfo = async () => {
  // 先判断用户信息是否存在，不存在进行赋值
  const userStore: any = appStore();
  if (userStore.userInfo) return true;
  let res = await getUserInfo();
  console.log("res getUserInfo :>> ", res);
  setLV(res.data);

  let userData = res.data.data;
  // 获取头像框信息
  let response = await userStore.getUserCard(userData.uid);
  // userData.frame = response.data.frame;
  userStore.userInfo = userData;
  return true;
};
/**
 * 用户许可
 */
export const useUserPermit = async () => {
  // 1.1 判断是否存在新版的token
  let token = cache.get("ttUserToken");
  // 1.2 判断是否存在tabapi的token
  if (!token && !useEnv()) {
    let res = await window.tsbApi.user.get();
    token = res.data.token;
  }

  // 2 有token
  if (token) {
    let res = await setUserInfo();
    // 清除游客缓存
    cache.set("isGuest", false);
    return res;
  } else {
    // 4 没token
    cache.set("isGuest", true);
    return false;
  }
  // 放行
  return true;
};

/**
 * 功能不详 复制来的
 */
const gradeTableGenerate = (num) => {
  let lvSys = {};
  for (let i = 0; i < num + 1; i++) {
    let arrLef = 0;
    let arrRg = 0;
    for (let j = 0; j < i; j++) {
      arrLef += 10 * (j + 2);
    }
    for (let k = 0; k < i + 1; k++) {
      arrRg += 10 * (k + 2);
    }
    arrRg -= 1;
    lvSys[`${i}`] = [arrLef, arrRg];
  }
  delete lvSys["lv0"];
  return lvSys;
};

/**
 * 功能不详 复制来的
 */
const setLV = (args) => {
  if (args.data.uid === -2) {
    message.error({
      content: "网络错误，请重试",
      key: "net",
    });
  }
  if (args.data.uid <= 0) {
    return;
  }

  const userInfo = args.data;
  const userStore: any = appStore();
  let lvInfo = userStore.lvInfo;
  lvInfo.lv = userInfo.onlineGradeExtra.lv;
  let current = gradeTableGenerate(64)[lvInfo.lv];
  let section = gradeTableGenerate(64)[lvInfo.lv + 1];
  let remain = section[0] * 60 - userInfo.onlineGradeExtra.minutes;
  lvInfo.remainHour = Math.floor(remain / 60);
  lvInfo.remainMinute = remain - Math.floor(remain / 60) * 60;
  lvInfo.minute = userInfo.onlineGradeExtra.minutes;
  lvInfo.percentage =
    ((lvInfo.minute - current[0] * 60) / ((current[1] - current[0]) * 60)) *
    100;
  userStore.setUser(userInfo);
};
