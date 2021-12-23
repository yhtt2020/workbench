const clock1Tpl=
  `
   <div class="clock">
     <link rel="stylesheet" href="./assets/elements/clocks/clock1.css"/>
        <div class="flip">
            <div class="digital front" :data-number="nextTimes[0]"></div>
            <div class="digital back" :data-number="nowTimes[0]"></div>
        </div>
        <div class="flip">
            <div class="digital front" :data-number="nextTimes[1]"></div>
            <div class="digital back" :data-number="nowTimes[1]"></div>
        </div>
        <em class="divider">:</em>
        <div class="flip">
            <div class="digital front" :data-number="nextTimes[2]"></div>
            <div class="digital back" :data-number="nowTimes[2]"></div>
        </div>
        <div class="flip">
            <div class="digital front" :data-number="nextTimes[3]"></div>
            <div class="digital back" :data-number="nowTimes[3]"></div>
        </div>
        <em class="divider">:</em>
        <div class="flip">
            <div class="digital front" :data-number="nextTimes[4]"></div>
            <div class="digital back" :data-number="nowTimes[4]"></div>
        </div>
        <div class="flip">
            <div class="digital front" :data-number="nextTimes[5]"></div>
            <div class="digital back" :data-number="nowTimes[5]"></div>
        </div>
    </div>


  `
Vue.component('clock1', {
  template:clock1Tpl,
  name: "ClockData",
  data () {
    return {
      duration: 650,
      nowTimes: [],
      nextTimes: [],
      timer: {},
    }
  },
  mounted() {
    this.initDate();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000)
  },
  methods: {
    initDate() {
      let now = new Date();
      this.nowTimes = this.getTimeFromDate(new Date(now.getTime() - 1000));
      this.nextTimes = this.getTimeFromDate(now);
    },
    updateTime() {
      let now = new Date();
      let nowTimes = this.getTimeFromDate(new Date(now.getTime() - 1000));
      let nextTimes = this.getTimeFromDate(now);;
      for (let i = 0; i < 6; i++) {
        if (nowTimes[i] !== nextTimes[i]) {
          this.setSpin(i, nowTimes[i], nextTimes[i]);
        }
      }
    },
    setSpin(index, nowTime, nextTime) {
      let nodes = document.querySelectorAll(".flip");
      nodes[index].classList.add('running');
      this.nowTimes.splice(index, 1, nowTime);
      this.nextTimes.splice(index, 1, nextTime);
      setTimeout(() => {
        nodes[index].classList.remove('running');
        this.nowTimes.splice(index, 1, nextTime);
      }, this.duration)
    },
    getTimeFromDate(date) {
      let numTime = [];
      let timeStr = date
        .toTimeString()
        .slice(0, 8)
        .split(":")
        .join("");
      for (let i = 0; i < timeStr.length; i++) {
        numTime.push(parseInt(timeStr[i]));
      }
      return numTime;
    }
  },
  destroyed() {
    // 销毁定时器
    clearInterval(this.timer);
  }
})
