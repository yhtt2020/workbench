<script>
import { ThunderboltFilled } from '@ant-design/icons-vue'
import Template from '../../../user/pages/Template.vue'
import BorderAavtar from '../avatar/BorderAavtar.vue'
import FrameAvatar from '../avatar/FrameAvatar.vue'
import { mapWritableState } from 'pinia'
import { messageStore } from '../../store/message'
import { appStore } from '../../store'
import { Modal } from 'ant-design-vue'
import Emoji from '../comp/Emoji.vue'
import {isMain} from '../../js/common/screenUtils'

export default {
  components: {
    Emoji,
    ThunderboltFilled,
    BorderAavtar,
    FrameAvatar
  },
  data () {
    return {
      messages: [],
      myFrameUrl: '',
    }
  },
  props: ['size', 'chat', 'level'],
  computed: {
    ...mapWritableState(messageStore, ['messageIndex', 'totalCount']),
    ...mapWritableState(appStore, ['userInfo', 'settings', 'lvInfo', 'simple']),
  },
  mounted () {
    this.lastTime = Number(localStorage.getItem('lastBarrageMessageTime'))
    this.setMinute()
    // this.loadMessages()
    // setInterval(() => {
    //   this.loadMessages()
    // }, 10000)

  },
  methods: {
    isMain,
    setMinute () {
      setInterval(() => {
        this.$refs.minute?.classList.add('move')
        this.lvInfo.remainMinute--
        if (this.lvInfo.remainMinute <= 0) {
          this.lvInfo.remainHour--
          if (this.lvInfo.remainHour < 0 && this.tipped === false) {
            this.tipped = true
            ipc.send('getDetailUserInfo')
            Modal.info({
              title: '升级提示',
              content: '恭喜您等级提升',
            })
          }
          this.lvInfo.remainMinute = 59
        }
        this.timer = setTimeout(() => {
          this.$refs.minute?.classList.remove('move')
        }, 1000)
      }, 60000)
    },
    // async loadMessages() {
    //   this.messages = await messageModel.allList()
    //   this.messages.forEach(mes => {
    //     //修正一下登录小助手的
    //     if (mes.title === '登录小助手') {
    //       mes.body = '[提醒]'
    //     }
    //   })
    //   if (this.lastTime === 0) {
    //     let barrages = this.messages.slice(0, 10)
    //     window.$manager.sendChat(barrages)
    //     if (barrages.length > 0) {
    //       this.lastTime = barrages[0].create_time//重新设置指标
    //     } else {
    //       this.lastTime = Date.now()
    //     }
    //   } else {
    //     let readyToSend = this.messages.filter(mes => {
    //       return mes.create_time > this.lastTime
    //     })
    //     //readyToSend.splice(0,10)
    //     if (readyToSend.length > 0) {
    //       window.$manager.sendChat(readyToSend)
    //     }
    //     if (this.messages.length > 0) {
    //       this.lastTime = this.messages[0].create_time//重新设置指标
    //     } else {
    //       this.lastTime = Date.now()
    //     }
    //
    //     localStorage.setItem('lastBarrageMessageTime', this.lastTime)
    //   }
    //   if (this.messages.length > 2) {
    //     this.messages.splice(2)
    //   }
    //
    // },
    login () {
      tsbApi.user.login((data) => {
        ipc.send('getDetailUserInfo')
      })
    },
    social () {
      // if (this.totalCount) {
      //   this.$router.push({name: 'message'})
      // } else {
      //
      // }
      this.$router.push({ name: 'socialMy' })
    },
  }
}
</script>

