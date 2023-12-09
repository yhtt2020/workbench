<template>
    <xt-modal :zIndex="99" title="导航栏设置" :modelValue="modelValue" :mask="false" @no="close" :footer="false">
        <div class=" rounded-xl" :style="{height:`${windowHeight}px`,width:`${windowWidth}px`}">
            <div class="w-full h-[255px] xt-bg-2 rounded-xl p-4">
                <div v-for="(item, index) in navigationPosition">
                    <div class="flex justify-between w-full">
                        <div class="text-base xt-text">{{ item.title }}</div>
                        <a-switch  v-model:checked="useNavStore.navigationToggle[index]" />
                    </div>
                    <!-- {{ navigationStore.bottomToggle[0] }} -->
                    <div class="mt-3 text-sm xt-text-2">
                        {{ item.description }}
                    </div>
                    <div class="w-full h-[1px] bg-[var(--divider)] mt-3 mb-4" v-if="index != navigationPosition.length - 1">
                    </div>
                </div>
            </div>
            <div class="w-full h-[340px] xt-bg-2 rounded-xl mt-3 p-4">
                <div v-for="(item, index) in navigationFunction">
                    <div v-if="item.tag!=='chat'" class="w-full">
                        <div class="flex justify-between w-full" >
                        <div class="text-base xt-text">{{ item.title }}</div>
                        <a-switch  v-model:checked="navigationStore.bottomToggle[index]" />
                    </div>
                    <div class="mt-3 text-sm xt-text-2">
                        {{ item.description }}
                    </div>
                    </div>
                    <div v-else class="w-full">
                        <div class="flex justify-between w-full" >
                        <div class="text-base xt-text">{{ item.title }}</div>
                        <a-switch  v-model:checked="useAppStore.settings.enableChat" />
                    </div>
                    <div class="mt-3 text-sm xt-text-2">
                        {{ item.description }}
                    </div>
                    </div>
                    
                    <div class="w-full h-[1px] bg-[var(--divider)] mt-3 mb-4" v-if="index != navigationFunction.length - 1">
                    </div>
                </div>
            </div>

        </div>
        <!-- </Modal> -->
    </xt-modal>
</template>

<script setup lang='ts'>
import { ref,onBeforeUnmount,onMounted } from 'vue'
import { navigationPosition, navigationFunction } from './index'
import { useNavigationStore } from './navigationStore';
import settingItem from './settingItem.vue';
import { appStore } from '../../../store';
import { navStore } from '../../../store/nav'
const useNavStore = navStore()
const useAppStore=appStore()
const navigationStore=useNavigationStore()
const modelValue = ref(true)
const windowHeight=ref(480)
const windowWidth=ref(400)
const emit = defineEmits(['setQuick'])
const close = () => {
    emit('setQuick')
}
const handleResize = () => {
    const currentHeight = window.innerHeight
    if(currentHeight>900){
        windowHeight.value=610
        windowWidth.value=460
    }else{
        windowHeight.value=480
        windowWidth.value=400
    }
}
onMounted(()=>{
    handleResize()
    window.addEventListener('resize', handleResize)
})
onBeforeUnmount(()=>{
    window.removeEventListener('resize', handleResize)
})
</script>
<style lang='scss' scoped></style>
