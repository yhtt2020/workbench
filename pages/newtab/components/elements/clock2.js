const clock2Tpl =
  `
  <div class="clock2">
  <link rel="stylesheet" href="./assets/elements/clocks/clock2.css"/>
    <p class="date">{{ date }}</p>
    <p class="time">{{ time }}</p>
    </div>
  `

Vue.component('clock2', {
  template: clock2Tpl,
  name: 'clock2',
  data () {
    return {
      time: '',
      date: '',
      timerID:0,
      week :['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    }
  },
  mounted () {
    this.timerID = setInterval(this.updateTime, 1000)
    this.updateTime()

  },
  methods: {
    zeroPadding (num, digit) {
      let zero = ''
      for (let i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    },
    updateTime () {
      let cd = new Date()
      this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2)
      this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth() + 1, 2) + '-' + this.zeroPadding(cd.getDate(), 2) + ' ' + this.week[cd.getDay()]
    }
  },
  destroyed () {
    // 销毁定时器
    clearInterval(this.timerID)
  }

})

