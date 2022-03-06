<template>
  <div>
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240)"
      :sub-title="currentFolder.name"
      @back="() => $router.go(-1)"
    >
      <template #extra>

        <a-slider v-model:value="itemSize" :min="50" :max="300" />
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMenuClick">
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
          <a-button size="small" shape="circle">
            <BorderOuterOutlined />
          </a-button>

        </a-dropdown>
        <a-input-search
          v-model:value="value" size="small"
          placeholder="搜索"
          style="width: 200px"
          @search="onSearch"
        />
      </template>
    </a-page-header>
  </div>
</template>

<script>
import {  BorderOuterOutlined } from '@ant-design/icons-vue';
import { mapState } from 'vuex'
export default {
  name: 'ContentHeader',
  props: {
    msg: String
  },
  components:{
    BorderOuterOutlined
  },
  computed:{
    itemSize: {
      // getter
      get() {
        return this.$store.state.itemSize
      },
      // setter
      set(newValue) {
       this.$store.commit('setItemSize',newValue)
      }
    },
    ...mapState(['currentFolder'])
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
