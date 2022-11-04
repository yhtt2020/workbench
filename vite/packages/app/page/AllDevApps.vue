<template>
  <div class="container">

    <h3>全部开发中的应用
      <a-button type="primary" style="float: right">创建新应用</a-button>
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
                <edit-outlined key="edit"/>
              </a>
              <a key="list-loadmore-more">删除</a>
            </template>
            <a-skeleton avatar :title="false" :loading="!!item.loading" active>
              <a-list-item-meta>
                <template #description>
                  <p>
                    {{ item.summary }}
                  </p>
                  <p>
                    关联的应用：
                    <a-tag v-for="app in item.assignAppsInfo">{{ app.name }} <span style="color:grey">{{app.nanoid}}</span></a-tag>
                  </p>
                </template>
                <template #title>
                  <a @click="loadDevApp(item)" >{{ item.name }}</a>
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
        devApp.assignAppsInfo.push(await appModel.get({ nanoid: appId }))
      })
      console.log( devApp.assignAppsInfo)
    })

  },
  methods: {
    async loadDevApp (devApp) {
      await this.setDevApp(devApp)
      this.$router.push('/setting/baseDev')
    },
    ...mapActions(appStore, ['setDevApp'])
  }
}
</script>
<style>

</style>
<style scoped>
.container {
  height: 100vh;
}
</style>
