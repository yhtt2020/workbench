<template>
    <setting 
        v-if="linkVisible" 
        v-model="linkVisible" 
        @save="saveIcon" 
        ref="customLink">
    </setting>
</template>

<script setup lang='ts'>
import { ref, onMounted ,defineAsyncComponent} from 'vue'
import { storeToRefs } from 'pinia';

const setting = defineAsyncComponent(() => import('../../../../widgets/myIcons/set/index.vue'))

import { myIcons } from '../../../../../store/myIcons';

import { useIconConversionFile } from '../../../../../ui/hooks/useDataConversion';
const iconStore = myIcons();
const { edit } = storeToRefs(iconStore);

const linkVisible = ref(false)
const data = ref({
    mode:'link',
    type:'default',
    radius: 6,
    imgState:'cover',
    imgShape:'square',
    size:'mini',
    open:{
        type:'default',
        value:""
    },
    defaultIcon:"",
    src:"https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn",
    value:""
  })
const emit = defineEmits(['addIcon'])

const saveIcon = (item) => {
    const icon = useIconConversionFile(item)
    emit('addIcon',icon)
    linkVisible.value = false
}

onMounted( () => {
    linkVisible.value = true
    edit.value = data.value
}) 

</script>
<style lang='scss' scoped></style>