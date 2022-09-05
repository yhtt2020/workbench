<template>
  <a-layout style="overflow: hidden">
    <a-layout-sider  :width="230" style="background: #f1f1f1;height: 100vh;border-right: 1px solid #dadada;">
      <a-row style="padding: 10px">
        <a-col :span="12">
          <span style="font-size: 12px;color: grey">{{ spaces.length }} 个空间</span>
        </a-col>
        <a-col :span="12" style="text-align: right">
          <a-dropdown>
            <template #overlay>
              <a-menu >
                <a-menu-item @click.stop="()=>{}" v-if="this.user.uid===0" >
                  <a-checkbox @change="loadSpaces" @click.stop="()=>{}" v-model:checked="showBackup">显示离线空间</a-checkbox>
                </a-menu-item>
                <a-menu-item @click="importFromLocal" v-if="user.uid" key="1">
                  <import-outlined />
                  导入
                </a-menu-item>
                <a-menu-item v-if="user.uid!==0"  @click="setEnterPwd()" key="2">
                  <LockOutlined/>
                  设置密码
                </a-menu-item>
                <a-menu-item v-if="user.uid!==0 && !user.is_current" @click="deleteAccount(user.uid)" key="3">
                  <logout-outlined />
                  解绑帐号
                </a-menu-item>
              </a-menu>
            </template>
            <a-button size="small" @click="showCreateSpace" type="primary">
              创建
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </a-col>
      </a-row>

      <div v-if="loading">
      </div>
      <vue-custom-scrollbar :settings="settings" style="position:relative;height: calc(100vh - 45px)" >
        <SpaceList @reloadSpaces="loadSpaces" v-model:activeSpace="activeSpace" :spaces="spaces" :user="user" @setActive="setActive"></SpaceList>
      </vue-custom-scrollbar>
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="overflow: hidden">
        <div v-if="this.activeSpace.nanoid===''" style="padding: 40px">
          <a-result >
            <template #title>
              <h3 style="font-size: 18px">请选择空间</h3>
              <p style="font-size: 14px;margin-bottom: 10px"><zoom-in-outlined /> 单击：预览空间</p>
              <p style="font-size: 14px"><swap-outlined /> 双击：切换空间</p>
            </template>
            <template #extra>
              <a-button key="console" type="primary" @click="showCreateSpace">创建空间</a-button>
            </template>
          </a-result>


        </div>
        <div style="padding: 10px">
          {{ activeSpace.name }}
        </div>
          <vue-custom-scrollbar :settings="settings" style="position:relative;height:calc(100vh - 50px);padding:10px" >
          <TaskList v-if="activeSpace.nanoid!==''" :list="spaceData.state.tasks"  v-model:selectedKeys="selectedKeys"  ></TaskList>
          </vue-custom-scrollbar>

        <div>
          <a-modal
            centered
            v-model:visible="visibleCreate"
            title="创建空间"
            ok-text="创建"
            cancel-text="取消"
            width="300px"
            @ok="doCreateSpace"
          >
            <p>输入空间名称</p>
            <p>
              <a-input ref="spaceNameInput" @keyup.enter="doCreateSpace" v-model:value="newSpaceName"
                       placeholder="空间名称"></a-input>
            </p>
            <p></p>
          </a-modal>
          <a-modal
            centered
            v-model:visible="visibleSetEnterPwd"
            title="设置空间密码"
            ok-text="设置"
            cancel-text="取消"
            width="300px"
            @ok="doSetEnterPwd"
          >
            <p>请设置新的空间密码，留空则不再使用空间密码。</p>
            <p>
              <a-input-password ref="enterPwdInput" @keyup.enter="doSetEnterPwd" v-model:value="newEnterPwd"
                                placeholder="留空不使用"></a-input-password>
            </p>
            <p></p>
          </a-modal>
          <a-modal
            centered
            v-model:visible="visibleImport"
            title="导入本机空间"
            ok-text="导入"
            cancel-text="取消"
            width="400px"
            @ok="doImportSpaces"
          >
            <p>请选择本机空间导入，可一次导入多个空间。<br>注意：如果导入<strong>当前使用的空间</strong>，后续的改动<strong>不会被同步</strong>到新导入的云端空间。</p>
            <p>
              <a-select
                mode="multiple"
                placeholder="可多选"
                style="width: 100%"
                v-model:value="selectedImportSpaces"
                :options="localOptions"
              ></a-select>
            </p>
          </a-modal>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>


</template>

<script>

