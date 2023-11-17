<template>
<Modal  v-model:visible="settingVisible">
    <div class="w-[500px] h-[614px] xt-bg rounded-xl p-6 ">
        <div>
            <div class="w-full text-base xt-text">导航栏位置</div>
            <div>
                
            </div>
        </div>
        <div class="w-full h-[255px] xt-bg-2 rounded-xl p-4 mt-4">
            <div  v-for="(item,index) in navigationPosition">
                <settingItem  :settingItem="item"></settingItem>
                <!-- <a-divider style="height: 1px; background-color: var(--divider)" /> -->
                <div class="w-full h-[1px] bg-[var(--divider)] mt-4 mb-4" v-if="index!=navigationPosition.length-1"></div>
            </div>
        </div>
        <div class="w-full h-[255px] xt-bg-2 rounded-xl mt-4 p-4">
            <div  v-for="(item,index) in navigationFunction">
            <settingItem  :settingItem="item"></settingItem>
            <div class="w-full h-[1px] bg-[var(--divider)] mt-4 mb-4" v-if="index!=navigationFunction.length-1"></div>
        </div>
        </div>
        
    </div>
</Modal>
</template>

<script setup lang='ts'>
import {ref,reactive} from 'vue'
import {navigationPosition,navigationFunction} from './index'
import settingItem from './settingItem.vue';
// 常量设置
const settingVisible=ref(false)
</script>
<style lang='scss' scoped>

</style>