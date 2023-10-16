<template>

  <div class="s-bg rounded-lg xt-text" style="height: 100%">
    <div class="back-btn" @click="goBack" >
      <Icon icon="xiangzuo"  style="font-size: 2em;"></Icon>
    </div>
    <a-row style="margin-left:5em ">
      <a-col :span="8">
        <a-progress style="margin-top: 8em;" type="circle" :percent="rate" strokeColor="#666" :strokeWidth="15"
                    :width="250">
          <template #format="percent">
            <span style="font-size: 1em">{{ status }}</span>
          </template>
        </a-progress>
      </a-col>
      <a-col style="font-size: 3em;text-align: center;padding-top: 1em" :soan="16">
        <div>番茄钟</div>
        <div style="font-size: 2.8em;font-weight: bold">
          {{ displayNum(hours) }}:{{ displayNum(minutes) }}:{{ displayNum(seconds) }}
        </div>
        <div style="">

          <Icon v-for="i in tomato" style="margin-right:10px;vertical-align: middle;font-size: 1.5em" icon="fanqie"></Icon>
          <Icon v-for="i in target-tomato" style="margin-right:10px;vertical-align: middle;opacity: 0.3;font-size: 1em"
                icon="fanqie"></Icon>
        </div>
        <div style="margin-top: 1em">
          <a-row :gutter="30" v-if="running" >
            <a-col  @click="pause" :span="12">
              <div class="btn sm" v-if="timer">
                <Icon style="font-size: 2em;vertical-align: middle" icon="zanting"></Icon>
                <span style="font-size: 0.7em">
                暂停
              </span>
              </div>
              <div class="btn sm" v-else>
                <Icon style="font-size: 2em;vertical-align: middle" icon="bofang"></Icon>
                <span style="font-size: 0.7em">
                <span>
                  继续
                </span>
              </span>
              </div>
            </a-col>
            <a-col  @click="stop" :span="12"  >
              <div class="btn sm">
                <Icon style="font-size: 2em;vertical-align: middle" icon="tingzhi"></Icon>
                <span style="font-size: 0.7em">放弃
              </span>
              </div>

            </a-col>
          </a-row>
          <a-row @click="start" v-else>
            <a-col  :span="24">
              <div class="btn sm">
                <Icon style="font-size: 2em;vertical-align: middle" icon="bofang"></Icon>
                <span style="font-size: 0.7em">
              <span>
                  开始
                </span>
              </span>
              </div>

            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>

  </div>

</template>

<script>
import { Modal } from 'ant-design-vue'

export default {
  name: 'Tomato',
  data () {
    return {
      tomato: 0,
      target: 5,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timer: null,
      rate: 0,
      totalTime: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      tick: 1000,
      running: false,
    }
  },
  mounted () {
    this.start()
  },
  computed: {
    rate () {
      let rate = this.getRate()
      return rate
    },
    status(){
      if(this.running){
        if(!this.timer){
          return '暂停'
        }else{
          return this.getRate()
        }
      }else{

      }
    }
  },
  beforeRouteLeave(to,from,next){
    let isPaused=false
    if(this.running) {
      if (!this.timer) {
        isPaused = true
      } else {
        this.pause()
      }
      Modal.confirm({
        centered: true,
        content: '当前番茄钟正在进行中，退出将损失这个番茄，确定退出？',
        okText: '强行退出',
        onOk: () => {
          this.stop()
          next()
        },
        onCancel: () => {
          if (!isPaused) {
            this.pause()
          }
        }
      })
    }
  },
  methods: {
    goBack(){
        this.$router.go(-1)

    },
    displayNum (num) {
      if (num < 10) {
        return '0' + num
      } else {
        return num
      }
    },
    reset (hours = 0, minutes = 0, seconds = 0) {
      this.totalTime = {
        hours,
        minutes,
        seconds
      }
      this.hours = this.totalTime.hours
      this.minutes = this.totalTime.minutes
      this.seconds = this.totalTime.seconds
    },
    start () {
      this.reset(0, 25, 0)
      this.timer = setInterval(this.interval, this.tick)
      this.running = true
    },
    stop () {
      this.running = false
      this.clearInterval()
      this.reset(0, 0, 0)

    },
    clearInterval () {
      clearInterval(this.timer)
      this.timer = null
    },
    getRate () {
      return Number(((1 - (this.seconds + this.minutes * 60 + this.hours * 60 * 60) / (this.totalTime.seconds + this.totalTime.minutes * 60 + this.totalTime.hours * 60 * 60)) * 100).toFixed())
    },
    pause () {
      if (this.timer === null) {
        this.timer = setInterval(this.interval, this.tick)
      } else {
        this.clearInterval()
      }
    },
    finish () {
      this.running=false
      this.clearInterval()
      this.reset()
      Modal.success({
        width: '50vw',
        content: '已成功完成一个番茄，点击收下。',
        okText: '收下',
        centered: true,
        onOk: () => {
          this.tomato++
        },
        cancelText:null
      })
    },
    interval () {
      if (!this.running) return
      if (this.seconds <= 0) {
        if (this.minutes === 0) {
          if (this.hours === 0) {
            this.finish()
          } else {
            this.hours--
            this.minutes = 59
          }
        } else {
          this.minutes--
        }
        if(!this.running){
          this.seconds=0
          return
        }
        this.seconds = 59
      } else {
        this.seconds--
      }
    }
  }
}
</script>

<style scoped>

</style>
