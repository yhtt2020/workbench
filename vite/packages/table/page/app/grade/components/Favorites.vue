<template>
  <div class="pt-6 text-center font-16 xt-text">添加导航图标</div>
  <div class="text-center font-16 xt-text-2" style="width:704px;margin:16px auto 0;">根据你选择偏好，我们为你推荐了以下图标。你可以稍后添加更多其他的图标。
  </div>
</template>
  
<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'Favorites',
  // props: ['NavbarList'],
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
    // changeNav(item, index){
    //   this.$emit('changeNavList', item, index)
    // },

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
  