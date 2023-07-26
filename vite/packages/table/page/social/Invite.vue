<template>


  <div class="s-bg ml-3 p-3 rounded-xl  xt-bg"
       style="width: 850px;min-height: 300px;;display: flex;flex-direction: column;max-height: 100%">
    <div class="mb-3" style="width: 300px;">
      <HorizontalPanel :nav-list="tabs" v-model:select-type="tab">
      </HorizontalPanel>
    </div>
    <div class="px-3" style="flex: 1;height: 0">
      <vueCustomScrollbar v-if="tab.name==='invite'" :settings="scrollbarSettings" style="height: 100%">
        <div class="" style="height: auto;color: var(--primary-text )">
          <p>
            如果您的好友对此类软件有兴趣，可通过下方生成邀请码，赠与对方。
            <br>对方将获得 <img style="width: 24px" src="https://a.apps.vip/icons/test_sm.png"> 受邀用户勋章。</p>
          <p>兑换方式：每200小时可兑换1枚邀请码，四舍五入（第1个邀请码在100小时释放，第2个在300小时） <br>
            您的在线总时长：<strong class="text-green-400">{{ totalHours }}</strong> 小时，总计可兑换：<strong
              class="text-red-400">{{ canExchange }}</strong>，已兑换：<strong class="text-green-400">{{
                exchanged
              }}</strong>，剩余：<strong
              class="text-red-400">{{ leave }}</strong>。
            <a-button type="primary" @click="confirmExchange" :disabled="leave===0" style="color:var(--main-text)">
              兑换1枚
            </a-button>
          </p>

          <p>您已成功邀请{{ invitedUsers.length }}位用户。</p>
          <div>
            <div @click="showCard(user.uid,user)" class="aUser truncate pointer" v-for="user in invitedUsers"
                 :title="user.nickname">
              <a-avatar :size="40" :src="user.avatar">
              </a-avatar>
              <div>
                {{ user.nickname }}
              </div>
            </div>
          </div>

          <a-table :pagination="false" :dataSource="codes" :columns="columns">
            <template #bodyCell="{ column, record,index }">
              <template v-if="column.key === 'createTime'">
                {{ friendlyDate(record.createTime) }}
              </template>
              <template v-else-if="column.key === 'updateTime'">
            <span v-if="record.createTime!==record.updateTime">
              {{ friendlyDate(record.updateTime) }}
            </span>
                <span v-else>未使用</span>
              </template>
              <template v-else-if="column.key === 'key'">
            <span style="padding-left: 2px;padding-right: 2px" class="mr-3"
                  :style="{background:isMarked(record.key)?'#35ad03':'transparent',textDecoration:record.status===2?'line-through':'none'}">
              {{ record.key }}
            </span>
                <a-button size="small" class="pointer mr-1" @click="copy(record.key)">复制</a-button>
                <a-button size="small" class="pointer" @click="mark(record.key)">标记</a-button>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag color="green" v-if="record.status===1" style="color: #6abe39 ">有效</a-tag>
                <a-tag color="geekblue" v-else-if="record.status===2">已使用</a-tag>
              </template>
              <template v-else-if="column.key === 'user' && record.uid">
                <div @click="showCard(record.uid,record.userInfo)" class="text-center truncate"
                     style="max-width: 120px;">
                  <a-avatar :src="record.userInfo.avatar"></a-avatar>&nbsp;
                  <span style="font-size: 12px" :title="record.userInfo.nickname">{{ record.userInfo.nickname }}</span>
                </div>

              </template>
              <template v-else-if="column.key==='index'">
                {{ codes.length - index }}
              </template>
            </template>
          </a-table>
        </div>

      </vueCustomScrollbar>
      <vueCustomScrollbar v-if="tab.name==='verify'" :settings="scrollbarSettings" style="height: 100%">

        <template v-if="verified">
          <div class="text-center xt-text " style="min-height: 300px">
            恭喜您，您已认证受邀参与公测资格，获得勋章：<br>
            <div style="background: var(--secondary-bg);width: 200px;text-align: center;" class="p-3 rounded-2xl m-3 inline-block">
              <div>
                <RayMedal :size="120" src="https://a.apps.vip/icons/test_lg.png"></RayMedal>

              </div>
              <div>
                受邀用户勋章
              </div>
            </div>
            <br>
            前往<a-button @click.stop="goToMy" class="mx-2" size="small" type="primary">我的</a-button>界面查看。
            可在"我的"界面查看。
          </div>

<!--        <a-button @click="this.verified=false">测试</a-button>-->
        </template>
        <template v-else>
          如果您是受邀参与公测，可在下方输入您的专属邀请码。
          <br>
          验证通过后将获得 <img style="width: 24px" src="https://a.apps.vip/icons/test_sm.png"> 受邀用户勋章。
          <div>
            <a-input class="mt-2 mb-2 w-1/2" placeholder="请输入邀请码" style="background: var(--secondary-bg)"
                     v-model:value="code"></a-input>
          </div>
          <div>
            <a-button @click="activeCode" type="primary">激活</a-button>
          </div>
        </template>

      </vueCustomScrollbar>
    </div>

  </div>

