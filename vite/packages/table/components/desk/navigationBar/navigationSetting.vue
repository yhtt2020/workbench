<template>
    <!-- <Modal  v-model:visible="settingVisible" :maskNoClose="true" > -->
    <xt-old-modal :isFooter="false" zIndex="300" :isHeader="false" :boxIndex="420" :maskIndex="300">
        <div class="w-[400px] h-[484px]  rounded-xl pl-4 pr-4 pb-4  wuzi">
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
                    <settingItem :settingItem="item" :index="index" :position="true"></settingItem>
                    <div class="w-full h-[1px] bg-[var(--divider)] mt-2 mb-2" v-if="index != navigationPosition.length - 1">
                    </div>
                </div>
            </div>
            <div class="w-full h-[215px] xt-bg-2 rounded-xl mt-3 p-3">
                <div v-for="(item, index) in navigationFunction">
                    <settingItem :settingItem="item" :index="index" :position="false"></settingItem>
                    <div class="w-full h-[1px] bg-[var(--divider)] mt-2 mb-2" v-if="index != navigationFunction.length - 1">
                    </div>
                </div>
            </div>

        </div>
        <!-- </Modal> -->
    </xt-old-modal>
</template>

<script setup lang='ts'>
import { ref, reactive,onBeforeMount } from 'vue'
import { navigationPosition, navigationFunction } from './index'
import settingItem from './settingItem.vue';
import { Icon as newIcon } from '@iconify/vue';
import {navStore} from '../../../store/nav'
const useNavStore = navStore()
const emit = defineEmits(['setQuick'])
const close = () => {
    emit('setQuick')
}
const navigationSwitch=ref([])
onBeforeMount(() => {
    navigationSwitch.value=navigationPosition.map((item,index)=>{
        item.switch=useNavStore.navigationToggle[index]
        return item
    })
    // console.log(navigationSwitch.value)
})
</script>
<style lang='scss' scoped></style>
