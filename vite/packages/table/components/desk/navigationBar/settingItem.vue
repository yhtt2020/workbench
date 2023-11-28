<template>
<div>
    <div class="flex justify-between w-full">
        <div class="text-base xt-text">{{ settingItem.title }}</div>
        <a-switch v-if="position" v-model:checked="useNavStore.navigationToggle[props.index]" />
        <a-switch v-else v-model:checked="navigationStore.bottomToggle[props.index]" />
    </div>
    <!-- {{ navigationStore.bottomToggle[0] }} -->
    <div class="mt-2 text-sm xt-text-2">
        {{ settingItem.description }}
    </div>
</div>
</template>

<script setup lang='ts'>
import {ref,reactive} from 'vue'
import {navStore} from '../../../store/nav'
import { useNavigationStore } from './navigationStore';
const useNavStore = navStore()
const navigationStore=useNavigationStore()
const props=defineProps({
    settingItem:Object,
    index:Number,
    position:Boolean
})
</script>
<style lang='scss' scoped>

</style>