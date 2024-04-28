<template>
    <div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { startApp } from '../../../ui/hooks/useStartApp';

const router = useRouter()

// const emit = defineEmits(['click'])

const list = ref([
    {
        icon:'fluent:full-screen-maximize-16-filled',
        name:'全屏显示',
        disabled:'client',
        cb:()=>{
            startApp('systemApp', 'fullscreen', router)
            console.log('全屏显示',iconList.value)
        }
    },
    {
        icon:'fluent:settings-16-regular',
        name:'系统设置',
        disabled:'web',
        cb:()=>{
            startApp('systemApp', 'setting', router)
        }
    },
    {
        icon:'fluent:lock-closed-16-regular',
        name:'锁定屏幕',
        disabled:'client',
        cb:()=>{
            startApp('systemApp', 'lock', router)
        }
    },
    {
        icon:'fluent:power-24-regular',
        name:'电源控制',
        disabled:'client',
        cb:()=>{
            startApp('systemApp', 'power', router)
        }
    }
])

// 当为web端时，只保留系统设置
const iconList = computed(() => {
    if(window.$usePlat()){
        return list.value.filter(item => item.disabled !== 'client')
    } else {
        return list.value
    }
})
</script>
<style lang='scss' scoped>
.items {
  box-sizing: border-box;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
</style>