import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 应用插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 设置默认时区为中国时间（东八区）
dayjs.tz.setDefault("Asia/Shanghai");

// console.log('dayjs :>> ', dayjs());
// const day = dayjs(); // 获取当前中国时间
// console.log(day.format('YYYY-MM-DD HH:mm:ss')); // 格式化输出中国时间
export default dayjs;
