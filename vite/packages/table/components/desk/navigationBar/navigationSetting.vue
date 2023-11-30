<template>
    <Modal :zIndex="99" :maskNoClose="true" v-model:visible="settingVisible" :blurFlag="false">
        <div class="w-[420px] h-[583px]  rounded-xl p-4">
            <div class="flex justify-between w-full h-[32px] items-center ">
                <div class="flex justify-center w-full">
                    <div class="ml-8 text-base xt-text">导航栏设置</div>
                </div>
                <xt-button class="border-0 rounded-md xt-bg-2 pointer" :w="40" :h="40" @click="close"
                    style="flex-shrink: 0;">
                    <div class="flex items-center justify-center">
                        <newIcon class="text-base xt-text pointer" icon="akar-icons:cross" />
                    </div>
                </xt-button>
            </div>
            <div class="w-full h-[215px] xt-bg-2 rounded-xl p-3 mt-3">
                <div v-for="(item, index) in navigationPosition">
                    <div class="flex justify-between w-full">
                        <div class="text-base xt-text">{{ item.title }}</div>
                        <a-switch  v-model:checked="useNavStore.navigationToggle[index]" />
                    </div>
                    <!-- {{ navigationStore.bottomToggle[0] }} -->
                    <div class="mt-2 text-sm xt-text-2">
                        {{ item.description }}
                    </div>
                    <div class="w-full h-[1px] bg-[var(--divider)] mt-2 mb-2" v-if="index != navigationPosition.length - 1">
                    </div>
                </div>
            </div>
            <div class="w-full h-[280px] xt-bg-2 rounded-xl mt-3 p-3">
                <div v-for="(item, index) in navigationFunction">
                    <div v-if="item.tag!=='chat'" class="w-full">
                        <div class="flex justify-between w-full" >
                        <div class="text-base xt-text">{{ item.title }}</div>
                        <a-switch  v-model:checked="navigationStore.bottomToggle[index]" />
                    </div>
                    <div class="mt-2 text-sm xt-text-2">
                        {{ item.description }}
                    </div>
                    </div>
                    <div v-else class="w-full">
                        <div class="flex justify-between w-full" >
                        <div class="text-base xt-text">{{ item.title }}</div>
                        <a-switch  v-model:checked="useAppStore.settings.enableChat" />
                    </div>
                    <div class="mt-2 text-sm xt-text-2">
                        {{ item.description }}
                    </div>
                    </div>
                    
                    <div class="w-full h-[1px] bg-[var(--divider)] mt-2 mb-2" v-if="index != navigationFunction.length - 1">
                    </div>
                </div>
            </div>

        </div>
        <!-- </Modal> -->
    </Modal>
</template>

<script setup lang='ts'>
import { ref, reactive, onBeforeMount,watch } from 'vue'
import { navigationPosition, navigationFunction } from './index'
import { useNavigationStore } from './navigationStore';
import settingItem from './settingItem.vue';
import { appStore } from '../../../store';
import { Icon as newIcon } from '@iconify/vue';
import { navStore } from '../../../store/nav'
import Modal from '../../Modal.vue';
const useNavStore = navStore()
const useAppStore=appStore()
const navigationStore=useNavigationStore()
const settingVisible = ref(true)
const emit = defineEmits(['setQuick'])
const close = () => {
    emit('setQuick')
}
// onBeforeMount(()=>{
//     bottomList.value=[...navigationStore.bottomToggle,useAppStore.settings.enableChat]
// })
// const bottomList=ref([])
// watch(()=>navigationStore.bottomToggle,(val)=>{
    
//     bottomList.value=[...val,useAppStore.settings.enableChat]
// })
// watch(()=>useAppStore.settings.enableChat,(val)=>{
//     bottomList.value=[...navigationStore.bottomToggle,val]
// })
</script>
<style lang='scss' scoped></style>
