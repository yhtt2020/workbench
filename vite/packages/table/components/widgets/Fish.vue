<template>
  <Widget :options="options"  :customIndex="customIndex">
    <div style="display: flex;flex-direction: column">
      <div style="flex:1;margin-right: 20px;margin-left: 20px">
        <div ref="fish" @click="click" class="fish"
             style="display: flex;align-items: center;align-content: center;height: 205px;width: 100%;justify-content: center;position: relative;cursor: pointer;">
          <img ref="wooden" class="wooden" :src="fish" style="width: 120px;height:120px;margin-top: -30px">
          <img ref="bing" class="bing " :src="bing"
               style="width: 80px;height: 80px;position: absolute;margin-top: -20px">
          <span class="tip" style="color: var(--primary-text);"> 功德 +1</span>
          <div style="position: absolute;bottom:35px">
            <div style="color: var(--primary-text);"><span class="mr-4">今日 {{ getToday }}</span> 总 {{ getTotal }}</div>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audio" src='/sound/fish.mp3'/>
  </Widget>
</template>

<script>
import Widget from '../card/Widget.vue'
import fish from '../../assets/img/fish/muyu.svg'
import bing from '../../assets/img/fish/bing.svg'
import { fishStore } from '../../store/fish'
import { mapWritableState } from 'pinia'

export default {
  name: 'Fish',
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      clicking: false,
      options: {
        className: 'card small',
        title: '',
        icon: '',
        type: 'fish',
        noTitle: true,
      },
      fish: fish,
      bing: bing,
    }
  },
  computed: {
    ...mapWritableState(fishStore, ['days', 'total']),
    getToday () {
      let now = new Date()
      if(!this.days[now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay()]){
        return 0
      }
      return this.days[now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay()]
    },
    getTotal(){
      let total=0
      Object.keys(this.days).forEach(key=>{
        total+=this.days[key]
      })
      return total
    }
  },
  components: {
    Widget
  },
  methods: {
    addToday () {
      let now = new Date()
      if(!this.days[now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay()])
      {
        this.days[now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay()]=0
      }
      this.days[now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay()]++
    },

    click () {
      if (this.clicking) {
        return
      }
      this.$refs.fish.classList.add('click')
      this.$refs.audio.play()
      this.addToday()
      this.$refs.bing.classList.add('bing-click')
      this.clicking = true
      setTimeout(()=>{
        this.$refs.bing.classList.remove('bing-click')
      },100)
      setTimeout(() => {
        this.clicking = false
        this.$refs.fish.classList.remove('click')
      }, 200)
    },
  },
}
</script>

<style scoped lang="scss">
.bing {
  left: 50px;
  top: 20px;
  rotate: -20deg;
  transition: rotate 0.05s;
}

.fish {
  .wooden {
    transition: scale 0.2s;
  }

  &:hover ,  &.active {
    .bing {
      rotate: -60deg
    }
  }
}

.tip {
  position: absolute;
  right: 10px;
  opacity: 0;
}

.click {
  .tip {
    animation: mymove 0.3s;

  }

  .wooden {
    scale: 1.13
  }


}
.bing-click {
  rotate: -20deg !important;
}
@keyframes mymove {
  from {
    top: 60px;
    opacity: 100;
  }
  to {
    top: 15px;
    opacity: 0;
  }
}

</style>
