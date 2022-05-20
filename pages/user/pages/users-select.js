const tpl = `
<div>
 <h1 style="font-size: 18px;margin:auto;margin-top: 20px;margin-bottom:10px;text-align: center">
        选择帐号的空间
      </h1>

      <p style="text-align: center;color: #999">
      <span v-if="tip" style="color: red">
      {{tip}}
</span>
      <span v-else>
       <span style="text-align: center;color: #333">
        不同空间的标签组相互隔离<br>
      </span>
        适合不同家庭成员、公共电脑快速切换帐号。<br>也可用于工作、娱乐等不同场景。
</span>

      </p>
      <template v-if="loaded">
        <a-row style="width: 80%;margin: auto">
          <a-col @click="enterAccount(user)" v-for="user in users" :span="12">
           <a-dropdown :trigger="['contextmenu']">
            <a-row class="user-card">
              <a-col class="avatar-wrapper" :span="8" style="text-align: right">
                <a-avatar :size="60" :src="user.avatar"></a-avatar>
              </a-col>
              <a-col class="user-info" :span="16">
                <div>{{user.nickname}}</div>
                <p class="info-p" style="color: #1E90FF">云端空间</p>
              </a-col>
            </a-row>
            <template #overlay>
      <a-menu>
        <a-menu-item @click="deleteAccount(user.uid)" key="deleteAccount">解绑帐号</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
          </a-col>
          <a-col @click="enterAccount({uid:0})" :span="12">
            <a-row class="user-card">
              <a-col class="avatar-wrapper" :span="8" style="text-align: right">
                <a-avatar style="filter: grayscale(100%);" :size="60" src="../../icons/logo128.png"></a-avatar>
              </a-col>
              <a-col class="user-info" :span="16" >
                <div><strong>本机空间</strong></div>
                <p class="info-p">不与云端同步</p>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row @click="goAddAccount" class="user-card" style="border: 1px #ccc dashed">
              <a-col class="avatar-wrapper" :span="8" style="text-align: right">
                <a-avatar :size="60" style="background-color: #eeeeee"><template #icon><svg t="1648034469132" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19292" width="32" height="32"><path d="M928 736H800V608c0-16-12.8-32-32-32s-32 12.8-32 32v128H608c-16 0-32 12.8-32 32s12.8 32 32 32h128v128c0 16 12.8 32 32 32s32-12.8 32-32V800h128c16 0 32-12.8 32-32s-12.8-32-32-32zM768 320c0-140.8-115.2-256-256-256S256 179.2 256 320c0 89.6 44.8 169.6 115.2 214.4C192 592 64 761.6 64 960h64c0-211.2 172.8-384 384-384 140.8 0 256-115.2 256-256zM512 512c-105.6 0-192-86.4-192-192s86.4-192 192-192 192 86.4 192 192-86.4 192-192 192z" fill="#333333" p-id="19293"></path></svg></template></a-avatar>
              </a-col>
              <a-col class="user-info" :span="16" >
                <div>添加帐号</div>
                <p class="info-p">添加一个新帐号
                </p>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </template>
       <a-tooltip title="不勾选则每次打开浏览器自动读入上一次离开时的用户空间。" color="blue">
         <a-checkbox @change="switchShowOnStart" v-model:checked="showOnStart" style="position: absolute;bottom: 20px;right: 20px">每次启动的时候选择</a-checkbox>
      </a-tooltip>

</div>
`
const userModel = require('../../../src/model/userModel')
const configModel = require('../../../src/model/configModel')
const spaceModel = require('../../../src/model/spaceModel')
const UsersSelect = {
  template: tpl,
  data () {
    return {
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
  async mounted () {
    this.users = await userModel.getAll()
    this.loaded = true
    if (window.globalArgs['tip']) {
      this.tip = window.globalArgs['tip']
    }

    this.showOnStart = configModel.getShowOnStart()
  },
  async beforeRouteEnter (to, from) {
    this.users = await userModel.getAll()
  },
  methods: {
    switchShowOnStart () {
      configModel.setShowOnStart(this.showOnStart)
    },
    goAddAccount () {
      this.$router.push('/add')
    },
    deleteAccount (uid) {
      antd.Modal.confirm({
        title: '解绑此帐号',
        content: '解绑帐号并不会影响帐号数据，仅仅是将本地帐号退出。但是退出后无法再使用此帐号下的所有空间。',
        centered: true,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          userModel.delete({ uid: uid }).then(() => {
            window.antd.message.success('解绑帐号成功。')
            this.users.forEach((user, index) => {
              if (user.uid === uid) {
                this.users.splice(index, 1)
                return false
              }
            })
          }).catch(() => {
            window.antd.message.error('解绑帐号失败。')
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
              window.antd.message.error('服务器繁忙，获取用户空间失败，请10分钟后后再试。')
              return
            }
            //走到此处是没有异常了，可以正常执行下去
          } else {
            console.warn(user)
            window.antd.message.error('获取用户信息失败，登录信息过期或用户帐号异常。请尝试解绑用户后重新登陆帐号。')
            return //如果异常，退回上一页，防止后续出错
          }
        } catch (e) {
          console.warn(e)
          if (e.code && e.code === 'ECONNREFUSED') {
            window.antd.Modal.info({title:'服务器维护',content:'服务器维护中，建议10分钟后再试。您可以先工作在本地空间。后续可手动导入本地空间到云端。',okText:'确定'})
            return
          }
          if (e.response && e.response.data.code === 1001) {
            window.antd.message.error('用户登录信息过期，请点击【添加账号】重新登录。')
            return
          }
          window.antd.message.error('意外错误。')
          return
        }
      }
      if (!!!user.enterPwd) {
        this.$router.push({ name: 'space', params: { uid: user.uid } })
      } else
        this.$router.push({ name: 'enterPwd', params: { uid: user.uid } })
    }
  }
}

module.exports = UsersSelect
