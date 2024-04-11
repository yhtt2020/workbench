<template>
  <xt-container
    v-model:customSize="customData.customSize"
    :options="options"
    :customIndex="customIndex"
    :desk="desk"
    @titleHover="openTaobao"
    :header="header"
    :custom-data="customData">
    <div style="display: flex;flex-direction: column" class="-mt-6">
      <div style="flex:1;margin-right: 20px;margin-left: 20px">
        <div ref="fish" @click="click" class="fish"
             style="display: flex;align-items: center;align-content: center;height: 205px;width: 100%;justify-content: center;position: relative;cursor: pointer;">
          <img ref="wooden" class="wooden" :src="fish" style="width: 120px;height:120px;margin-top: -30px">
          <img ref="bing" class="bing " :src="bing"
               style="width: 120px;position: absolute;margin-top: 10px;margin-left: -50px">
          <span class="tip" style="color: var(--primary-text);"> 功德 +1</span>
          <div style="position: absolute;bottom:35px">
            <div style="color: var(--primary-text);"><span class="mr-4">今日 {{ getToday }}</span> 总 {{ getTotal }}</div>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audio" src='/sound/fish.mp3'/>
  </xt-container>
</template>

<script>
import Widget from '../card/Widget.vue'
import fish from '../../assets/img/fish/muyu.png'
import bing from '../../assets/img/fish/bing.png'
import { fishStore } from '../../store/fish'
import { mapWritableState } from 'pinia'
import {message} from 'ant-design-vue'

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
    },
    desk:{
      type:Object
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
      header: {
        ifyIcon:"fluent:shopping-bag-20-regular",
        title:"小木鱼",
        titleHover:true,
        titleHoverName:'买同款',
      },
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
    openTaobao(){
      browser.openInSystem('https://item.taobao.com/item.htm?ft=t&id=772409985539')
      message.success('正在为您打开商品页面')
    },
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
  mounted () {
    this.customData.customSize = '2x2'
  }
}
</script>

<style scoped lang="scss">
.bing {
  left: 50px;
  top: 20px;
  rotate: -30deg;
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
