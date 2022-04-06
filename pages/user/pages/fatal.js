const tpl = `
<div>
  <h1 style="font-size: 18px;margin:auto;margin-top: 40px;margin-bottom:10px;text-align: center">
   {{title}}
  </h1>
  <p style="text-align: center;color: #999;padding: 20px">
      <span style="color: #333">
<!--      系统检测到当前空间已被<strong>其他设备占用</strong>。无法再保存当前空间。-->
{{description}}

      <br>
您可以选择放弃此备份空间，或者将备份空间以新空间的形式存储到云端或本地。
</span>
  </p>
  <div  v-if="user || space" style="width: 400px;margin: auto;margin-bottom: 20px;background-color: rgba(241,241,241,0.48);padding: 10px;border-radius: 10px;">
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
        <a-input style="padding-left: 0" :bordered="false"  size="small" v-model:value="space.name"></a-input>
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

  <div style="text-align: center;margin-bottom: 40px">
    <a-checkbox v-model:checked="save" size="small" default-value="true">将备份保存至</a-checkbox> <a-select size="small"
      v-model:value="savePosition"
      style="width: 120px">
      <a-select-option value="cloud">云端空间</a-select-option>
      <a-select-option value="local">本地空间</a-select-option>
    </a-select>
  </div>
  <div>
    <a-row justify="center">
      <a-col justify="center" :span="6" style="text-align: center">
        <a-popconfirm v-if="!save" placement="top" ok-text="确定放弃" cancel-text="再考虑一下" @confirm="changeWithoutSave">
          <template #title>
            <p>您是否确定放弃保存本地备份空间？<br>此操作将<strong style="color: red">删除本地备份</strong>空间。<br>建议您将当前空间保存至云端备份。</p>
          </template>
          <a-button type="primary">切换到最新的云端空间</a-button>
        </a-popconfirm>
        <a-button v-else type="primary" @click="saveAndChange">切换到最新的云端空间</a-button>
      </a-col>
      <a-col  :span="6" ></a-col>
      <a-col  :span="6"  style="text-align: center">
        <a-button v-if="save" @click="switchToBackup">切换到保存的备份空间</a-button>
         <a-popconfirm v-if="!save" placement="top" ok-text="确定放弃" cancel-text="再考虑一下" @confirm="switchToOtherSpace">
          <template #title>
            <p>您是否确定放弃保存本地备份空间？<br>此操作将<strong style="color: red">删除本地备份</strong>空间。<br>建议您将当前空间保存至云端备份。</p>
          </template>
        <a-button @click="switchToBackup">切换到其他空间</a-button>
         </a-popconfirm>
      </a-col>
    </a-row>
  </div>
</div>

`

const spaceModel = require('../../../src/model/spaceModel')
const fatal = {
  template: tpl,
  data () {
    return {
      save: true,
      savePosition: 'cloud',
      user: null,
      space: null,
      title: '',
      fatal:true,//非致命意外
      description: ''
    }
  },
  async mounted () {
    try{
      let space = await spaceModel.getSpace(window.globalArgs['spaceId'])
      this.space = space
      this.user = space.userInfo
      console.log(space)
    }catch (e) {
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
    }
  }
}

module.exports = fatal
