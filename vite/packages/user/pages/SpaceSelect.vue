<template>
  <a-layout style="overflow: hidden">
    <a-layout-sider  :width="230" style="background: #f1f1f1;height: 100vh;border-right: 1px solid #dadada;">
      <a-row style="padding: 10px">
        <a-col :span="12">
          <span style="font-size: 12px;color: grey">{{ spaces.length }} 个空间</span>
        </a-col>
        <a-col :span="12" style="text-align: right">
          <a-button @click="showCreateSpace" type="primary" size="small">创建</a-button>
        </a-col>
      </a-row>

      <div v-if="loading">
      </div>

      <ul style=" overflow-y: auto;overflow-x:hidden;height: calc(100vh - 30px)" v-else class="space-list custom-scroller">
        <a-dropdown v-for="space,index in spaces" :trigger="['contextmenu']">
          <li @dblclick="switchSpace(space)" :class="{'active':this.activeSpace.nanoid===space.nanoid}" @click="setActive(space)">
          <div class="card">
            <a-row>
              <a-col :span="4">
                <a-avatar :size="24" shape="square" :src="getSpaceIcon(space)">
                </a-avatar>
              </a-col>
              <a-col :span="20">
                <div class="text-more" :title="space.name">{{ space.name }}</div>
              </a-col>
            </a-row>
            <a-row>
              <span class="info">{{ space.count_task }} 标签组 {{ space.count_tab }}标签</span>
            </a-row>
            <a-row>
              <span class="time" v-html="dateTime(space.sync_time)"></span>

            </a-row>
            <div v-if="space.client_id"><a-tag ><desktop-outlined /> {{space.client_id}}</a-tag></div>
          </div>
        </li>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="showRenameSpace(space)" :key="'rename_'+index">重命名</a-menu-item>
            <a-menu-item @click="copySpace(space)" :key="'rename_'+index">复制</a-menu-item>
            <a-menu-item @click="deleteSpace(space)" :key="'delete_'+index">删除</a-menu-item>
          </a-menu>
        </template>
        </a-dropdown>
      </ul>

    </a-layout-sider>
    <a-layout>
      <a-layout-content style="overflow: hidden">
        <div v-if="!this.activeSpace.nanoid" style="padding: 40px">
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
        <div class="custom-scroller" style="height: calc(100vh - 50px);overflow-y: auto;padding: 10px;">

          <TaskList v-if="activeSpace.nanoid" :list="spaceData.state.tasks"  v-model:selectedKeys="selectedKeys"  ></TaskList>
        </div>

        <div>
          <div style="text-align: center">
          </div>
          <div v-if="user.uid" style="float: right;position: absolute;right: 10px;top: 10px;">
            <a-button @click="importFromLocal" size="small">导入</a-button>
          </div>
          <div v-else style="float: right;position: absolute;right: 20px;top: 20px;">
            <a-checkbox @change="loadSpaces" v-model:checked="showBackup">显示离线空间</a-checkbox>
          </div>

          <div style="position: absolute;bottom: 10px;width: 100%;padding: 30px;padding-bottom: 15px">
            <!--    <div style="float: left;"><a-button size="small" shape="round">隐私空间</a-button></div>-->
            <div style="float:right;width: 200px;text-align: right">
              <a-button v-if="user.uid!==0" @click="setEnterPwd()" style="margin-right: 10px">设置密码</a-button>
              <a-button v-if="user.uid!==0" @click="deleteAccount(user.uid)">解绑帐号</a-button>
            </div>
          </div>
          <a-modal
            centered
            v-model:visible="visibleRename"
            title="空间重命名"
            ok-text="修改"
            cancel-text="取消"
            width="300px"
            @ok="doRenameSpace"
          >
            <p>输入空间新名称</p>
            <p>
              <a-input ref="spaceRenameInput" @keyup.enter="doRenameSpace" v-model:value="spaceRename"
                       placeholder="新空间名"></a-input>
            </p>
            <p></p>
          </a-modal>
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
import cA from '../../../../../vue-color-avatar/dist/assets/html2canvas.esm.0488f9f9'

