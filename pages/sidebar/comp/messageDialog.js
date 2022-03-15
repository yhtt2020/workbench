const messageTempl = `
  <div class="message-wrap" v-show="visible">
    <div class="message-mask" @click="clkmask"></div>
    <div class="message-dialog flex flex-direction">
      <div class="top flex justify-between align-center">
        <div class="top-lf flex justify-center align-center text-black-lg">
          <a-icon type="bell" :style="{ fontSize: '16px' }"></a-icon>
          <span>通知中心</span>
        </div>
        <div class="top-rg flex justify-around align-center">
          <img src="./assets/clean.svg" alt="" style="width: 18px; height: 18px;">
          <a-icon type="setting" :style="{ fontSize: '16px', color: '#8c8c8c' }" @click="openMsmSetting"></a-icon>
          <a-icon type="pushpin" :style="{ fontSize: '16px', color: '#8c8c8c' }" @click="fixedMessage"></a-icon>
        </div>
      </div>
      <div class="mid">
        <div class="lumen flex flex-direction justify-between align-center" v-show="lumenMessage.length > 0">
          <div class="lumen-top flex justify-between align-center">
            <div class="lumen-top-lf flex justify-start align-center text-black">
              <img src="../../icons/svg/chat.svg" style="width: 30px; height: 30px;">
              <span>团队</span>
              <a-icon type="export" :style="{ fontSize: '16px', color: '#8c8c8c' }"></a-icon>
            </div>
            <a-icon class="lumen-top-rg" type="close-circle" theme="filled" :style="{ fontSize: '16px' }"></a-icon>
          </div>
          <div class="lumen-content flex flex-direction justify-center align-center">
            <ul>
              <template>
                <a-dropdown :trigger="['contextmenu']" class="flex justify-between align-center" v-for="(item, index) in lumenMessage" :key="index">
                  <li>
                    <div class="flex flex-direction justify-around align-start">
                      <span class="text-black" style="font-weight: 500;">{{item.title}}</span>
                      <span class="text-grey-sm sg-omit2-sm">{{item.body}}</span>
                      <span class="text-grey-sm">{{item.time}}</span>
                    </div>
                    <a-icon class="closex" type="close-circle" theme="filled" :style="{ fontSize: '16px' }" @click="removeMessage(item.id)"></a-icon>
                  </li>
                  <a-menu slot="overlay" :data-id="item.id" @click="lumenMenuClick">
                    <a-menu-item key="1">
                      打开
                    </a-menu-item>
                    <a-menu-item key="2">
                      删除
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
            </ul>
          </div>
        </div>
        <div class="osx flex flex-direction justify-center align-center">
          <div class="osx-top flex justify-between align-center">
            <div class="osx-top-lf flex justify-start align-center text-black">
              <img src="./assets/osx.svg" style="width: 30px; height: 30px;">
              <span>团队</span>
            </div>
            <a-icon class="osx-top-rg" type="close-circle" theme="filled" :style="{ fontSize: '16px' }"></a-icon>
          </div>
          <div class="osx-content flex flex-direction justify-center align-center">
            <ul>
                <li class="flex justify-between align-center" ref="test">
                  <div class="flex flex-direction justify-around align-start">
                    <span class="text-black" style="font-weight: 500;">新动态</span>
                    <span class="text-grey-sm sg-omit-sm" style="width: 90%">短说小芋头发布了短说社区研发日报水电费水电费冯绍峰舒服的方式释放</span>
                    <span class="text-grey-sm">上午08:00</span>
                  </div>
                  <a-icon class="closex" type="close-circle" theme="filled" :style="{ fontSize: '16px' }"></a-icon>
                </li>
            </ul>
          </div>
        </div>
        <div class="webos flex flex-direction justify-between align-center">
          <div class="webos-top flex justify-between align-center text-black">
            <div class="webos-top-lf flex justify-start align-center text-black">
              <img src="./assets/network.svg" style="width: 30px; height: 30px;">
              <span>来自网页的消息</span>
            </div>
            <a-icon class="webos-top-rg" type="close-circle" theme="filled" :style="{ fontSize: '16px' }"></a-icon>
          </div>
          <div class="webos-content flex flex-direction justify-center align-center">
            <ul>
              <template>
                <a-dropdown :trigger="['contextmenu']">
                  <li class="flex justify-between align-center" ref="test">
                    <div class="flex flex-direction justify-around align-start">
                      <span class="text-black" style="font-weight: 500;">轻流www.haha.com</span>
                      <span class="text-grey-sm sg-omit-sm" style="width: 90%">收到一条抄送通知！</span>
                      <span class="text-grey-sm">上午08:00</span>
                    </div>
                    <a-icon class="closex" type="close-circle" theme="filled" :style="{ fontSize: '16px' }"></a-icon>
                  </li>
                  <a-menu slot="overlay">
                    <a-menu-item key="1">
                      打开
                    </a-menu-item>
                    <a-menu-item key="2">
                      删除
                    </a-menu-item>
                    <a-menu-item key="3">
                      不再接收该网页消息
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom flex justify-start align-center">
        <img src="./assets/nodisturb.svg" style="width: 34px; height: 34px; margin: 0px 10px;">
        <div class="flex flex-direction justify-center align-start">
          <span class="text-black" style="font-weight: 500;">勿扰模式</span>
          <span class="text-grey-sm sg-omit-sm">关闭系统消息提醒,不显示侧边栏红色</span>
        </div>
      </div>
    </div>
  </div>
`

