<script lang="ts">
import {defineComponent} from 'vue'
import {mapWritableState} from "pinia";
import {timerStore} from "../../store/timer";
import {paperStore} from "../../store/paper";

const defaultLockTime = 1800
export default defineComponent({
  name: "PaperLock",
  data() {
    return {
      lockTimer: null,
      showLockTip: false,
      lockTimeout: 0,
    }
  },
  computed: {
    ...mapWritableState(timerStore, ['lockTimeout']),
    ...mapWritableState(paperStore, ['settings']),
    lockTimeoutDisplay() {
      function secToTime(s) {
        var t = '';
        if (s > -1) {
          var hour = Math.floor(s / 3600);
          var min = Math.floor(s / 60) % 60;
          var sec = s % 60;
          if (hour === 0) {
            t = '';
          } else if (hour < 10) {
            t = '0' + hour + '小时';
          } else {
            t = hour + '小时';
          }

          if (min < 10) {
            t += '0';
          }
          t += min + '分';
          if (sec < 10) {
            t += '0';
          }
          t += sec.toFixed(0) + '秒';
        }
        return t;
      }

      return secToTime(this.lockTimeout);
    },
  },
  mounted() {
    window.onblur = () => {
      this.setLockTimer();
    };
    window.onfocus = () => {
      this.clearLockTimer();
    };
  },
  methods: {
    goPaperSettings(){
      this.$router.push({
        name:'papersSetting'
      })
    },
    clearLockTimer() {
      console.log('清理掉锁屏倒计时')
     setTimeout(()=>{
       if (this.lockTimer) {
         clearInterval(this.lockTimer);
         this.lockTimer = null;
         this.lockTimeout = this.settings.lockTimeout;
         this.showLockTip = false;
       }
     },1000)
    },
    setLockTimer() {
      console.log('准备锁屏倒计时')
      this.lockTimeout = (this.settings.lockTimeout || defaultLockTime) - 1;
      if (this.settings.enable) {
        //只有启用了锁屏才会触发这个效果
        if(this.settings.tipLock){
          this.showLockTip = true;
        }
        this.lockTimer = setInterval(() => {
          this.lockTimeout--;
          if (this.lockTimeout === 0) {
            this.clearLockTimer();
            this.$router.push('/lock');
          }
        }, 1000);
      }
    },
  }
})
</script>

<template>
  <!--  锁屏倒计时提示功能-->
  <span
    class="xt-text-2 pointer no-drag" @click="goPaperSettings"
    v-if="settings.tipLock && this.showLockTip"
  >
        {{ lockTimeoutDisplay }}后锁屏
      </span>
</template>

<style scoped lang="scss">

</style>