const { userModel, spaceModel } = window.$models
import { message ,Modal} from 'ant-design-vue'
import TaskList from '../components/TaskList.vue'
import { createVNode } from 'vue'
import {ZoomInOutlined,SwapOutlined,DesktopOutlined} from '@ant-design/icons-vue'

export default {
  name: 'SpaceSelect',
  components:{
    TaskList,ZoomInOutlined,SwapOutlined,DesktopOutlined
  },
  data () {
    return {
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

      //修改<a-modal

      visibleRename: false,
      renamingSpace: null,
      spaceRename: '',

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
    getSpaceIcon(space){
      let icon='/icons/box.svg'
      //todo 支持自定义图标
      return icon
    },
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
            window.Modal.info({ title: '空间导入成功', content: '导入空间成功。导入的空间中包括当前使用中的空间，后续对当前空间的改动不会再影响到到导入后的云端空间。' })
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
    dateTime (stringTime) {
      let date = new Date(stringTime)
      //return date.getFullYear()+'年'+date.getMonth()+'月'+date.getDate()+'日 '+date.getHours()+':'+date.getMinutes()
      let minute = 1000 * 60
      let hour = minute * 60
      let day = hour * 24
      let time1 = new Date().getTime() //当前的时间戳
      let time2 = Date.parse(new Date(stringTime)) //指定时间的时间戳
      let time = time1 - time2
      let result = null
      if (time < 0) {
        result = `<span style="color: black;font-weight: bold">刚刚</span>`
      } else if (time / day >= 3) {
        result = date.getMonth() + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes()
      } else if (time / day >= 2) {
        result = '前天' + date.getHours() + ':' + date.getMinutes()
      } else if (time / day >= 1) {
        result = '昨天' + date.getHours() + ':' + date.getMinutes()
      } else if (time / hour >= 1) {
        result = parseInt(time / hour) + '小时前'
      } else if (time / minute >= 1) {
        result = parseInt(time / minute) + '分钟前'
      } else {
        result = `<span style="color: black;font-weight: bold">刚刚</span>`
      }
      return result
    }
    ,
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
          this.spaces.push(result.data)
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
    }
    ,

    showRenameSpace (space) {
      this.visibleRename = true
      this.spaceRename = space.name
      this.renamingSpace = space
      setTimeout(() => {
        this.$refs.spaceRenameInput.input.select()
      }, 200)
      //     centered
      //     v-model:visible="visibleRenameCreate"
      //     title="空间重命名"
      //     ok-text="修改"
      //     cancel-text="取消"
      //     width="300px"
      //     @ok="doCreateSpace"
      //   >
      //     <p>输入空间新名称</p>
      //     <p><a-input ref="spaceRenameInput" @keyup.enter="doRenameSpace" v-model:value="spaceRename" placeholder="新空间名"></a-input></p>
      //     <p></p>
      //   </a-modal>
    }
    ,
    async doRenameSpace () {
      try {
        if (this.spaceRename === this.renamingSpace.name) {
          message.error('重命名的名称和原名称一致，请修改新名称。')
          return
        }
        if (this.spaceRename.trim() === '') {
          message.error('名称不能为空。')
          return
        }
        if (this.spaceRename.trim().length > 10) {
          message.error('名称不能超过10个汉字。')
          return
        }
        let result = await spaceModel.setUser(this.user).renameSpace(this.spaceRename.trim(), this.renamingSpace)
        if (result.status === 1) {
          message.success('重命名空间成功。')
          this.loadSpaces()
          this.visibleRename = false
        } else {
          message.error('空间名称长度在1-10个汉字，请重新输入。')//获取真实的错误信息
          this.$refs.spaceRenameInput.input.select()
        }
      } catch (e) {
        message.error('重命名空间失败，未知错误。')
        console.warn(e)

      }
    }
    ,

    /**
     * 复制一个空间，右键菜单
     * @param space
     */
    async copySpace (space) {
      let result = await spaceModel.setUser(this.user).copy(space)
      if (result.status === 1) {
        message.success('复制空间成功')
        this.loadSpaces()
      } else {
        message.error('复制空间失败。')
      }
    }
    ,
    deleteSpace (space) {
      if (space.isUsing || space.isOtherUsing) {
        message.info('不可删除正在使用中的空间。')
        return
      }

      Modal.confirm({
        title: '删除空间确认',
        content: '是否确认删除 【' + space.name + '】 ？空间一旦被删除将无法恢复，所有标签组的设置将丢失。请务必确认后果。',
        centered: true,
        okText: '我已知晓后果，仍要删除',
        cancelText: '取消',
        onOk: async () => {
          try {
            let result = await spaceModel.setUser(this.user).deleteSpace(space)
            if (result.status) {
              message.success('删除空间成功。')
              await this.loadSpaces()
            } else {
              message.error('删除空间失败。')
            }
          } catch (e) {
            console.warn(e)
            message.error('删除空间失败。未知异常。')
          }
        }
      })
    }
    ,
    async doChangeSpaceCloud (space) {
      try {
        let result = await spaceModel.setUser(this.user).changeCurrent(space)
        if (result.status === 1) {
          message.success('切换使用空间成功。')
        } else {
          message.error('切换使用空间失败。')
        }
      } catch (e) {
        console.warn(e)
        message.error('切换使用空间失败。意外错误。')
      }

    }
    ,
    async switchSpace (space) {
      if (this.user.uid === 0) {
        Modal.confirm({
          title: '切换到本地空间',
          content: '是否更改当前空间，更改空间将重载浏览器，可能导致您网页上未保存的内容丢失，请确认已经保存全部内容。切换本地空间并不会更改当前登录帐号。',
          centered: true,
          okText: '我已保存，切换空间',
          cancelText: '取消',
          onOk: async () => {
            spaceModel.setAdapter('local').changeCurrent(space)
          }
        })
      } else {
        if (space.isSelfUsing) {
          if (space.disconnect) {
            Modal.confirm({
              title: '重新连接',
              content: '是否尝试重新连接此空间？',
              centered: true,
              okText: '重新连接',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          } else {
            message.info('不可切换到当前使用中的空间。')
          }
          return
        }
        if (space.isOtherUsing) {
          if (space.online) {
            Modal.confirm({
              title: '此空间正忙',
              content: '此空间正在被其他设备使用，如若切换到此空间，可能造成其他设备未同步的标签组丢失。是否仍然要强行切换？这将导致该设备上的浏览器强制下线。',
              centered: true,
              okText: '我已明确，切换空间',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          } else {
            Modal.confirm({
              title: '此空间使用设备异常离线',
              content: createVNode('div', {},
                [
                  createVNode('p', {}, '此空间正在被其他设备使用，但是系统检测到此设备可能已经因为网络或者其他原因而离线。'),
                  createVNode('p', {}, '所以此设备上可能存在未保存的标签组。如果切换到此空间，可能造成未保存的内容丢失。'),
                  createVNode('p', {}, '建议到此设备商重新连接后正常关闭浏览器，以防止数据冲突。'),
                  createVNode('p', {}, '如果您确认已无法恢复此设备的连接，则可切换到此设备在离线前最后一次保存的空间。'),
                  createVNode('p', {}, '当此设备再次连接网络，会自动将无法保存的空间保存为本地空间做备份。')
                ]
              ),
              centered: true,
              okText: '我已明确，切换空间',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          }

        } else {
          Modal.confirm({
            title: '切换到云端空间',
            content: '是否切换到云端空间？切换到云端空间后会同时更换当前帐号到此帐号。请务必确认您网页上的内容已经保存。否则可能丢失未保存内容。',
            centered: true,
            okText: '我已保存，切换空间',
            cancelText: '取消',
            onOk: async () => {
              this.doChangeSpaceCloud(space)
            }
          })
        }
      }
    }
    ,
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

    }
    ,

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
    ,
  }
}
</script>

<style scoped lang="scss">
.text-more {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.space-list {
  padding-left: 0;


  li {
    user-select: none;
    &:hover, &.active {
      .card {
        background: white;
        border-radius: 4px;
        border: 1px solid #c1c1c1;
      }
    }
    .card {
      border: 1px solid #f1f1f1;
      padding: 10px;
    }

    .info {
      font-size: 12px;
      color: grey;
      line-height: 24px;
    }

    border-bottom: 1px solid rgba(204, 204, 204, 0.51);
    margin-left: 0;
    list-style: none;
    padding: 5px;

    .time {
      font-size: 12px;
      color: grey;
    }
  }
}
</style>
