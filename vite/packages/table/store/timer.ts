import {defineStore} from "pinia";
//时间状态，用于此状态内不存储，用于剥离计时器
declare interface appDate{
  year:string,
  month:string,
  day:string,
  hours:string,
  minutes:string,
}
export const timerStore = defineStore(
  "timerStore",
  {
    state: () => {
      return {
        //闹钟时钟
        appDate:{
        } as appDate,
        //锁屏延迟，默认改为半小时
        lockTimeout: 1800,
      }
    }
  });
