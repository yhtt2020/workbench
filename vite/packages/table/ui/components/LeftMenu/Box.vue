<template>
  <!-- 统一选择模板 -->
  <div
    :class="[{ active: activeState }, boxClass]"
    class="xt-base-btn menu-item"
    style=""
  >
    <slot></slot>
  </div>
</template>

<script setup>
import routerTab from '../../../js/common/routerTab'
import { useRoute } from 'vue-router'
import { reactive, ref, watchEffect, onMounted, computed } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

const isActive = routerTab.isActive
const props = defineProps({
  item: {},
  id: '',
  model: {
    default: 'router',
  },
  boxClass: {},
})

const tabParams = ref({})
onMounted(() => {
  tabParams.value = useRoute().params
})
onBeforeRouteUpdate((to, from) => {
  tabParams.value = to.params
})

const activeState = computed(() => {
  if (props.model == 'router') {
    return isActive(props.item.tab || props.item.id, 3, tabParams.value)
  } else if (props.model == 'id') {
    return props.item.id == props.id
  }
})
</script>

<style lang="scss" scoped>
.active {
  border: 3px solid var(--active-bg);
}

.menu-item {
  width: 50px;
  height: 50px;
  min-height: 50px;
  border-radius: 14px
}
</style>
