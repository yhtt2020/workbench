<template>
  <div>
    <a-page-header
      class="content-header"
      @back=""
    >
      <template #subTitle>

        <a-tooltip  v-if="isApp && currentTab.path" placement="bottom" :overlayStyle="{maxWidth:'1000px'}">
          <template #title>
            <span >点击打开完整路径：{{ currentTab.path }} </span>
          </template>
          <span @click="openDir(currentTab.path)">{{currentTab.alias}} <login-outlined /></span>
        </a-tooltip>
        <span v-else>
          {{currentTab.alias}}
        </span>
          {{currentFolder.name}}

      </template>
      <template #extra >

      <div style="display: flex;vertical-align: center">
        <div style="flex: 200px;padding-right: 10px">
          <a-slider v-model:value="itemSize" :min="60" :step="5" :max="300" />
        </div>
        <div style="flex: auto"></div>
        <div style="flex: 120px;padding-top: 7px">
          <RedoOutlined  />
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-sub-menu key="info" title="显示信息">
                  <a-menu-item> <a-checkbox  >名称</a-checkbox></a-menu-item>
                  <a-menu-item><a-checkbox  >扩展名</a-checkbox></a-menu-item>
                  <a-menu-item><a-checkbox  >显示子文件夹内容</a-checkbox></a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="order" title="排序方式">
                  <a-menu-item>添加时间</a-menu-item>
                  <a-menu-item>创建时间</a-menu-item>
                  <a-menu-item>修改时间</a-menu-item>
                </a-sub-menu>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="grid">
                  网格
                </a-menu-item>
                <a-menu-item key="list">
                  列表
                </a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="refresh">
                  刷新
                </a-menu-item>
              </a-menu>

            </template>
            <span  shape="circle" style="margin-right: 10px">
              <BorderOuterOutlined />
            </span>

          </a-dropdown>
          <a-input-search
            size="small"
            placeholder="搜索"
            style="width: 100px"
          />
        </div>
      </div>


      </template>
    </a-page-header>
  </div>
</template>

<script>
import { RedoOutlined, BorderOuterOutlined,LoginOutlined } from '@ant-design/icons-vue';
import { mapState } from 'vuex'
import ipc from '@/utils/ipc'
export default {
  name: 'ContentHeader',
  props: {
  },
  mounted(){
    this.$store.commit('ui/setItemSize',Number(localStorage.getItem('itemSize')))
  },
  components:{
    BorderOuterOutlined,
    RedoOutlined,
    LoginOutlined
  },
  methods:{
    openDir(dir){
      console.log('我想打开')
      ipc.openDir(dir)
    },
  },
  computed:{
    itemSize: {
      // getter
      get() {
        return this.$store.state.ui.itemSize
      },
      // setter
      set(newValue) {
       this.$store.commit('ui/setItemSize',newValue)
        localStorage.setItem('itemSize',newValue)
      }
    },
    ...mapState({
      isApp:state=>state.config.isApp,
      currentFolder:state=>state.ui.currentFolder,
      currentTab:state=>state.ui.currentTab
    })
  },
  data() {
    return {
      routes: [
        {
          path: 'index',
          breadcrumbName: 'First-level Menu',
        },
        {
          path: 'first',
          breadcrumbName: 'Second-level Menu',
        },
        {
          path: 'second',
          breadcrumbName: 'Third-level Menu',
        },
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
