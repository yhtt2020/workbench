<template>
  <Widget :options="options" :desk="desk" :showRightIcon='rightIcon' :env="env">
    <div></div>
<!--    <div class="pointer" @click="activityDescription(illustrateUrl)"-->
<!--         style="position: absolute;left: 90px;top:15px;font-size: 13px;color: rgba(255, 255, 255, 0.6);background: rgba(255, 255, 255, 0.2); padding: 3px 12px;border-radius: 4px;">-->
<!--      活动说明-->
<!--    </div>-->
    <template v-if="!newPeoplePage">
      <div class="flex justify-between s-item p-4 rounded-lg xt-bg-2 xt-text"
           style="margin-top: 1em;">
        <div>
          <div class="mt-2" style=" font-size: 16px; font-weight: 600;">
            {{ signedIn ? '今日已签到' : '今日未签到' }}
          </div>
          <span v-if="false" style="color: var(--secondary-text); font-size: 14px;">已连续签到2天</span>
        </div>
        <div @click="signIn" class="middle-button sign-in-btn s-item"
             style="height: 42px;line-height: 42px;color: white"
             :class="signedIn ? (completeLikes.length > 4 ? 'already' : 'new-people') : 'old-people'">
          {{ signedIn ? (completeLikes.length > 4 ? '已签到' : '今日新人') : '签到' }}
        </div>
      </div>
      <HorizontalPanel style="min-width: 100%" :navList="signInTitle" v-model:selectType="signInType" :height="44"
                       class="mt-3 mb-2"></HorizontalPanel>
      <div v-if="signInType.name === 'today'" class="flex flex-col overflow content-box pt-1 ">
        <!-- <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:210px;"> -->
        <div v-if="!todayRank.length" class="not-sign h-full flex justify-center items-center ">还没有人签到，快来抢第一
        </div>
        <div v-else v-for="item in todayRank.slice(0,5)" :key="item.id"
             class="w-full flex items-center rounded-lg justify-between pointer set-type" style="margin: 6px 0 6px;">
          <span class="ranking">{{ item.id }}</span>
          <div class="flex-1 flex ml-3 items-center" style="width: 60px">
            <FrameAvatar style="zoom:0.5;" :avatar-size="60" @click="showCard(item.uid)" :avatar-url="item.avatar" :frame-url="item.equippedItems?.frameDetail?.image">
              <template #icon>
                <UserOutlined/>
              </template>
            </FrameAvatar>
            <div @click="showCard(item.uid)" class="ml-3 truncate"
                 style="color: var(--primary-text);font-size: 14px;max-width: 120px;">
              {{ item.nickname }}
            </div>
          </div>
          <div style="color:var(--primary-text);font-size: 16px;">{{ item.time }}</div>
        </div>
        <!-- </vue-custom-scrollbar> -->
      </div>
      <div v-else class="flex flex-col overflow content-box pt-1">
        <!-- <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:210px;"> -->
        <!--        <div v-for="item in accrueList" :key="item.id"-->
        <!--             class="w-full flex items-center rounded-lg justify-between pointer mt-3 set-type"-->
        <!--             style="margin: 6px 0 6px;">-->
        <!--          <span class="ranking">{{ item.id }}</span>-->
        <!--          <div class="flex-1 flex ml-3 items-center">-->
        <!--            <a-avatar>-->
        <!--              <template #icon>-->
        <!--                <UserOutlined/>-->
        <!--              </template>-->
        <!--            </a-avatar>-->
        <!--            <div class="ml-3 truncate" style="color: rgba(255,255,255,0.85);font-size: 16px;max-width: 110px;">-->
        <!--              {{ item.username }}-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div style="color: rgba(255,255,255,0.60);font-size: 16px;">{{ item.accumulate }}</div>-->
        <!--        </div>-->
        <div class="text-center py-5">暂未开放，敬请期待</div>
        <!-- </vue-custom-scrollbar> -->
      </div>
      <div class="integral-modal s-bg" v-if="toggleModal">
        <img class="modal-icon" src="../../../../public/img/test/s-good.png" alt="">
        <span class="modal-number">+2积分</span>
      </div>
    </template>
    <template v-else>
      <div v-if="false " class="s-item rounded-lg" style="margin-top: 1em;padding: 10px 12px 15px;">
        <span class="text-style" style="color: var(--primary-text);font-size: 14px;">点击用户头像，为社区新人点赞，每日完成 5 个「迎新签到」可获得 n 倍签到奖励。</span>
        <div class="mt-1" style="color: var(--secondary-text);font-size: 14px;">今日已为{{
            completeLikes.length
          }}位社区新人点赞
        </div>
      </div>
      <div v-else class="s-item rounded-lg" style="margin-top: 1em;padding: 10px 12px 15px;">
        <span class="text-style"
              style="color: rgba(255,255,255,0.85);font-size: 14px;">今日新注册用户：  {{ total }} 人</span>
      </div>
      <div class="mt-3" style="height:235px; overflow:hidden;">
        <!--        <div class="text-center mb-1" style="color: var(--secondary-text);font-size: 14px;">今日新人</div>-->
        <div class="head-list">
          <div v-for="item in newPeopleList" class=" w-14  flex justify-center items-center pointer flex-col"
               :key="item.id"
               style="margin:8px 14px;border-radius: 50%;" @click="showCard(item.uid,item.userInfo)"
               @contextmenu.stop="showCard(item.uid,item.userInfo)">
            <div class="mb-2 mt-2">
              <a-avatar class="h-14 w-14" :class="item.headToggle ? 'h-8 w-8' : ''" :src="item.userInfo.avatar"/>
            </div>
            <div>
              {{ item.userInfo.nickname }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-around">
        <div @click="signInBack"
             class="s-item change cursor-pointer rounded-lg w-12 h-12 flex items-center justify-center">
          <Icon icon="xiangzuo" style="font-size: 1.715em;color: var(--primary-text);"></Icon>
        </div>
        <span @click="popUsers" class="change pointer rounded-lg s-item  flex items-center justify-center"
              style="padding:13px 55px;color: var(--primary-text);"
        >
          <icon style="font-size: 20px" icon="shuaxin" class="mr-2"></icon>   换一换
          </span>
      </div>
    </template>
  </Widget>
</template>

<script>
import Widget from '../card/Widget.vue'
import HorizontalPanel from '../HorizontalPanel.vue'
import { mapActions, mapWritableState } from 'pinia'
import { UserOutlined } from '@ant-design/icons-vue'
import { comStore } from '../../store/com'
import { message } from 'ant-design-vue'
import { appStore } from '../../store'
import _ from 'lodash-es'
import FrameAvatar from '../avatar/FrameAvatar.vue'

export default {
  name: 'SingIn',
  components: {
    FrameAvatar,
    Widget,
    HorizontalPanel,
    UserOutlined
  },
  props: ['desk', 'rightIcon'],
  data () {
    return {
      options: {
        className: 'card',
        title: '签到',
        icon: 'star',
        type: 'signIn'
      },
      signInTitle: [{ title: '今日已签', name: 'today' },
        { title: '累签榜', name: 'accrue' }, { title: '连签榜', name: 'continued' }
      ],
      signInType: { title: '今日签到榜', name: 'today' },
      // todayList: [],
      accrueList: [
        { id: 1, headSculpture: '', username: '外太空的狗', accumulate: '345天' },
        { id: 2, headSculpture: '', username: '猫星人', accumulate: '300天' },
        { id: 3, headSculpture: '', username: '晒太阳的猫', accumulate: '1266天' },
        { id: 4, headSculpture: '', username: '猪猪人', accumulate: '240天' },
        { id: 5, headSculpture: '', username: '彩虹马', accumulate: '160天' }
      ],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      signedIn: false,
      toggleModal: false,
      newPeoplePage: false,
      newPeopleList: [],
      completeLikes: [],
      illustrateUrl: 'https://www.yuque.com/tswork/mqon1y/kax12qz084vffcyp',

      page: 1,
      max: 99999,
      lastUsers: [],
      total: 0,
      env:{
        web: false,
        mobile: false,
        client: false,
        offline: true
      }

    }
  },
  async mounted () {
    this.updateTodayRank().then()
    this.getSingInfo()

    this.request().then(() => {
      this.popUsers()
    })
  },
  computed: {
    ...mapWritableState(comStore, ['todayRank']),

  },
  methods: {
    ...mapActions(comStore, ['updateTodayRank', 'doSign', 'getSignInfo', 'getDailyNewUsers']),
    ...mapActions(appStore, ['showUserCard']),
    async popUsers () {
      // console.log('开始弹出用户')
      if (this.lastUsers.length > 0) {
        // console.log('剩余用户数组', this.lastUsers)
        if (this.lastUsers[0].length < 6) {
          // console.log('剩余用户不足6')
          //证明已经没有下一页了
          this.newPeopleList = _.cloneDeep(this.lastUsers[0])
          this.lastUsers.splice(0, 1)//移除
        } else {
          // console.log('剩余用户充足')
          //如果还有数组
          this.newPeopleList = this.lastUsers[0]
          this.lastUsers.splice(0, 1)//移除
        }
      } else {
        // console.log('剩余用户组不足，翻页')
        //已经没有足够的数组了，就请求下一页
        if (this.page >= this.max) {
          // console.log('已经到达最后一页')
          //已经是最多的了，重新获取第一页
          this.page = 1
          await this.request(this.page)
        } else {

          this.page++
          // console.log('请求下一页', this.page)
          await this.request(this.page)
        }
        // console.log('再次执行弹出')
        if(this.page===1 && this.lastUsers.length===0 && this.total===0){
          //如果是第一页，且已经没有空余的了，不需要再请求
          return
        }else{
          await this.popUsers()
        }

      }
    },
    async request (page) {
      let dailyNew = await this.getDailyNewUsers(page)
      this.lastUsers = _.chunk(dailyNew.list, 6)//按照每页6个分页
      this.max = dailyNew.pageInfo.pages
      this.total = dailyNew.pageInfo.count
      // console.log(dailyNew, '请求到一页的数据')
    },
    async getTodayList () {
      // let rankResponse = await this.getTodayRank()
      // if(rankResponse.status===1){
      //   return rankResponse.data.rankInfo.map(r=>{
      //     // { id: 1, headSculpture: '', username: '阳光小葵', time: '00:01' },
      //     return {
      //       id:r.rank,
      //       uid:r.uid,
      //       avatar:r.userInfo.avatar || '',
      //       nickname:r.userInfo.nickname || '',
      //       time:utils.friendlyDate(r.signTime)
      //     }
      //   })
      // }
      // console.log(rankResponse)
    },
    getSingInfo () {
      this.getSignInfo().then(data => {
        if (data) {
          if (data.status === 1) {
            this.signedIn = true
            return
          }
        }
        this.signedIn = false
      })
    },
    showCard (uid, userInfo) {
      this.showUserCard(uid, userInfo)
    },
    async signIn () {
      if (!this.signedIn) {

        let doSign = await this.doSign()
        if (doSign) {
          this.updateTodayRank().then()
          this.toggleModal = true
          setTimeout(() => {
            this.toggleModal = false
          }, 1000)
          this.signedIn = true
        } else {
          message.error('签到失败。')
        }

      } else {
        this.newPeoplePage = true
      }
    },
    signInBack () {
      this.newPeoplePage = false
    },
    newLikes (item) {
      if (this.completeLikes.length) {
        if (!this.completeLikes.find(info => info.id === item.id)) {
          this.completeLikes.push(item)
          this.newPeopleList.forEach(i => {
            if (i.id === item.id) {
              i.headSculpture = '../../../../public/img/test/s-good.png'
              i.headToggle = true
            }
          })
        }
      } else {
        this.completeLikes.push(item)
        this.newPeopleList.forEach(i => {
          if (i.id === item.id) {
            i.headSculpture = '../../../../public/img/test/s-good.png'
            i.headToggle = true
          }
        })
      }
    },
    activityDescription (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
.sign-in-btn {
  width: 91px;
  height: 48px;
  background: var(--active-bg);
  font-size: 18px;
  line-height: 48px;
  text-align: center;

  &:hover {
    opacity: 0.8;
    // font-weight: bold;
    cursor: pointer;
  }
}

.old-people {
  background: var(--active-bg);
}

.new-people {
  background: #3CA10B;
}

.already {
  background: rgba(0, 0, 0, 0.30);
}

.ranking {
  width: 24px;
  height: 24px;
  text-align: center;
  background: var(--mask-bg);
  border-radius: 4px;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 600;
}

.integral-modal {
  z-index: 999;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 160px;
  height: 160px;
  margin: auto;
  border-radius: 24px;

  .modal-icon {
    width: 64px;
    height: 64px;
  }

  .modal-number {
    font-size: 16px;
    color: var(--primary-text);
    font-weight: 600;
    margin-top: 14px;
  }
}

.content-box {
  height: 220px;
  overflow: hidden;
}

.set-type:nth-of-type(1) > span {
  background: #FE2C46;
}

.set-type:nth-of-type(2) > span {
  background: #FF6600;
}

.set-type:nth-of-type(3) > span {
  background: #FAAA10;
}

.text-style {
  word-break: normal;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  font-size: 14px;
  color: var(--primary-text);
}

.head-list {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  // margin: 16px 16px 0;
}

.not-sign {
  font-size: 14px;
  color: var(--primary-text);
  text-align: center;
}

.nav-list-container {
  box-shadow: none !important;
  background: rgba(255, 255, 255, 0.2) !important;
}

::v-deep .ant-slider-track {
  // background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
}

.item-name {
  word-break: normal;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}

.active-index {
  background: rgba(32, 32, 32, 1);
  border-radius: 8px;
}

::v-deep .ps__thumb-y {
  display: none !important;
}

</style>
