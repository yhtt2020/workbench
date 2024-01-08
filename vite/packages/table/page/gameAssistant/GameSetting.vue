<template>
  <div class="px-5 pt-3.5">
    <div class="h-20 set-bg rounded-lg flex flex-row items-center px-6 mb-4" style="width: 572px">
      <Icon style="height: 36px;width: 36px" icon="steam"></Icon>
      <div class="flex flex-col ml-4 w-2/3">
        <span class="set-title">Steam</span>
        <span v-if="steamLoginData.refreshToken">{{ userData.name }}</span>
        <span v-else style="color: var(--secondary-text);">绑定Steam帐号即可同步显示你的游戏数据</span>
      </div>
      <div class="set-bg ml-10 w-28 h-12 rounded-lg flex justify-center items-center pointer" @click="showBind">
        {{ steamLoginData.refreshToken ? '解绑' : '绑定' }}
      </div>
    </div>
    <div class="h-20 set-bg rounded-lg flex flex-row items-center px-6 mb-4" style="width: 572px">
      <Icon style="height: 36px;width: 36px" icon="shijian3dian"></Icon>
      <div class="flex flex-col ml-4 w-2/3">
        <span class="set-title">最近游玩的游戏记录</span>
        <span style="color: var(--secondary-text);">清空游玩记录不会删除对应的游戏桌面。</span>
      </div>
      <div class="set-bg ml-10 w-28 h-12 rounded-lg flex justify-center items-center pointer" @click="clearRecent">
        清空记录
      </div>
    </div>
    <div class="h-20 set-bg rounded-lg flex flex-row items-center px-6 mb-4" style="width: 572px">
      <Icon style="height: 36px;width: 36px" icon="desktop"></Icon>
      <div class="flex flex-col ml-4 w-2/3">
        <span class="set-title">游戏桌面</span>
        <span style="color: var(--secondary-text);">每个游戏的独立桌面</span>
      </div>
      <div class="set-bg ml-10 w-28 h-12 rounded-lg flex justify-center items-center pointer" @click="removeAllDesk">
        删除全部桌面
      </div>
    </div>
    <div class="h-20 set-bg rounded-lg flex flex-row items-center px-6 mb-4" style="width: 572px">
      <Icon style="height: 36px;width: 36px" icon="position"></Icon>
      <div class="flex flex-col ml-4 w-2/3">
        <span class="set-title">折扣地区</span>
        <span style="color: var(--secondary-text);">选择默认的折扣地区</span>
      </div>
      <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
                @change="getRegion($event)" class="w-56 h-auto rounded-lg  text-xs s-item" size="large"
                :bordered="false"
                v-model:value="area">
        <a-select-option v-for="item in region" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </div>
    <div class="h-20 set-bg rounded-lg flex flex-row items-center px-6 mb-4" style="width: 572px">
      <Icon style="height: 36px;width: 36px" icon="lianjie"></Icon>
      <div class="flex flex-col ml-4 w-2/3">
        <span class="set-title">启用代理</span>
        <span style="color: var(--secondary-text);">设置您的代理，提升登录成功率（推荐）</span>
      </div>

      <div class=" ml-6 w-28 h-12 rounded-lg flex justify-center items-center pointer"  >
        <a-select v-model:value="settings.proxy.type">
          <a-select-option value="none">不使用代理</a-select-option>
<!--          <a-select-option value="official">官方代理</a-select-option>-->
          <a-select-option value="http">http代理</a-select-option>
          <a-select-option value="socks5">socks5代理</a-select-option>
        </a-select>
      </div>
      <div class="set-bg ml-2 w-28 h-12 rounded-lg flex justify-center items-center pointer" @click="showProxySettings">
        设置
      </div>
    </div>

  </div>
  <Modal v-model:visible="proxyVisibility" v-show="proxyVisibility" animationName="bounce-in" :maskNoClose="false"
         :blurFlag="true" @click.stop>
    <div class="p-10" style="width:400px">
      <div class="line-title">代理设置（修改直接生效）</div>
      <div class="line">
        <a-row>
        <a-col :span="6" class="text-left">
          类型：
        </a-col>
          <a-col class="text-right" :span="18"><a-select v-model:value="settings.proxy.type">
            <a-select-option value="official">官方代理</a-select-option>
            <a-select-option value="none">不使用代理代理</a-select-option>