<template>
  <div v-if="!userInfo">
    <div @click="login" style="padding: 0.5em">
      <a-avatar :size="size||54" class="xt-text">未登录</a-avatar>
      <div>
      </div>
      <div>
      </div>
    </div>
  </div>

  <div v-else-if="!simple" :style="{ width: '5em'}" class="relative">
    <div class="pointer" @click="social">
      <div v-if="!simple" class="user-info" :span="24" style="padding: 0.6em;position:relative;">
        <!-- <FrameAvatar class="frame-position" :avatarUrl="userInfo.avatar" :avatarSize="size || 42" :frameUrl="myFrameUrl"></FrameAvatar> -->
        <a-row style="text-align: left" :gutter="10">
          <a-col :span="12" :style="{paddingLeft:simple?'20px':'5px'}">
            <!-- <BorderAavtar :avatarUrl="userInfo.avatar" :rarity="1" :borderSize="4" :avatarSize="size || 50"></BorderAavtar> -->
            <FrameAvatar  class="frame" :avatarUrl="userInfo.avatar" :avatarSize="size || 50"
                         :frameUrl="userInfo.frame"></FrameAvatar>
            <!-- <a-badge style="border:none;" :count="totalCount">
              <a-avatar :src="userInfo.avatar" :size="size || 50">{{ userInfo.nickname }}</a-avatar>
            </a-badge> -->
          </a-col>
          <!-- 等级 -->
          <a-col :span="12" v-if="!simple && level" @click.stop="goMy()" style="position: relative;">
            <span ref="minute" class="tip">+1</span>
            <div class="xt-text" style="padding-top: 0.1em; min-height: 50px">
              <span style="font-size: 0.8em;"></span> {{ lvInfo.lv }}级 <br>
              <span>
                    <a-tooltip>
                      <a-progress strokeColor="var(--active-bg)" trailColor="var(--secondary-bg)" :percent="lvInfo.percentage" :showInfo="false"
                                  style="width:4em"/>
                      <template #title>
                        <thunderbolt-filled class="thunder"
                                            style="color: rgba(255,140,44,0.98);vertical-align: middle"/>
                        <span style="color: #f3f3f3;font-size: 12px;vertical-align: middle">{{
                            lvInfo.remainHour
                          }}小时{{ lvInfo.remainMinute }}分后升级</span>
                      </template>
                    </a-tooltip>
                  </span>
            </div>

            <!--                <span class="ts-grade-crown" v-for="item in this.userInfo.onlineGradeIcons.crown">-->
            <!--                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">-->
            <!--                </span>-->
            <!--                <span class="ts-grade-sun" v-for="item in this.userInfo.onlineGradeIcons.sun">-->
            <!--                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">-->
            <!--                </span>-->
            <!--                <span class="ts-grade-moon" v-for="item in this.userInfo.onlineGradeIcons.moon">-->
            <!--                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">-->
            <!--                </span>-->
            <!--                <span class="ts-grade-star" v-for="item in this.userInfo.onlineGradeIcons.star">-->
            <!--                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">-->
            <!--                </span>-->
          </a-col>
          
        </a-row>
      </div>
      
    </div>
    <div class="h-full w-[1px] absolute top-0 " style="background-color: var(--divider);left: 72px;"></div>
  </div>
  <template v-else>
    <div  class="btn" v-if="isMain()"   @click="social" >
      <FrameAvatar class="frame" :avatarUrl="userInfo.avatar" :avatarSize="size|| 33"
                   :frameUrl="userInfo.frame"></FrameAvatar>
      <div>我的</div>
    </div>
  </template>
</template>

<style scoped lang="scss">
.level-badge {
  left: 0;
  bottom: 0;
  border-radius: 100px;
  width: 2em;
  font-size: 1.1em;
  height: 2em;
  text-align: center;
  line-height: 2em;
  display: inline-block;
  background: rgba(42, 40, 40, 0.51);
}


.thunder {
  animation: twinkling 1.2s ease-in-out infinite;
}

@keyframes twinkling {
  0% {
    opacity: 0.5;
    filter: alpha(opacity=50);
  }

  50% {
    opacity: 1;
    filter: alpha(opacity=100);
  }

  100% {
    opacity: 0.5;
    filter: alpha(opacity=50);
  }
}

.tip {
  position: absolute;
  top: 0;
  right: -25px;
  opacity: 0;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  width: 30px;
  text-align: center;
  line-height: 15px;
}

.move {

  animation: moveUp 0.8s;
}

@keyframes moveUp {
  from {
    top: 20px;
    opacity: 100;
  }

  to {
    top: -10px;
    opacity: 0;

  }
}

:deep(.ant-badge-count) {
  box-shadow: none;
}
</style>