</template>

<script>
import { appStore } from '../../store'
import { mapState, mapActions, mapWritableState } from 'pinia'
import Template from '../../../user/pages/Template.vue'
import { Modal, message } from 'ant-design-vue'
import { codeStore } from '../../store/code'
import HorizontalPanel from '../../components/HorizontalCaptrue.vue'
import RayMedal from '../../components/small/RayMedal.vue'

export default {
  name: 'Invite',
  components: { RayMedal, HorizontalPanel, Template },

  data () {
    return {
      code: '',
      tabs: [{
        name: 'invite',
        title: '邀请好友'
      }, {
        name: 'verify',
        title: '受邀'
      }],
      tab: {
        name: 'invite'
      },
      marked: [],
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      codes: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: '邀请码',
          dataIndex: 'key',
          key: 'key',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: '生成日期',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '使用日期',
          dataIndex: 'updateTime',
          key: 'updateTime',
        },
        {
          title: '受邀用户',
          dataIndex: 'user',
          key: 'user',
        },
      ]
    }
  },
  mounted () {
    this.loadCodes().then()
    if (this.$route.params.tab) {
      this.tab = {
        name: this.$route.params.tab
      }
    }
    this.verify(this.userInfo.uid)

  },
  computed: {
    ...mapState(appStore, ['userInfo']),
    ...mapWritableState(codeStore,['verified']),
    totalHours () {
      return (this.userInfo.onlineGradeExtra.cumulativeHours)
    },

    canExchange () {
      return (this.userInfo.onlineGradeExtra.cumulativeHours / 200).toFixed(0)
    },
    exchanged () {
      return this.codes.length
    },
    leave () {
      return this.canExchange - this.exchanged
    },
    invitedUsers () {
      let invited = this.codes.filter(code => {
        return code.uid
      })
      return invited.map(code => {
        return code.userInfo
      })
    }

  },
  methods: {
    ...mapActions(codeStore, ['exchange', 'listCodes','verify','active']),
    ...mapActions(appStore, ['showUserCard']),
    goToMy(){
      this.$router.push({
        name:'socialMy'
      })
    },
    async activeCode () {
      if(!this.code){
        message.error('请输入邀请码')
        return
      }
      if(!this.userInfo){
        message.error('请登录后重试')
        return
      }
      let rs=await this.active(this.code, undefined,this.userInfo.uid)
      if(rs.code===1000){
        message.success('激活成功。')
        this.verified=true
      }else{
        message.error('激活失败，请更换有效邀请码。')
      }
      console.log(rs,'激活结果')
    },
    showCard (uid, userInfo) {
      this.showUserCard(uid, userInfo)
    },
    friendlyDate: tsbApi.util.friendlyDate,
    copy (text) {
      require('electron').clipboard.writeText(text)
      message.success('复制邀请码成功。')
    },
    mark (key) {
      let found = this.marked.indexOf(key)
      let mark = false
      if (found > -1) {
        this.marked.splice(found, 1)
        mark = false
      } else {
        this.marked.push(key)
        mark = true
      }
      localStorage.setItem('marked', JSON.stringify(this.marked))
      if (mark) {
        message.success({ content: '已为您标记此邀请码，再次标记取消', key: 'mark' })
      } else {
        message.success({ content: '已为您取消标记', key: 'mark' })
      }

    },
    async loadCodes () {
      let rs = await this.listCodes()
      if (rs.status) {
        this.codes = rs.data
      }
      let marked
      try {
        marked = JSON.parse(localStorage.getItem('marked'))
      } catch (e) {
        marked = []
      }

      if (marked === null) {
        marked = []
      }
      this.marked = marked
    },
    isMarked (key) {
      return this.marked.indexOf(key) > -1
    },
    confirmExchange () {
      Modal.confirm({
        content: '确认使用200小时在线时长兑换1枚邀请码？此操作无法撤回。兑换并不会减少你的在线时长以及影响你的在线等级，请放心。',
        okText: '确认兑换',
        onOk: async () => {
          let rs = await this.exchange()
          if (rs.status) {
            rs.data.forEach(item => {
              this.codes.unshift(item)
            })

            message.success('兑换成功。')
          } else {
            message.error('兑换失败，您已无法兑换邀请码。')
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .ant-table-tbody  {
    &:hover {
      background: red !important;
    }
  }

  .aUser {
    display: inline-block;
    margin-right: 10px;
    text-align: center;
    margin-bottom: 10px;
    width: 50px;
    font-size: 12px;
  }
/* .card {
  background: #252525;
}*/
</style>