<!--            <a-select-option value="web">网页代理</a-select-option>-->
            <a-select-option value="http">http代理</a-select-option>
            <a-select-option value="socks5">socks5代理</a-select-option>
          </a-select></a-col></a-row>
      </div>
      <template v-if="settings.proxy.type==='http' || settings.proxy.type==='socks5'">
      <div class="line   "><a-row>
        <a-col :span="5" class="text-left">
        地址：
        </a-col>
        <a-col :span="19">
          <a-input class="w-full" v-model:value="settings.proxy.address"></a-input>
        </a-col>
      </a-row></div>
      <div class="line"><a-row>
        <a-col :span="5"  class="text-left">
          端口：
        </a-col><a-col :span="19"> <a-input  class="w-full"  v-model:value="settings.proxy.port"></a-input></a-col></a-row>
      </div>
      <div class="line"><a-row>
        <a-col :span="5"  class="text-left">
          用户名：
        </a-col><a-col :span="19"><a-input v-model:value="settings.proxy.userName"></a-input></a-col>
      </a-row></div>
      <div class="line"><a-row>
        <a-col :span="5"  class="text-left">
          密码：
        </a-col><a-col :span="19"><a-input-password v-model:value="settings.proxy.password"></a-input-password></a-col>
      </a-row></div>
      </template>
    </div>

  </Modal>
  <Modal v-model:visible="modalVisibility" v-show="modalVisibility" animationName="bounce-in" :maskNoClose="true"
         :blurFlag="true" @click.stop>
    <div class="flex flex-col p-6 xt-text" @click.stop>
      <div class="mx-auto">绑定Steam</div>
      <HorizontalPanel :navList="loginTypeList" v-model:selectType="loginType" class="mt-4 mx-auto"
                       bgColor="drawer-item-select-bg"></HorizontalPanel>
      <div class="mt-3 mb-0 pl-2">
        <ExclamationCircleFilled/>
        普通登录支持邮箱验证和手机app授权。<br>
        网络不好建议设置代理！ steam302用户请看-><a style="color:var(--secondary-text);" target="_blank"
                                               href="https://www.yuque.com/tswork/mqon1y/kvinb8xbzw2eaa2e">技术说明</a>
      </div>
      <div class=" mt-3">
        <a-input v-model:value="userName" placeholder="用户名（非邮箱）" class="no-drag rounded-lg h-12 mx-auto"
                 spellcheck="false" style="  width: 328px;background:var(--secondary-bg);" @click.stop/>
      </div>
      <div class=" mt-6">
        <a-input-password @keyup.enter="bindSteam" v-model:value="password" class="no-drag  rounded-lg h-12  mx-auto"
                          placeholder="密码" style="width: 328px;background: var(--secondary-bg);" @click.stop/>
      </div>
      <div class=" mt-6" v-show="loginType.name==='phone'">
        <a-input  spellcheck="false" @keyup.enter="bindSteam" v-model:value="authCode" class="no-drag   rounded-lg h-12  mx-auto" placeholder="令牌"
                 style="width: 328px;background: var(--secondary-bg);text-transform: uppercase" @click.stop/>
      </div>
      <div class=" mt-6" v-show="mailBoxShow&&loginType.name!=='phone'">
        <a-input v-model:value="mailBoxAuthCode" class="no-drag   rounded-lg h-12  mx-auto" placeholder="邮箱验证码"
                 style="width: 328px;background: var(--secondary-bg);" @click.stop/>
      </div>
      <div class="flex justify-between mt-6">
        <div class="s-item  h-12 rounded-lg flex justify-center items-center pointer w-40"
             style="color:var(--primary-text);"
             @click="cancelLogin">
          取消
        </div>
        <div class="s-item  h-12 rounded-lg flex justify-center items-center pointer w-40" style="background: #508BFE"
             @click.stop="bindSteam">
          {{ loginLoading ? '登录中....' : '登录' }}
        </div>
      </div>
    </div>
  </Modal>
  <Modal v-model:visible="loadingUserInfoVisible" v-if="loadingUserInfoVisible" :blurFlag="true" :mask-no-close="true">
    <div class="py-5 px-10">
      <div class="mb-4 text-lg">
        当前登录账号：{{logUserName}}<br>
        正在获取用户信息…
      </div>

      <div>
        <a-row :gutter="10">
          <a-col :span="12">
            <a-button block @click="retry()" type="primary">重试</a-button>
          </a-col>
          <a-col :span="12">
            <a-button block @click="cancelLoadUserInfo" >放弃</a-button>
          </a-col>
        </a-row>


      </div>
    </div>

  </Modal>
</template>

<script>
import { mapState, mapActions, mapWritableState } from 'pinia'
import { Modal as antModal } from 'ant-design-vue'
import Modal from '../../components/Modal.vue'
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import { message } from 'ant-design-vue'
import { cardStore } from '../../store/card'
import { steamUserStore } from '../../store/steamUser'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'

