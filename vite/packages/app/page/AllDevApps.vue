<template>
  <div class="container">
    <a-page-header
      style="box-shadow: 0 2px 8px #f0f1f2;z-index: 1; padding:6px 10px;background: white"
      title="全部开发中的应用"
      sub-title="应用设置"
    >
      <template #extra>
      </template>
    </a-page-header>
    <div style="padding: 20px">
      <a-row :gutter="16">
        <a-col v-for="devApp in devApps" :span="8">
          <a-card @click="loadDevApp(devApp)"  hoverable style="width: 100%">
            <template #cover>
              <div style="text-align: center;padding: 20px">
                <img style="width: 80px"
                     :alt="devApp.name"
                     :src="devApp.logo"
                />
              </div>
            </template>
            <template #actions>
              <setting-outlined key="setting" />
              <edit-outlined key="edit" />
              <ellipsis-outlined key="ellipsis" />
            </template>
            <a-card-meta :title="devApp.name" :description="devApp.summary">
              <template #avatar>
                <a-avatar src="https://joeschmoe.io/api/v1/random" />
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>

    </div>

  </div>

</template>

<script>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import {mapActions} from 'pinia'
import {appStore} from '../store'

const {devAppModel} = window.$models
export default {
  name: 'AllDevApps',
  components: {
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
  },
  data(){
    return{
      devApps:[]
    }
  },
  async mounted () {
    this.devApps = await devAppModel.getAll()

  },
  methods:{
    async loadDevApp (devApp) {
      await this.setDevApp(devApp)
      this.$router.push('/setting/baseDev')
    },
    ...mapActions(appStore,['setDevApp'])
  }
}
</script>
<style>

</style>
<style scoped>
.container{
  height: 100vh;
  background-color: #ececec;
}
</style>
