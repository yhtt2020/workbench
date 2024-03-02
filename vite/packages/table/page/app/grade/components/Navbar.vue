<template>
  <div class="pt-6 text-center font-16 xt-text">添加导航图标</div>
  <div class="text-center font-16 xt-text-2" style="width:704px;margin:16px auto 0;">根据您的偏好，为你推荐以下图标。你稍后可添加更多图标。
  </div>
  <div class="flex flex-wrap content-start mt-4 overflow-hidden overflow-y-auto xt-scrollbar"
    style="height: 400px;padding-left:19px;">
    <div class="relative flex flex-col items-center pt-4 rounded-lg nav-list xt-bg-2 pointer"
      v-for="(item, index) in NavbarList"
      :class="index % 4 != 0 ? 'ml-4' : 'ml-10', index > 3 ? 'mt-4' : '', index == 0 ? 'disabled' : ''"
      @click="changeNav(item, index)">
      <div class="absolute top-1.5 right-1.5 w-8 h-8 rounded-lg xt-bg flex justify-center items-center">
        <a-checkbox :disabled="index == 0" v-model:checked="item.isCheck"></a-checkbox>
      </div>
      <a-avatar class="flex-none" shape="square" :size="64" :src="item.icon"></a-avatar>
      <div class="w-full mt-3 text-center font-16 xt-text text-hidden">{{ item.name }}</div>
      <div class="mt-2 font-14 xt-text-2">{{ item.type == 'systemApp' ? '系统功能' : item.type == 'tableApp' ? '应用程序' : '文件夹'
      }}</div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'Navbar',
  props: ['NavbarList'],
  data() {
    return {

    }
  },
  async mounted() {
  },
  components: {
    Icon,
  },

  computed: {
  },
  methods: {
    changeNav(item, index){
      this.$emit('changeNavList', item, index)
    },

  }
}
</script>

<style scoped lang="scss">
.nav-list {
  width: 160px;
  height: 160px;
}

.nav-list:hover {
  opacity: 0.8;

}

.text-hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:deep(.ant-checkbox-disabled) {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
