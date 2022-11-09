<template>
  <div class="container" style=" background: white;padding: 20px;height: 100vh;overflow-y: auto">

    <h3>全部应用
      <a-button @click="addNew" type="primary" style="float: right">安装新应用</a-button>
    </h3>
    <div style="padding: 20px">
      <a-list
        item-layout="horizontal"
        :data-source="apps"
      >
        <template #renderItem="{ item }">
          <a-list-item >
            <template #actions>
              <a @click="loadApp(item)" key="list-loadmore-edit">
                <edit-outlined key="edit"/> 设置
              </a>
              <a v-if="!item.isSystemApp || item.is_debug" @click="deleteApp(item)" key="list-loadmore-more">卸载</a>
            </template>
            <a-skeleton avatar :title="false" :loading="!!item.loading" active>
              <a-list-item-meta>
                <template #description>
                  <p>
                    {{ item.summary }}
                  </p>
                  <p>
                   <a-tag color="green" v-if="item.is_debug">调试</a-tag>
                  </p>
                </template>
                <template #title>
                  <a @click="loadDevApp(item)" >{{ item.name }} <span style="font-size: 12px;color: #999">{{item.nanoid}}</span></a>
                </template>
                <template #avatar>
                  <a-avatar style="width: 60px;height: 60px" :src="item.logo"/>
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
const { appModel } = window.$models
export default {
  name: 'AllApps',
  components: {
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
  },
  data () {
    return {
      apps: []
    }
  },
  async mounted () {
    this.apps = await appModel.getAll({order:"create_time"})

  },
  methods: {
    async addNew () {
      ipc.send('executeApp',{app:await appModel.get({package:'com.thisky.appStore'})})
    },
    async loadApp (app) {
      await this.$router.push({ path: '/setting/'+app.nanoid })
    },
    deleteApp(app){
      Modal.confirm({
        title: '确定卸载「'+app.name+'」？',
        content: '此操作将卸载应用并清空所有应用数据，且无法还原。请谨慎操作。',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
         onOk :async()=> {
          await appModel.uninstall(app.nanoid)
          ipc.sendSync('deleteApp', { nanoid: app.nanoid })
          this.apps.splice(this.apps.findIndex(a => {
            return app === a
          }), 1)
          message.success('卸载应用成功。')
        },
        onCancel () {
          console.log('Cancel')
        },
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
