import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 应用插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 设置默认时区为中国时间（东八区）
dayjs.tz.setDefault("Asia/Shanghai");

export default dayjs;
