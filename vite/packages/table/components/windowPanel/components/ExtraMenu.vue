<template>
    <div v-if="client">
        <xt-divider class="mx-auto" style="width: 90%" />
        <div class="w-full h-full text-sm text-center xt-text-2 items">工作台常用功能</div>
        <div class="flex items-center justify-center gap-6 mx-auto mb-2" style="width: 90%">
            <xt-new-icon
                v-for="(item, index) in iconList"
                :key="index"
                :icon="item.icon"
                size="18"
                class="pointer xt-text"
                @click="item.cb()"
            />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, getCurrentInstance, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { startApp } from '../../../ui/hooks/useStartApp';
import {usePlat} from "../../../ui/hooks/usePlat";
import { cacheStore } from '../../../ui/components/Menu/cacheTag';
import { storeToRefs } from 'pinia';

const store = cacheStore();
const { isHide } = storeToRefs(store);

const router = useRouter()

const { proxy } = getCurrentInstance()
const client=ref(usePlat('client'))

const list = ref([
    {
        icon:'fluent:full-screen-maximize-16-filled',
        name:'全屏显示',
        disabled:'client',
        cb:()=>{
            startApp('systemApp', 'fullscreen', router)
            console.log('全屏显示',iconList.value)
            // proxy.$bus.emit('closeMenus')
            isHide.value = true
        }
    },
    {
        icon:'fluent:settings-16-regular',
        name:'系统设置',
        disabled:'web',
        cb:()=>{
            startApp('systemApp', 'setting', router)
            // proxy.$bus.emit('closeMenus')
            isHide.value = true
        }
    },
    {
        icon:'fluent:lock-closed-16-regular',
        name:'锁定屏幕',
        disabled:'client',
        cb:()=>{
            startApp('systemApp', 'lock', router)
            // proxy.$bus.emit('closeMenus')
            isHide.value = true
        }
    },
    {
        icon:'fluent:power-24-regular',
        name:'电源控制',
        disabled:'client',
        cb:()=>{
            startApp('systemApp', 'power', router)
            // proxy.$bus.emit('closeMenus')
            isHide.value = true
        }
    }
])

// 当为web端时，只保留系统设置
const iconList = computed(() => {
    if(!window.$usePlat('client')){
        return list.value.filter(item => item.disabled !== 'client')
    } else {
        return list.value
    }
})

onUnmounted(() => {
    console.log('onBeforeUnmount关闭了')
    isHide.value = false
})

// onMounted(() => {
//     proxy.$bus.on('closeMenus', () => {
//         console.log('关闭了')
//     })
// })
</script>
<style lang='scss' scoped>
.items {
  box-sizing: border-box;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
</style>
