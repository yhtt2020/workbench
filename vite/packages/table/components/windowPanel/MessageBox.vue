<template>
    <div :class="boxClass">
        <Box 
            :main-class="'bottom-20 right-4'"
            :list="list"
            >
        </Box>
    </div>
    <TopCourier v-if='courierVisible'></TopCourier>
    <LeftDrawer ref="leftDrawerRef" :status="status" :hasEnable="clipboard.enable"></LeftDrawer>
</template>

<script setup lang='ts'>
import { ref, provide,computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { getClientIcon,getCover,getIcon } from '../../js/common/game';

import TopCourier from '../widgets/courier/TopCourier.vue';
import Box from './components/Box.vue';
import TopPanelLeftDrawer from '../drawer/TopPanelLeftDrawer.vue';
import LeftDrawer from './components/LeftDrawer.vue';

import { courierStore } from '../../apps/ecommerce/courier';
import { appStore } from '../../store';
import { clipboardStore } from '../../apps/clipboard/store';
import { steamUserStore } from '../../store/steamUser';

// 路由
const router = useRouter()

// 快递数据
const useCourier = courierStore()
const { settings } = storeToRefs(useCourier)

// 音乐数据
const useAppStore = appStore()
const { status } = storeToRefs(useAppStore)

// 剪切板数据
const useClipboard = clipboardStore()
const { settings: clipboard } = storeToRefs(useClipboard)

// steam用户数据
const useSteamUser = steamUserStore()
const { runningGame } = storeToRefs(useSteamUser)

type propsType = {
    boxClass:string,
}
const props = withDefaults(defineProps<propsType>(), {
    boxClass:''
})

type queueType = {
    icon: string;    // 工作台新图标ifyIcon
    avatar?: string;  // 头像，获取的图标
    tip?: string;  // tooltip文字
    name: string;  // 名字
    fn: () => void;  // 点击函数
    rightFn: () => void;  // 右键点击函数
    disabled: boolean;  // 是否禁用
}
const queue : Array<queueType> = ref([
    {
        icon:'fluent:box-16-regular',
        name:'2',
        tip:'',
        fn:() => {
            console.log('2',list.value.length, clipboard.value.enable)
        },
        disabled:computed(() => settings.value.courierStatus.statusBar)
    },
    {
        avatar:status.value?.music?.cover,
        name:`${status.value?.music?.title} - ${status.value?.music?.singer}`,
        fn:() => {
            router.push({ name: 'music' })
        },
        rightFn:() => {
            console.log('音乐')
            drawerVisible.value = true
        },
        disabled:computed(() => status.value?.music?.playing && status.value?.music?.title && status.value?.music),
        tip:'音乐播放中，点击进入应用，右键查看全部',
    },
    {
        tip:'剪切板监听中，点击进入应用，右键查看全部',
        name:'',
        fn:() => {
            router.push({ name: 'clipboard' })
        },
        rightFn:() => {
            console.log('剪切板')
            // leftDrawerRef.value.openLeftDrawer()
            drawerVisible.value = true
        },
        icon:"fluent:clipboard-bullet-list-16-regular",
        disabled:computed(() => clipboard.value.enable)
    },
    {
        name:runningGame.value?.chineseName,
        avatar:getClientIcon(runningGame.value?.appid,runningGame.value?.clientIcon),
        disabled:computed(() => runningGame.value?.appid),
        fn:() => {
            router.push({
                name:"gameIndex",
                params:{
                    appid:runningGame.value?.appid
                }
            })
        }
    }
])

const list = computed(() => {
    return queue.value.filter(item => item.disabled)
})

const courierVisible = ref(false)
const drawerVisible = ref(false)
const leftDrawerRef = ref(null)
provide('courierVisible', courierVisible)
provide('drawerVisible', drawerVisible)
</script>
<style lang='scss' scoped></style>