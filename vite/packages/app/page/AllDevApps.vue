<template>
  <div class="container" style="margin:10vh;background: white;padding: 20px;border-radius: 8px;height: 80vh;overflow-y: auto">

    <h3>全部开发中的应用
      <a-button @click="createNew" type="primary" style="float: right">创建新应用</a-button>
    </h3>
    <div style="padding: 20px">
      <a-list
        class="demo-loadmore-list"
        item-layout="horizontal"
        :data-source="devApps"
      >
        <template #renderItem="{ item }">
          <a-list-item >
            <template #actions>
              <a @click="loadDevApp(item)" key="list-loadmore-edit">
                <edit-outlined key="edit"/> 进入项目
              </a>
              <a @click="deleteDevApp(item)" key="list-loadmore-more">删除项目</a>
            </template>
            <a-skeleton avatar :title="false" :loading="!!item.loading" active>
              <a-list-item-meta>
                <template #description>
                  <p>
                    {{ item.summary }}
                  </p>
                  <p v-if="item.assignAppsInfo.length>0">
                    关联的应用：
                    <a-tag v-for="app in item.assignAppsInfo">{{ app.name }} <span style="color:grey">{{app.nanoid}}</span></a-tag>
                  </p>
                </template>
                <template #title>
                  <a @click="loadDevApp(item)" >{{ item.name }} <span style="font-size: 12px;color: #999">{{item.nanoid}}</span></a>
                </template>
                <template #avatar>
                  <a-avatar :src="item.logo"/>
                </template>
              </a-list-item-meta>
            </a-skeleton>
          </a-list-item>
        </template>
      </a-list>

    </div>

  </div>

</template>

<script>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { mapActions } from 'pinia'
import { appStore } from '../store'
import {Modal,message } from 'ant-design-vue'
const { devAppModel,appModel } = window.$models
export default {
  name: 'AllDevApps',
  components: {
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
  },
  data () {
    return {
      devApps: []
    }
  },
  async mounted () {
    this.devApps = await devAppModel.getAll()

    this.devApps.forEach(devApp => {

      let assignApps=JSON.parse(devApp.assign_apps)

      devApp.assignAppsInfo=[]
      assignApps.forEach(async appId => {
        let assignApp=await appModel.get({ nanoid: appId })
        if(assignApp) {devApp.assignAppsInfo.push(assignApp)}
      })
    })

  },
  methods: {
    async createNew () {
      this.setDevApp(await devAppModel.create())
      this.$router.push('/dev/')
    },
    async loadDevApp (devApp) {
      await this.setDevApp(devApp)
      this.$router.push('/dev/')
    },
    deleteDevApp(app){
      Modal.confirm({
        centered:true,
        content:`是否删除「${app.name}」ID：${app.nanoid}？删除后无法还原，请谨慎操作。`,
        onOk:()=>{
          devAppModel.delete(app.nanoid)
          this.devApps.splice(this.devApps.findIndex(devApp=>devApp===app),1)
          message.success('删除项目成功。')
        }
      })
    },
    ...mapActions(appStore, ['setDevApp'])
  }
}
</script>
<style>
body{
  background: #f1f1f1;
}
</style>
<style scoped>
.container {
  height: 100vh;
}
</style>