const { userModel, spaceModel } = window.$models
import { message ,Modal} from 'ant-design-vue'
import SpaceList from '../components/SpaceList.vue'
import TaskList from '../components/TaskList.vue'

import {ZoomInOutlined,SwapOutlined,DownOutlined,ImportOutlined,LockOutlined,LogoutOutlined} from '@ant-design/icons-vue'
import vueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
export default {
  name: 'SpaceSelect',
  components:{
    vueCustomScrollbar,
    SpaceList,
    TaskList,
    ZoomInOutlined,SwapOutlined,DownOutlined,ImportOutlined,LockOutlined,LogoutOutlined
  },
  data () {
    return {
      settings: {
        swipeEasing:true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
      user: {
        uid: 0,
        spaces: [],
        clientId: '',
        user_info: {}
      },
      spaces: [],
      activeSpace: {nanoid:''},
      spaceData:{
        state:{
          tasks:[]
        }
      },
      selectedKeys:[],

      currentSpace: {},
      pwd: '',
      //导入
      visibleImport: false,
      localSpaces: [],
      localOptions: [],
      selectedImportSpaces: [],

      //创建
      visibleCreate: false,
      newSpaceName: '',



      //设置空间密码
      visibleSetEnterPwd: false,
      showSetEnterPwd: true,
      newEnterPwd: '',

      clientId: '',

      showBackup: false,//默认不显示备份空间
      loading: true,

      tipCopyRead: '0',
    }
  },
  async beforeRouteUpdate (to, from) {
    this.init(to.params.uid)
  },
  async mounted () {
    let uid = Number(this.$route.params.uid)
    this.init(uid)
  },
  computed:{

  },
  methods: {
    async init (uid) {
      this.tipCopyRead = localStorage.getItem('tipCopyRead')
      let user = {}
      if (uid == 0) {
        user = {
          user_info: {
            nickname: '本机空间',
            avatar: '../../icons/logo128.png',
          },
          spaces: [],
          uid: 0
        }
        this.user = user
      } else {
        //网络用户
        user = await userModel.get({ uid: uid })
        if (user) {
          this.user = user
        } else {
          console.warn(user)
          message.error('获取用户信息失败，登录信息过期或用户帐号异常。请尝试解绑用户后重新登陆帐号。')
          this.$router.go(-1)
          return //如果异常，退回上一页，防止后续出错
        }

      }
      this.user.clientId = userModel.getClientId()
      try {
        this.currentSpace = await spaceModel.getCurrent()
      } catch (e) {

      }
      await this.loadSpaces()
      this.resetActive()
      this.loading = false
    },
    setTipCopyRead () {
      localStorage.setItem('tipCopyRead', '1')
    },
    setEnterPwd () {
      this.visibleSetEnterPwd = true
    },
    doSetEnterPwd () {
      if (this.newEnterPwd !== '') {
        Modal.confirm({
          title: '修改密码确认',
          content: '是否确认设置新的密码？请牢记密码，一旦忘记，则只能解绑后重新绑定帐号。',
          centered: true,
          okText: '确认设置密码',
          cancelText: '取消',
          onOk: async () => {
            try {
              userModel.setEnterPwd(this.newEnterPwd, this.user.uid)
              this.user.enterPwd = this.newEnterPwd
              this.visibleSetEnterPwd = false
              message.success('访问密码设置成功。')

            } catch (e) {
              console.warn(e)
              message.error('设置访问密码失败。未知异常。')
            }
          }
        })
      } else if (this.newEnterPwd === '' && this.user.enterPwd !== '') {
        //原来有密码，清空了密码
        Modal.confirm({
          title: '删除密码确认',
          content: '是否确认删除空间密码？',
          centered: true,
          okText: '删除',
          cancelText: '取消',
          onOk: async () => {
            try {
              userModel.setEnterPwd(this.newEnterPwd, this.user.uid)
              this.user.enterPwd = this.newEnterPwd
              this.visibleSetEnterPwd = false
              message.success('删除访问密码成功。')

            } catch (e) {
              console.warn(e)
              message.error('删除访问密码失败。未知异常。')
            }
          }
        })
      }
    },
    /**
     * 导入本机空间
     */
    async importFromLocal () {
      //todo loadLocalSpaces()
      let spaces = await spaceModel.getLocalSpaces()
      this.localOptions = []
      spaces.forEach((space) => {
        space.data = JSON.parse(space.data)
        if (space.data) {
          if (space.nanoid === this.currentSpace.spaceId) {
            this.localOptions.push({
              label: space.name + '（ ' + space.data.state.tasks.length + ' 标签组）← 当前',
              value: space.nanoid
            })
          } else
            this.localOptions.push({
              label: space.name + '（ ' + space.data.state.tasks.length + ' 标签组）',
              value: space.nanoid
            })
          this.localSpaces.push(space)
        }
      })

      this.visibleImport = true
    },
    /**
     * 导入空间
     * @returns {Promise<void>}
     */
    async doImportSpaces () {
      let currentIndex = undefined
      try {
        let selectedSpaces = this.selectedImportSpaces.map(space => {
          let item = this.localSpaces.find((item) => {
            return item.nanoid === space
          })
          return {
            data: item.data,
            name: item.name + '_导入'
          }
        })
        if (selectedSpaces.length === 0) {
          message.error('请选择需要导入的空间。')
          return
        }
        currentIndex = this.selectedImportSpaces.find((op => {
          if (op === this.currentSpace.spaceId)
            return true
        }))

        let result = await spaceModel.setUser(this.user).importFromLocal(selectedSpaces)
        if (result.status === 1) {
          this.visibleImport = false
          this.selectedImportSpaces = []
          await this.loadSpaces()
          if (currentIndex) {
            Modal.info({ title: '空间导入成功', content: '导入空间成功。导入的空间中包括当前使用中的空间，后续对当前空间的改动不会再影响到到导入后的云端空间。' })
          } else {
            message.success('导入空间成功。')
          }
        } else {
          message.error('导入空间失败。' + result.data)
        }
      } catch (e) {
        console.warn(e)
        message.error('导入空间失败。未知异常。')
      }
    },
    async loadSpaces () {
      let spaces = []
      //下面开始获取用户空间
      try {
        let result = await spaceModel.setUser(this.user).getUserSpaces({ showBackup: this.showBackup })

        if (result.status === 1) {
          spaces = result.data
          if (this.user.uid) {
            spaces = spaces.map((sp) => {
              sp.id = sp.nanoid
              return sp
            })
          }
        } else {
          message.error('获取用户空间失败。失败原因：' + result.info)
          this.$router.go(-1)
          return
        }
      } catch (e) {
        if (e.toString().indexOf('ECONNREFUSED') > -1) {
          console.warn(e)
          message.error('无法连接到服务器，服务器异常，请稍后再试。')
        } else {
          message.error('获取用户空间失败，可尝试在帐号上右键，选择【解绑账户】，解绑后再重新登录。')
        }

        this.$router.go(-1)
        return
      }
      this.spaces = spaces
      // if(spaces.length>0){
      //   this.setActive(spaces[0])
      // }
    }
    ,
    goLogin () {
      ipc.send('login')
      //https://s.apps.vip/login?response_type=code&client_id=10001&state=1
    }
    ,
    async doCreateSpace () {
      try {
        let result = await spaceModel.setUser(this.user).addSpace({ name: this.newSpaceName })
        if (result.status === 1) {
          this.newSpaceName = ''
          message.success('创建空间成功。')
          this.loadSpaces()
          this.visibleCreate = false
        } else {
          message.error('空间名称长度在1-10个汉字，请重新输入。')//获取真实的错误信息
          this.$refs.spaceNameInput.input.select()
        }

        //let result=await userApi.addSpace(this.newSpaceName,this.user)
        // if(result.code===1000){
        //   this.newSpaceName=''
        //   message.success('创建空间成功。')
        //   this.spaces.push(result.data)
        //   this.visibleCreate=false
        // }else{
        //   message.error('空间名称长度在1-10个汉字，请重新输入。')
        //   this.$refs.spaceNameInput.input.select()
        // }
      } catch (e) {
        message.error('创建空间失败，失败原因：')
        console.warn(e)

      }
    }
    ,
    showCreateSpace () {
      this.visibleCreate = true
      setTimeout(() => {
        this.$refs.spaceNameInput.input.focus()
      }, 200)
    },
    resetActive(){
      this.activeSpace ={nanoid:''}
    },
    async setActive (space) {
      this.activeSpace = space
      if(this.user.uid!==0){
        try{
          let spaceRs = await spaceModel.setUser(this.user).getSpace(space.nanoid)
          if(spaceRs.status===1){
            console.log('读入数据',spaceRs)
            this.spaceData=spaceRs.data.data
          }else{
            this.spaceData={}
          }
        }catch (e) {
          console.warn('载入失败')
        }

      }else{
        let spaceRs = await spaceModel.setUser(this.user).getSpace(space.nanoid)
        this.spaceData=JSON.parse(spaceRs.data)
      }

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
            this.$router.replace('/')
          }).catch(() => {
            message.error('解绑帐号失败。')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
