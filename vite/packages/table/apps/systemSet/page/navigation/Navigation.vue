<template>
    <div>
        <Property v-if="deskTab == 'property'" />
        <Appearance v-else />
    </div>
</template>

<script setup lang='ts'>
import { ref,onMounted } from 'vue'

import  Property from './Property.vue'
import Appearance from './Appearance.vue'

const props = defineProps({
    deskTab: String
})

onMounted(() => {
    console.log('deskTab', props.deskTab)
})
</script>
<style lang='scss' scoped></style>
