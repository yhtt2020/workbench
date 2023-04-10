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
        countDownBtn: false
      }

    },

    actions: {
      setCountDown(value) {
        this.hours = value.hours;
        this.minutes = value.minutes;
        this.seconds = value.seconds;
        this.countDowndate = this.hours * 3600000 + this.minutes * 60000 + this.seconds * 1000
        this.regularTime();
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(this.regularTime, 1000)
        this.countDownBtn = false
      },
      stopCountDown() {
        clearInterval(this.timer);
        this.countDownBtn = true
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
      },
      dCountDown() {
        this.timer && clearInterval(this.timer);
        this.countDowntime = {};
      }
    },
  },

  {}
);

