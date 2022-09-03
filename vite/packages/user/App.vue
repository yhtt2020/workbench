<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
const {userModel,spaceModel}=window.$models
import {Modal,message} from "ant-design-vue"
export default {
  components: {  },
  data () {
    return {
      currentTab:{name:'home'},
      tip: '',
      loaded: false,
      users: [
        // {
        //   nickname: '想天浏览器',
        //   avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic65.nipic.com%2Ffile%2F20150415%2F7828787_111539068000_2.jpg',
        //   spaces: [
        //     {
        //       name: '空间1'
        //     },
        //     {
        //       name: '空间2'
        //     }
        //   ]
        // },
      ],
      showOnStart: false
    }
  },
  async mounted() {
    this.users = await userModel.getAll()
    this.loaded = true
    if (window.globalArgs['tip']) {
      this.tip = window.globalArgs['tip']
    }
    window.ipc.on('loginCallback',async (e, args) => {
      message.success('成功添加帐号。')
      this.users = await userModel.getAll()
      this.enterAccount({ uid: args.data.userInfo.uid })
    })
  },
  methods:{
    goAddAccount () {
      this.currentTab={name:'add'}
      this.$router.push('/add')
    },
    deleteAccount (uid) {
      Modal.confirm({
        title: '解绑此帐号',
        content: '解绑帐号并不会影响帐号数据，仅仅是将本地帐号退出。但是退出后无法再使用此帐号下的所有空间。',
        centered: true,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          userModel.delete({ uid: uid }).then(() => {
            message.success('解绑帐号成功。')
            this.users.forEach((user, index) => {
              if (user.uid === uid) {
                this.users.splice(index, 1)
                return false
              }
            })
          }).catch(() => {
            message.error('解绑帐号失败。')
          })
        }
      })
    },
    async enterAccount (user) {
      //todo 先获取账号信息，确认账号可正常登录
      //网络用户
      if (user.uid) {
        try {
          let userInfo = await userModel.get({ uid: user.uid })
          if (userInfo) {
            let spacesResult = await spaceModel.setUser(userInfo).getUserSpaces()
            if (spacesResult.status !== 1) {
              message.error('服务器繁忙，获取用户空间失败，请10分钟后后再试。')
              return
            }
            //走到此处是没有异常了，可以正常执行下去
          } else {
            console.warn(user)
            message.error('获取用户信息失败，登录信息过期或用户帐号异常。请尝试解绑用户后重新登陆帐号。')
            return //如果异常，退回上一页，防止后续出错
          }
        } catch (e) {
          console.warn(e)
          if (e.code && e.code === 'ECONNREFUSED') {
            window.antd.Modal.info({title:'服务器维护',content:'服务器维护中，建议10分钟后再试。您可以先工作在本地空间。后续可手动导入本地空间到云端。',okText:'确定'})
            return
          }
          if (e.response && e.response.data.code === 1001) {
            message.error('用户登录信息过期，请点击【添加账号】重新登录。')
            return
          }
          message.error('意外错误。')
          return
        }
      }
      if (!!!user.password) {
        this.currentTab={name:'user_'+user.uid}
        this.$router.push({ name: 'space', params: { uid: user.uid } })
      } else{
        this.currentTab={name:'user_'+user.uid}
        this.$router.push({ name: 'pwd', params: { uid: user.uid } })
      }
    },
    goHome(){
      this.currentTab={name:'home'}
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<template>
  <a-layout style="height: 100vh">
    <a-layout-sider :width="150" class="left-bar"> <ul class="left-menu" style="">
      <li :class="{'active':this.currentTab.name==='home'}"  @click="goHome()" style="">
        <img class="side-icon" src="./assets/icon/home.svg"/> 欢迎
      </li>
      <li :class="{'active':this.currentTab.name=='user_0'}" @click="enterAccount({uid:0})" style="">
        <img class="side-icon" src="./assets/icon/local.svg"/> 本地空间
      </li>
    </ul>
      <h3 style="color: white;font-size: 12px;padding-left: 20px">账号</h3>
      <ul class="left-menu">
        <a-dropdown :trigger="['contextmenu']"  v-for="user in users">
          <li :class="{'active':this.currentTab.name==='user_'+user.uid}" @click="enterAccount(user)">
          <a-row type="flex">
            <a-col flex="40px">
              <a-avatar class="side-icon" :src="user.user_info.avatar"/>
            </a-col>
            <a-col flex="auto">
              <div class="text-more" :style="{'padding-top':!user.is_current?'4px':''}" style="width: 70px">{{ user.user_info.nickname }}</div>
              <div class="current-tag" v-if="user.is_current">
               使用中
              </div>
            </a-col>
          </a-row>
        </li>
          <template #overlay>
            <a-menu>
              <a-menu-item :disabled="user.is_current" @click="deleteAccount(user.uid)" key="deleteAccount">解绑帐号</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <li :class="{'active':this.currentTab.name==='add'}" @click="goAddAccount">
          <img class="side-icon" src="./assets/icon/adduser.svg"/>添加账号
        </li>
      </ul></a-layout-sider>
    <a-layout style="background: white">
      <a-layout-content> <router-view></router-view></a-layout-content>
    </a-layout>
  </a-layout>
  <!--  <div style="background:#F0F1F3">-->
  <!--    <IconList />-->
  <!--  </div>-->

</template>

<style scoped lang="scss">
.side-icon{
  width: 30px;height: 30px;margin-right: 10px
}
.left-bar {
  width: 140px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.83);
  color: white
}

.left-menu {
  padding-left: 0 ;
  li {
    font-size: 14px;
    user-select: none;
    list-style: none;
    padding: 5px 10px;
    margin: 10px ;
    cursor: pointer;
    &:hover,&.active{
      background: rgba(255,255,255,0.4);
      border-radius: 4px;
    }
  }
}
.current-tag{
  font-size: 12px;
  background: white;
  border-radius: 3px;
  color: black;
  padding: 0 4px;
  display: inline-block;
}
.text-more {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
