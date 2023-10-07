<template>
  <!-- 统一选择模板 -->
  <div
    class="xt-base-btn"
    :class="{active:isActive(item.tab||item.id,3,tabParams) }"
    style="width: 50px; height: 50px; border-radius: 14px"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import routerTab from '../../../js/common/routerTab'
import { useRoute } from 'vue-router'
import { reactive, ref, watchEffect, onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

const isActive = routerTab.isActive

const props = defineProps({
  item: {},
  id: '',
})

const tabParams = ref(
  {}
)
onMounted(() => {
  tabParams.value = useRoute().params
})
onBeforeRouteUpdate((to, from) => {
  tabParams.value = to.params
})


</script>

<style lang="scss" scoped>
.active{
  border: 3px solid var(--active-bg)
}
</style>
