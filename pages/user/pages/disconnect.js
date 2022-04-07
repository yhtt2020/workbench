const tpl = `
<div>
  <h1 style="font-size: 18px;margin:auto;margin-top: 40px;text-align: center">
   {{title}}
  </h1>
  <p style="text-align: left;color: #999;padding: 20px">
      <span style="color: #333">
<!--      系统检测到当前空间已被<strong>其他设备占用</strong>。无法再保存当前空间。-->
{{description}}
      <br>
      您可以尝试重新连接，或者：<br>
离线使用：您可以使用离线模式继续使用空间，系统在后台自动尝试重连，成功后会恢复同步。<br>
切换到其他空间：下次切换到此空间时，系统会尝试将本地备份上传至云端。
</span>
  </p>
  <div  v-if="user || space" style="width: 400px;margin: auto;margin-bottom: 40px;background-color: rgba(241,241,241,0.48);padding: 10px;border-radius: 10px;">
  <a-row >
    <a-col v-if="user" :span="8" style="padding-right: 20px;text-align: center;padding-top: 10px">
      <div>
        <a-avatar :size="50" :src="user.avatar"></a-avatar>
      </div>
      <div>
        {{user.nickname}}
      </div>
    </a-col>
    <a-col v-if="space" :span="16" style="padding: 10px">
      <div style="margin-bottom: 10px">
        <span >{{space.name}}</span>
      </div>
      <div style="margin-bottom: 10px;font-size: 12px;color: #999">
        {{space.count_task}} 标签组 {{space.count_tab}}标签
      </div>
      <div style="margin-bottom: 10px;font-size: 12px">
        <span style="color: #999">最后成功同步时间：</span>{{new Date(space.sync_time).toLocaleString(undefined,{ month: 'long', day: 'numeric',hour: 'numeric', minute: 'numeric', second: 'numeric' })}}
      </div>
    </a-col>
  </a-row>
</div>

  <div>
    <a-row justify="center">
      <a-col  :span="6" style="text-align: center">
        <a-button type="primary"  @click="saveAndChange">尝试重新连接</a-button>
      </a-col>
      <a-col  :span="6"  style="text-align: center">

</a-col>
      <a-col  :span="6"  style="text-align: center">

        <a-dropdown>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item @click="switchToOtherSpace" key="1">切换到其他空间</a-menu-item>
      </a-menu>
    </template>
      <a-button @click="continueUse">继续离线使用 <DownOutlined /></a-button>
  </a-dropdown>
      </a-col>
    </a-row>
  </div>
</div>

`

const spaceModel = require('../../../src/model/spaceModel')
const ipc=require('electron').ipcRenderer
const disconnect = {
  template: tpl,
  data () {
    return {
      save: true,
      savePosition: 'cloud',
      user: null,
      space: null,
      title: '',
      fatal: true,//非致命意外
      description: ''
    }
  },
  async mounted () {
    try {
      let space = await spaceModel.getSpace(window.globalArgs['spaceId'])
      this.space = space
      this.user = space.userInfo
      console.log(space)
    } catch (e) {
      console.warn('无法获取到space')
    }
    this.title = window.globalArgs['title'] || '保存冲突，无法保存空间至云端'
    this.description = window.globalArgs['description'] || '系统检测到当前空间已被<strong>其他设备占用</strong>。无法再保存当前空间。'

  },
  methods: {
    /**
     * 切换到云空间，不保存
     */
    async changeWithoutSave () {
      await spaceModel.setUser(this.user).changeCurrent(this.space)
      ipc.send('closeUserWindow')
    },
    /**
     * 切换到云空间，保存
     */
    saveAndChange () {
      //todo 添加新一个空间到云端
      //todo 写入一次空间内容
      //todo 切换到这个空间
      //todo 关闭当前窗体
    },
    /**
     * 不保存直接
     */
    switchToOtherSpace () {
      this.$router.replace('/')
    },
    switchToBackup () {
      //todo 添加新一个空间到本地
      //todo 写入一次空间内容
      //todo 切换到这个空间
      //todo 关闭当前窗体
    },
    continueUse(){
      ipc.send('closeUserWindow')
    }
  }
}

module.exports = disconnect
