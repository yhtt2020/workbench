<template>
  <!-- 统一选择模板 -->
  <a-tooltip :title="item.title" placement="right">
    <div
      @click="selectClick(item.id, item.flag)"
      class="xt-base-btn"
      style="width: 50px; height: 50px; border-radius: 14px"
      :style="[isActive(item.tab||item.id,3,{no:no}) ? 'border: 3px solid var(--active-bg)' : '']"
    >
      <!--      {{no}}-->
      <slot></slot>
    </div>
  </a-tooltip>
</template>

<script setup>
import routerTab from '../../../js/common/routerTab'
import { useRoute } from 'vue-router'
import { reactive, ref, watchEffect ,onMounted} from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

const isActive = routerTab.isActive

const props = defineProps({
  item: {},
  id: '',
  tabVariables: undefined
})
const emits = defineEmits(['itemClick'])
const selectClick = () => {
  emits('itemClick', props.item)
}
const no = ref(
  1
)
onMounted(()=>{
  no.value=Number(useRoute().params.no)
})
onBeforeRouteUpdate((to, from) => {
  no.value = Number(to.params.no)
})


</script>

<style lang="scss" scoped></style>
