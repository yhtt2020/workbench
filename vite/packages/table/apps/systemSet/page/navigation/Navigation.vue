<template>
    <div>
        <Property v-if="deskTab == 'property'" />
        <Appearance v-else />
    </div>
</template>

<script setup lang='ts'>
import { ref,defineAsyncComponent,onMounted } from 'vue'

const Property = defineAsyncComponent(() => import('./Property.vue'))
const Appearance = defineAsyncComponent(() => import('./Appearance.vue'))

const props = defineProps({
    deskTab: String
})

onMounted(() => {
    console.log('deskTab', props.deskTab)
})
</script>
<style lang='scss' scoped></style>