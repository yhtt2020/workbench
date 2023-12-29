<template>
  <div class="line-title">按键设置</div>

  <div style="text-align: left">
    <KeySetting></KeySetting>
  </div>
  <div class="line">
    <div class="mb-1">摇一摇鼠标穿梭：</div>
    <p>局限性：目前暂不只是坐标轴为负的屏幕穿梭返回。</p>
    <a-switch v-model:checked="settings.shake.enable"></a-switch>
  </div>
  <div v-if="settings.shake.enable">

    <div class="line">
      <div class="mb-1">穿梭位置： x:{{ settings.shake.pos.x }}
        y:{{ settings.shake.pos.y }}
      </div>

      <xt-button type="theme" :x="80" :h="40" size="mini" @click="setPos">重新设置</xt-button>
    </div>
    <div class="line" style="width: 400px">
      <div class="mb-1">灵敏度：</div>
      <RadioTab :navList="sensitive" v-model:selectType="sensitiveValue"></RadioTab>
    </div>
    <div class="line" style="width: 700px">
      <div class="mb-1">穿梭音效：</div>
      <RadioTab :nav-list="sounds" v-model:select-type="sound"></RadioTab>
    </div>

  </div>
</template>

<script>
import KeySetting from '../../components/comp/KeySetting.vue'
import { mapWritableState,mapActions } from 'pinia'
import { appStore } from '../../store'
import XtRadio from '../../ui/libs/Radio/index.vue'
import RadioTab from '../../components/RadioTab.vue'
import { message } from 'ant-design-vue'

export default {
  name: 'Key',
  components: { RadioTab, XtRadio, KeySetting },
  computed: {
    ...mapWritableState(appStore, ['settings'])
  },
  data () {
    return {
      sensitive: [{ title: '低', name: '6' }, { title: '中', name: '5' }, { title: '高', name: '4' }],
      sounds: [{
        title: '木鱼', name: 'fish.mp3',
      },
        {
          title: '青蛙叫', name: 'gua.mp3'
        },
        {
          title: '逼兜', name: 'bidou.wav'
        },
        {
          title: '篮球', name: 'lanqiu.wav'
        },
        {
          title: '歘', name: 'chua.wav'
        }
      ],
      sound: {},
      sensitiveValue: {},
      listenEnter: (event) => {
        if (event.code === 'Enter') {
          let win32 = $models.win32
          console.log('监听到回车键了', win32.getMouseMovePoints())

          const point = tsbApi.mouse.getPos()
          this.settings.shake.pos = {
            x: point.x,
            y: point.y
          }
          message.success('设置摇一摇定位成功。')
          window.shake.pos = this.settings.shake.pos
          this.shakeConfirm.close()
          this.$router.push({
            name: 'key'
          })
          window.removeEventListener('keydown', this.listenEnter)

          event.preventDefault()
          event.stopPropagation()
        }
      },
      shakeConfirm: null
    }
  },
  mounted () {
    this.sound.name = this.settings.shake.audio
    this.sensitiveValue.name = String(this.settings.shake.sensitive)
    console.log(this.sound, this.sensitiveValue)
  },
  methods: {
    ...mapActions(appStore,['disableShake','enableShake']),
    setPos () {
      window.addEventListener('keydown', this.listenEnter)
      this.shakeConfirm = this.$xtConfirm('提示', '请将鼠标移动到您希望在摇一摇后自动定位到的位置，并按下回车键（Enter），期间请勿关闭此窗口', {
        mask: true,
        okText: '取消',
        no: false,
        noText: false,
        ok: () => {
          window.removeEventListener('keydown', this.listenEnter)
          message.info('已取消设置')
        }

      })
    }
  },
  watch: {
    'sensitiveValue': {
      handler (newVal) {
        console.log(newVal)
        this.settings.shake.sensitive = Number(newVal.name)
        window.shake.sensitive = this.settings.shake.sensitive
      },

    },
    'settings.shake.enable': {
      handler (newVal) {
        if(newVal){
          this.enableShake()
        }else{
          this.disableShake()
        }
      },
      deep: true
    },
    'sound': {
      handler (newVal) {
        console.log(newVal)
        this.settings.shake.audio = newVal.name
        this.$nextTick(() => {
          document.getElementById('shakeAudio').play()
        })
      }
    },

  }
}
</script>

<style scoped lang="scss">
</style>