import {completeTask} from "../../apps/task/page/branch/task"
const { steamSession, path, https,steamUser } = $models
let LoginSession
let EAuthTokenPlatformType
if(steamSession){
  LoginSession = steamSession.LoginSession
  EAuthTokenPlatformType= steamSession.EAuthTokenPlatformType
}


export default {
  name: 'gameSetting',
  components: { ExclamationCircleFilled, Modal, HorizontalPanel },
  data () {
    return {
      retry:{},
      loadingUserInfoVisible:false,
      logUserName:'',
      session: {},//会话
      mailBoxShow: false,
      loginTypeList: [{ title: '普通登录', name: 'mailBox' }, { title: '手机令牌离线登录', name: 'phone' }],
      loginType: { title: '邮箱验证', name: 'mailBox' },
      loginLoading: false,
      userName: '',
      password: '',
      mailBoxAuthCode: '',
      authCode: '',
      modalVisibility: false,
      proxyVisibility:false,
      area: '国区',
      region: [
        {
          id: 'us',
          name: '美国'
        },
        {
          id: 'ca',
          name: '加拿大'
        },
        {
          id: 'gb',
          name: '英国'
        }, {
          id: 'fr',
          name: '法国'
        }, {
          id: 'de',
          name: '德国'
        }, {
          id: 'it',
          name: '意大利'
        }, {
          id: 'jp',
          name: '日本',
        }, {
          id: 'cn',
          name: '国区',
        }, {
          id: 'br',
          name: '巴西',
        }, {
          id: 'in',
          name: '印度',
        }, {
          id: 'ru',
          name: '俄罗斯',
        }, {
          id: 'au',
          name: '澳大利亚',
        },
        {
          id: 'hk',
          name: '香港',
        },
        {
          id: 'ar',
          name: '阿根廷',
        }

      ],
    }
  },
  mounted () {

  },
  watch:{
    'settings.proxy':{
      handler(newVal){
        console.log('修改了设置')
        const user=window.client
        const {type,address,port,userName,password}=newVal

        //user.setOption('socksProxy',null)
        //user.setOption('webCompatibilityMode',false)

        switch  (type){
          case 'none':
            break
          case 'official':
            user.setOption('httpProxy','http://47.96.156.74:5890')
            break
          case 'http':
            if(userName || password){
              user.setOption('httpProxy',`http://${userName}:${password}@${address}:${port}`)
            }else{
              user.setOption('httpProxy',`http://${address}:${port}`)
            }
           user.httpProxy=`http://${address}:${port}`
            break;
          case 'socks5':
           user.setOption('socksProxy',`socks5://${userName}:${password}@${address}:${port}`)
            break;
          case 'web':
           // user.setOption('webCompatibilityMode',true)
        }
        console.log(user,'steamuser=')
        console.log('修改了设置',`http://${userName}:${password}@${address}:${port}`,`socks5://${userName}:${password}@${address}:${port}`)
      },
      deep:true,
      immediate:true
    }
  },
  computed: {
    ...mapState(steamUserStore, ['steamLoginData', 'userData']),
    ...mapWritableState(steamUserStore, ['recentGameList', 'desks','settings'])
  },
  methods: {
    ...mapActions(steamUserStore, ['setSteamLoginData', 'setUserData']),
    clearRecent () {
      antModal.confirm({
        centered: true,
        content: '确认清空游玩记录？此操作并不会删除对应的游戏桌面。但不可恢复。',
        onOk: () => {
          this.recentGameList = []
        }
      })
    },
    removeAllDesk () {
      antModal.confirm({
        centered: true,
        content: '确认删除全部的桌面？此操作非常危险，一旦操作就无法撤销！',
        onOk: () => {
          this.desks = {}
        },
        okText: '确认删除'
      })
    },
    cancelLoadUserInfo(){
      this.loadingUserInfoVisible=false
    },
    async loginSuccessCallback (session) {
      this.mailBoxShow=false
      message.info({
        content: `登录成功用户名 ${session.accountName}`,
      })
      // 支线任务点
      completeTask('Z0101')
      this.modalVisibility = false
      this.logUserName= session.accountName
      this.loadingUserInfoVisible=true

      try{
        this.retry=async () => {
          let webCookies = await session.getWebCookies()
          if (webCookies) {
            const steamLoginData = {
              accessToken: session.accessToken,
              refreshToken: session.refreshToken,
              webCookies: webCookies
            }
            console.log(steamLoginData, 'steamLoginData')
            steamUserStore().setSteamLoginData(steamLoginData)
          }
        }
        await this.retry()
        this.loadingUserInfoVisible=false
      }catch (e) {
        console.error(e)
        message.error({
          content:'获取用户信息失败。'
        })
      }
    },
    getProxyOptions(){
      const {type,address,port,userName,password}=this.settings.proxy
      switch  (type) {
        case 'official':
          return {
            httpProxy: `http://47.96.156.74:5890`
          }
        case 'none':
          return {}
          break
        case 'http':
          // if(userName || password){
          //   user.setOption('httpProxy',`http://${userName}:${password}@${address}:${port}`)
          // }else{
          //   user.setOption('httpProxy',`http://${address}:${port}`)
          // }
          // user.httpProxy=`http://${address}:${port}`
          return {
            httpProxy: `http://${userName}:${password}@${address}:${port}`
          }
        case 'socks5':
          return { 'socksProxy': `socks5://${userName}:${password}@${address}:${port}` }
      }

    },
    showBind(){
      const options=this.getProxyOptions()
      options.webCompatibilityMode=false
      options.protocol=1
      options.localPort=57760
      console.log(options,'参数')
      let session = new LoginSession(EAuthTokenPlatformType.SteamClient,options)
      session.on('authenticated', async () => {
        await this.loginSuccessCallback(session)
      })
      window.steamSession = session
      this.clickBind()
    },
    cancelLogin(){
      this.modalVisibility = false;
      this.mailBoxShow=false
      this.loginLoading=false
    },
    showProxySettings(){
      this.proxyVisibility=true
    },
    clickBind () {
      if (this.steamLoginData.refreshToken === '') {
        this.modalVisibility = true
      } else {
        this.setSteamLoginData({
          accessToken: '',
          refreshToken: '',
          webCookies: ''
        })
        this.setUserData({})
      }
    },
    getRegion (e) {
      console.log(e)
    },
    mailBox () {
      window.steamSession.submitSteamGuardCode(this.mailBoxAuthCode)
    },
    errorParse (str) {
      str = str.toLowerCase()
      if (str.indexOf('invalidpassword') > -1) {
        return '用户名或密码错误'
      } else if (str.indexOf('timedout') > -1) {
        return '连接超时，请检查网络（steam302用户请看技术细节，需做额外处理）'
      } else {
        return str
      }
    },
    async bindSteam () {
      if (this.loginLoading === true) return
      this.loginLoading = true
      switch (this.loginType.name) {
        case'mailBox':
          if (this.mailBoxShow !== true) {
            console.log(this.session, '个人session')
            console.log(this.userName)
            console.log(this.password)
            window.steamSession.startWithCredentials({
              accountName: this.userName,
              password: this.password,
            }).then((res) => {
              message.success('验证成功，steam已向您的邮箱发送验证码，请注意查收。或者使用手机app进行授权。')
              this.mailBoxShow = true
            }).catch(err => {
              console.error(err)
              antModal.error({
                content: '登录失败，失败原因：' + this.errorParse(String(err)),
                centered: true
              })
            }).finally(() => {this.loginLoading = false})
          } else {
            window.steamSession.submitSteamGuardCode(this.mailBoxAuthCode).then((res) => {
              message.info({
                content: '登录成功',
              })
              this.userName = ''
              this.password = ''
              this.mailBoxAuthCode = ''
              this.authCode = ''
            }).catch(err => {
              console.warn(err)
              message.error({
                content: '邮箱错误',
              })
            }).finally(() => {
              this.loginLoading = false
              this.modalVisibility = false
            })
          }
          break
        case'phone':
          window.steamSession.startWithCredentials({
            accountName: this.userName,
            password: this.password,
          }).then((res) => {
            window.steamSession.submitSteamGuardCode(this.authCode).then(res => {
            }).catch(err => {
             // console.error(err)
              message.error({
                content: '令牌错误'
              })
              return
            })
          }).catch(err => {
            console.error(String(err))
            if(String(err).includes('ETIMEDOUT')){
              message.error({
                    content: '服务器超时',
                  })
            }if(String(err).includes('ECONNRESET')){
              message.error({
                content: '连接错误',
              })
            }else{
              message.error({
                content: '用户或密码错误',
              })
            }
            // if(err.includes('ETIMEDOUT')){
            //   message.error({
            //     content: '服务器超时',
            //   })
            //   return
            // }


          }).finally(() => {this.loginLoading = false})
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.set-bg {
  background: var(--primary-bg);
  color: var(--primary-text);
}

.set-title {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 23.17px;
  font-family: PingFangSC;
  color: var(--primary-text);
}

</style>
