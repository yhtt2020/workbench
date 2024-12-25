<template>
  <setting
    v-if="linkVisible"
    v-model="linkVisible"
    @save="saveIcon"
    ref="customLink">
  </setting>
</template>

<script setup lang='ts'>
import {ref, onMounted, defineAsyncComponent, watch} from 'vue'
import {storeToRefs} from 'pinia';

const setting = defineAsyncComponent(() => import('../../../../widgets/myIcons/set/index.vue'))

import {myIcons} from '../../../../../store/myIcons';

import {useIconConversionFile} from '../../../../../ui/hooks/useDataConversion';

const iconStore = myIcons();
const {edit} = storeToRefs(iconStore);

const linkVisible = ref(false)
const data = ref({
  type: 'link',
  radius: 6,
  imgState: 'cover',
  imgShape: 'square',
  size: 'mini',
  open: {
    mode: 'default',
    value: "",
  },
  defaultIcon: "",
  src: "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn",
  value: ""
})
const emit = defineEmits(['addIcon', 'close'])

const saveIcon = (args:any) => {
  console.log('添加的时候保存',args)
  // console.log(item,'before')
  const icon = useIconConversionFile(args.value)
  icon.value = args.value.value
  icon.type = args.value.type
  icon.open = args.value.open
  // console.log(icon,'after')
  emit('addIcon', icon)
  linkVisible.value = false
}

onMounted(() => {
  linkVisible.value = true
  edit.value = data.value
})

watch(
  () => linkVisible.value,
  (newVal, oldVal) => {
    if (!newVal && oldVal) {
      emit('close')
    }
  }
)

</script>
<style lang='scss' scoped></style>
