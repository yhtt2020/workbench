const tpl = `
<div style="padding: 40px">
 <a-alert
    :message="title"
    type="warning"
    show-icon
  >
<template #description>
  {{description}}
<br>
<span v-if="!isDestroyed">
您可以选择放弃此备份空间，或者将备份空间以新空间的形式存储到云端或本地。
</span>
 <div  v-if="user || space" style="width: 400px;margin: auto;margin-bottom: 20px;margin-top:10px;background-color: rgb(255,255,255);padding: 10px;border-radius:6px;
 box-shadow: 0 0 8px rgba(72,72,72,0.21);
 ">
  <a-row >
    <a-col v-if="user" :span="8" style="padding-right: 20px;text-align: center;padding-top: 10px">
      <div>
        <a-avatar :size="50" :src="user.avatar"></a-avatar>
      </div>
      <div style="margin-top: 10px">
        {{user.nickname}}
      </div>
    </a-col>
    <a-col v-if="space" :span="16" style="padding: 10px">
      <div style="margin-bottom: 10px">
        <a-input id="backupNameInputRef" style="padding-left: 0;font-weight: bold" :bordered="false"  size="small"  v-model:value="backupName"></a-input>
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
</template>
</a-alert>

<div v-if="!isDestroyed" style="margin-top: 20px">
 <div style="text-align: center;margin-bottom: 20px">
    <a-checkbox style="user-select: none" v-model:checked="save" size="small" default-value="true">将备份保存至</a-checkbox>
    <a-select size="small"
      v-model:value="savePosition"
      style="width: 120px">
      <a-select-option value="cloud" disabled="!canSaveToCloud">云端空间</a-select-option>
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
        <a-button type="danger">切换到其他空间</a-button>
         </a-popconfirm>
      </a-col>
    </a-row>
  </div>
</div>
<div v-else>
<p style="padding-top: 20px">
 <a-alert
    message="空间损毁"
    type="error"
    show-icon
  >
  <template #description>
  非常抱歉，无法读入备份空间，您的备份空间也已经损毁。
<br>请切换到其他空间。
<br>正常情况下您不会遇到此情况，建议至官网下载最新版本后更新到最新版本。
<br>考虑到您可能无法使用想天浏览器，可复制网址 <strong>www.apps.vip</strong> ，使用其他浏览器访问。
</template>
  </a-alert>
</p>
  <div>
    <a-row justify="center">
      <a-col  :span="6" >

       <a-button type="danger" @click="switchToOtherSpace">切换到其他空间</a-button>
</a-col>
    </a-row>
  </div>
</div>
</div>

`

const spaceModel = require('../../../src/model/spaceModel')
const backupSpaceModel = require('../../../src/model/backupSpaceModel')

const fatal = {
  template: tpl,
  data () {
    return {
      save: true,
      savePosition: 'cloud',
      user: null,
      space: null,
      title: '',
      fatal: true,//非致命意外
      canSaveToCloud: true,//是否可以保存到云端，当出现账号凭证错误的时候是无法保存至云端的。
      description: '',
      spaceId: 0,
      backupName: '', //备份空间名称输入框
      isDestroyed: false,//是否是无法恢复了
    }
  },
  async mounted () {

    try {
      let space = await backupSpaceModel.getSpace(window.globalArgs['spaceId'])
      if (!!!space) {
        this.isDestroyed = true
      } else {
        this.space = space
        this.backupName = space.name + '_备份_副本'
        setTimeout(() => {
          let backupNameInputRef = document.getElementById('backupNameInputRef')
          backupNameInputRef.focus()
          backupNameInputRef.select()
        }, 500)
        this.user = space.userInfo
      }
      console.log('spaceId', window.globalArgs['spaceId'])
      this.spaceId = window.globalArgs['spaceId']
    } catch (e) {
      console.warn(e)
      console.warn('无法获取到space')
    }
    this.title = window.globalArgs['title'] || '保存冲突，无法保存空间至云端'
    this.canSaveToCloud = window.globalArgs['canSaveToCloud'] === 'true'
    if (!this.canSaveToCloud) {
      this.savePosition = 'local'
      console.log('local', this.savePosition)
    }
    console.log(this.canSaveToCloud)
    console.log(this.savePosition)
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
    async saveAndChangeToLocal () {
      //todo 添加新一个空间到本地
      if (this.backupName.trim() === '') {
        antd.message.error('空间名必填')
        return
      }
      try {
        let result = await backupSpaceModel.copyById(this.spaceId, this.backupName)
        if (result.status) {
          try {
            let resultChange = await spaceModel.setAdapter('local').changeCurrent(result.data)
            if (resultChange.status === 1) {
              //会自动关闭窗体
            } else {
              window.antd.message.error('切换使用空间失败。')
            }
          } catch (e) {
            window.antd.message.error('切换使用空间失败。意外错误。')
          }
        } else {
          console.warn(this.space)
          antd.message.error('复制备份空间失败。非常遗憾，备份空间损坏。请不勾选备份保存，放弃保存后切换到其他空间。')
        }
      } catch (e) {
        console.warn(e)
        antd.message.error('复制备份空间失败。非常遗憾，备份空间损坏。请不勾选备份保存，放弃保存后切换到其他空间。')
      }
    },
    switchToBackup () {
      if (this.savePosition === 'local') {
        this.saveAndChangeToLocal().then()
      } else {
        this.saveAndChangeToCloud().then()
      }
    }
  }
}

module.exports = fatal