Vue.component('message-center',{
  template: messageTempl,
  props: {
    visible: {
      type: Boolean
    },
    mod: {
      type: String
    }
  },
  data() {
    return {
      fixed: localStorage.getItem('ISMESSAGE_FIXED') == 'true' ? true : false
    }
  },
  computed: {
    lumenMessage() {
      return this.$store.getters.getAllMessages.filter(v => v.messageType === 'lumen')
    }
  },
  methods: {
    lumenMenuClick({ key }, $event) {
      console.log(key, $event, '????????')
      // if(key == 2) {
      //   //删除消息
      //   this.$store.dispatch('deleteMessageById', id)
      // } else {
      //   //打开消息并定位到消息
      // }
    },
    removeMessage(id) {
      this.$store.dispatch('deleteMessageById', id)
    },
    clkmask() {
      this.$emit('closeMessage')
      localStorage.setItem('ISMESSAGE_FIXED', false)
    },
    openMsmSetting() {
      ipc.send('openMsmSetting')
    },
    fixedMessage() {
      if(this.mod !== 'auto' && !this.fixed) {
        let $style = document.getElementsByClassName('message-dialog')[0].style
        $style.height = '100vh'
        $style.borderRadius = '0px'
        this.fixed = true
        localStorage.setItem('ISMESSAGE_FIXED', true)
      } else if(this.mod !== 'auto' && this.fixed) {
        let $style = document.getElementsByClassName('message-dialog')[0].style
        $style.height = '600px'
        $style.borderRadius = '10px'
        this.fixed = false
        localStorage.setItem('ISMESSAGE_FIXED', false)
      } else {
        ipc.send('message',{type:"error",config:{content:'auto模式下无法固定消息中心位置,请切换侧边栏其余两种模式!'}})
      }
    }
  },
  watch: {
    mod: {
      handler(val) {
        if(val === 'auto' || val === 'open') {
          document.getElementsByClassName('message-dialog')[0].style.left = '145px'
        } else {
          document.getElementsByClassName('message-dialog')[0].style.left = '45px'
        }
      },
      deep: true
    },
    fixed: {
      handler(val) {
        if(val === true) {
          document.getElementsByClassName('message-mask')[0].style.display = 'none'
          ipc.send('channelFixed')
        } else {
          document.getElementsByClassName('message-mask')[0].style.display = 'block'
          ipc.send('channelFreeFixed')
        }
      },
      deep: true
    }
  },
  mounted() {
    if(this.mod === 'auto' || this.mod === 'open') {
      document.getElementsByClassName('message-dialog')[0].style.left = '145px'
    } else {
      document.getElementsByClassName('message-dialog')[0].style.left = '45px'
    }
    if(this.fixed) {
      this.$emit('updateVisible', true)
      let $style = document.getElementsByClassName('message-dialog')[0].style
      $style.height = '100vh'
      $style.borderRadius = '0px'
      document.getElementsByClassName('message-mask')[0].style.display = 'none'
    } else {
      this.$emit('updateVisible', false)
      let $style = document.getElementsByClassName('message-dialog')[0].style
      $style.height = '600px'
      $style.borderRadius = '10px'
      document.getElementsByClassName('message-mask')[0].style.display = 'block'
    }
  }
})
