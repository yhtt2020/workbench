import {defineStore} from "pinia";
export const countDownStore = defineStore(
  "countDownStore",
  {
    state: () => {
      return {
        countDowndate: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        countDowntime: {},
        timer: null,
        countDownBtn: false,
        // 进度条
        progress:0,
        progressTimer:null,
        // 保存倒计时的时间
        selectValue:[]
      }

    },

    actions: {
      setCountDown(value) {
        this.hours = value.hours;
        this.minutes = value.minutes;
        this.seconds = value.seconds;
        this.selectValue=[this.hours,this.minutes,this.seconds]
        this.countDowndate = this.hours * 3600000 + this.minutes * 60000 + this.seconds * 1000
        this.regularTime();
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(this.regularTime, 1000)
        this.countDownBtn = false
        // 进度条
        this.progressTimer && clearInterval(this.progressTimer)
        this.startProgressDown()
      },
      stopCountDown() {
        clearInterval(this.timer);
        this.countDownBtn = true
        clearInterval(this.progressTimer)
      },
      regularTime() {
        if (this.countDowndate < 0) {
          this.dCountDown()
          return;
        }
        let h = parseInt(this.countDowndate / 1000 / 60 / 60 % 24)
        let m = parseInt(this.countDowndate / 1000 / 60 % 60)
        let s = parseInt(this.countDowndate / 1000 % 60)

        if (h < 10) {
          this.countDowntime.hours = '0' + String(h)
        } else {
          this.countDowntime.hours = h
        }
        if (m < 10) {
          this.countDowntime.minutes = "0" + String(m);
        } else {
          this.countDowntime.minutes = m;
        }
        if (s < 10) {
          this.countDowntime.seconds = "0" + String(s);
        } else {
          this.countDowntime.seconds = s;
        }
        this.countDowndate -= 1000;
      },
      openCountDown() {

        this.timer && clearInterval(this.timer);
        this.timer = setInterval(this.regularTime, 1000);
        this.countDownBtn = false;
        this.progressTimer && clearInterval(this.progressTimer)
        this.startProgressDown()
      },
      dCountDown() {
        this.timer && clearInterval(this.timer);
        this.progress=0
        this.countDowndate=0
        this.progressTimer && clearInterval(this.progressTimer)
        this.countDowntime = {};
        // this.countDowndate=-1000
        
      },
      startProgressDown() {
        if(this.countDowndate<0){
          this.dCountDown()
          return
        }
        this.regularTime()
        let remainingTime=this.countDowndate
        let interval=remainingTime/100
        this.progressTimer=setInterval(()=>{
          if(this.progress<=100){
            this.progress+=1
            // console.log(this.progress);
            
          }else{
            this.progress=0
            clearInterval(this.progressTimer)
            // this.countDowntime={}
            // this.dCountDown()
          }
        },interval)
      }
    },
  },

  {}
);

