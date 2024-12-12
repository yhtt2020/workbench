import { appStore } from "../../store";

/**
 *
 * 功能不详 复制来的
 * 以下所有注释均由ai编写 不保证正确
 */
const gradeTableGenerate = (num) => {
  // 初始化一个空对象，用于存储等级系统信息
  let lvSys = {};

  // 遍历从0到num（包含num）的每一个整数，代表不同的等级
  for (let i = 0; i < num + 1; i++) {
    // 初始化两个变量，用于计算等级左边界和右边界
    let arrLef = 0; // 等级左边界，初始值为0
    let arrRg = 0; // 等级右边界，初始值为0

    // 计算等级左边界的值
    // 循环从0到i-1的每一个整数，每次累加10乘以(j+2)的值
    for (let j = 0; j < i; j++) {
      arrLef += 10 * (j + 2);
    }

    // 计算等级右边界的值
    // 循环从0到i的每一个整数，每次累加10乘以(k+2)的值
    for (let k = 0; k < i + 1; k++) {
      arrRg += 10 * (k + 2);
    }

    // 减去1，可能是为了调整右边界的值，使其更符合实际规则
    arrRg -= 1;

    // 将计算得到的左边界和右边界值存储到lvSys对象中，以等级i作为键
    lvSys[`${i}`] = [arrLef, arrRg];
  }

  // 从lvSys对象中删除键为"lv0"的项，可能是不需要等级0或者它有特殊的含义
  delete lvSys["lv0"];
  //提升等级上限
  //lvSys[65]=[lvSys[64][0]+1,9999999999]

  // 返回构建好的等级系统对象
  return lvSys;
};

export const setLV = (userInfo) => {
  const maxLevel=100
  if (!userInfo) {
    return false;
  }


  // 调用appStore函数获取用户存储对象，并将其类型设置为any
  const userStore: any = appStore();

  // 获取用户的等级信息
  let lvInfo = userStore.lvInfo;

  // 设置用户的等级
  lvInfo.lv = userInfo.onlineGradeExtra.lv;

  // 调用gradeTableGenerate函数生成等级表格，并提取当前等级的数据
  let current = gradeTableGenerate(maxLevel)[lvInfo.lv];

  // 提取下一个等级的数据
  let section = gradeTableGenerate(maxLevel)[lvInfo.lv + 1];

  // 计算用户达到下一个等级还需要的分钟数
  let remain = section[0] * 60 - userInfo.onlineGradeExtra.minutes;

  // 计算还需要多少小时
  lvInfo.remainHour = Math.floor(remain / 60);

  // 计算还需要多少分钟（不足一小时的部分）
  lvInfo.remainMinute = remain - Math.floor(remain / 60) * 60;

  // 设置用户的在线时长
  lvInfo.minute = userInfo.onlineGradeExtra.minutes;

  // 计算用户在当前等级的进度百分比
  lvInfo.percentage =
    ((lvInfo.minute - current[0] * 60) / ((current[1] - current[0]) * 60)) *
    100;

  // 更新或设置用户的整体信息
  userStore.setUser(userInfo);
  console.log('走到了这里 :>> ', );

  return true;
};
