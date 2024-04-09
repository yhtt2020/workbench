<template>
    <div :class="boxClass" v-if="!isTop && list.length > 0">
        <Box 
            @closeAll="closeAll"
            :main-class="mainClass"
            :list="list">
        </Box>
    </div>
    <div v-else-if="isTop" class="w-full h-[28px] flex gap-3">
        <Item v-for="item in list" :key="item.name" :item="item"></Item>
    </div>
    <!-- 快递 -->
    <Teleport to="body">
        <TopCourier 
            :position="pos" 
            v-if='courierVisible' 
            :topCourierVisible="courierVisible" 
            @close="courierVisible = false">
        </TopCourier>
        <!-- 番茄 -->
        <TopTomato
            v-if="tomatoVisible"
            :tomatoVisible="tomatoVisible"
            @close="tomatoVisible = false"
            :position="pos"
        ></TopTomato>
        <!-- 时钟 -->
        <TopClockTimer
            :position="pos"
            :clockVisible="clockVisible"
            @close="clockVisible = false"
            v-if="clockVisible">
        </TopClockTimer>
    </Teleport>
    <!-- 左侧抽屉 -->
    <LeftDrawer 
        v-if="drawerVisible"
        ref="leftDrawerRef" 
        :status="status" 
        :hasEnable="clipboard.enable">
    </LeftDrawer>
</template>

<script setup lang='ts'>
import { ref, provide,computed,toRefs } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { getClientIcon,getCover,getIcon } from '../../js/common/game';
import { usePosition } from './hook/usePosition.ts';

import TopCourier from '../widgets/courier/TopCourier.vue';
import TopTomato from '../../apps/tomato/widget/TopTomato.vue';
import Box from './components/Box.vue';
import LeftDrawer from './components/LeftDrawer.vue';
import TopClockTimer from '../widgets/TopClockTimer.vue';
import Item from './components/Item.vue'

import { courierStore } from '../../apps/ecommerce/courier';
import { appStore } from '../../store';
import { clipboardStore } from '../../apps/clipboard/store';
import { steamUserStore } from '../../store/steamUser';
import { tomatoStore } from '../../apps/tomato/store';
import { cardStore } from '../../store/card';
import { countDownStore } from '../../store/countDown';
import { topClockSettingStore } from '../../store/topClockSetting';

// 路由
const router = useRouter()

// 快递数据
const useCourier = courierStore()
const { settings , courierList } = storeToRefs(useCourier)

// 音乐数据
const useAppStore = appStore()
const { status,aided } = storeToRefs(useAppStore)

// 剪切板数据
const useClipboard = clipboardStore()
const { settings: clipboard } = storeToRefs(useClipboard)

// steam用户数据
const useSteamUser = steamUserStore()
const { runningGame } = storeToRefs(useSteamUser)

// 番茄钟数据
const useTomato = tomatoStore()
const { 
    isFullState,
    minutes,
    seconds,
    isState,
    running,
} = storeToRefs(useTomato)

// 时钟数据
const useTopClockSetting = topClockSettingStore()
const { checkTopClock } = storeToRefs(useTopClockSetting)
const useCard = cardStore()
const { filterClockEvent } = storeToRefs(useCard)
const useCountDown = countDownStore()
const { countDowntime } = storeToRefs(useCountDown)

type propsType = {
    boxClass:string, // 在底部时，状态框的类样式
    isTop:boolean, // 是否在顶部，当在顶部时，便不再使用状态框，而是直接显示里面的状态块
    mainClass:string // 状态框中查看状态块的定位样式
}
const props = withDefaults(defineProps<propsType>(), {
    boxClass:'',
    isTop:false,
    mainClass:''
})

const { boxClass,isTop } = toRefs(props)

// 番茄钟时间填充
const displayNum = (num:number) => {
    return num < 10 ? '0' + num : num
}

// 判断状态栏时钟是否显示
const topClockVisible = computed( () => {
    // 设置中顶部栏是否显示
    const check = checkTopClock.value
    // 闹钟列表
    const eventList = filterClockEvent.value
    // 是否有倒计时
    const countDown = countDowntime.value.seconds
    return check && (eventList.length > 0 || countDown )
})

// 闹钟的图标和名称
const clockBaseMsg = computed(() => {
    const hasCountDown = countDowntime.value.hours !== undefined
    const firstClock = filterClockEvent.value ? filterClockEvent.value[0]?.dateValue : {hours:0,minutes:0} 
    if(hasCountDown){
        return {
            icon:'fluent:clock-16-regular',
            name:`${countDowntime.value.hours}:${countDowntime.value.minutes}:${countDowntime.value.seconds}`,
        }
    }
    return {
        icon:'fluent:clock-alarm-16-regular',
        name:`${firstClock.hours}:${firstClock.minutes}`,
    }
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

// 全部状态的队列
const queue : Array<queueType> = ref([
    {
        icon:'fluent:box-16-regular',
        name:computed(() => courierList.value.length),
        tip:'',
        fn:(e) => {
            const itemPosition = {
                x:572,
                y:420
            }
            const position = {
                x: e.clientX,
                y: e.clientY
            }
            pos.value = usePosition(position,itemPosition)
            courierVisible.value = ! courierVisible.value
        },
        disabled:computed(() => settings.value.courierStatus.statusBar)
    },
    {
        avatar:computed(() => status.value?.music?.cover),
        name:computed(() => {
            return `${status.value?.music?.title} - ${status.value?.music?.singer}`
        }),
        fn:() => {
            router.push({ name: 'music' })
        },
        rightFn:() => {
            // console.log('音乐')
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
            // console.log('剪切板')
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
    },
    {
        icon:'fluent-emoji:tomato',
        disabled:computed(() => isState.value && running.value),
        name: computed(() => {
            return displayNum(minutes.value) + ':' + displayNum(seconds.value)
        }),
        fn:(e) => {
            const itemPosition = {
                x:280,
                y:204
            }
            const position = {
                x: e.clientX,
                y: e.clientY
            }
            pos.value = usePosition(position,itemPosition)
            tomatoVisible.value = ! tomatoVisible.value
        }
    },
    {
        disabled:computed(() => topClockVisible.value),
        name: computed(() => {
            return clockBaseMsg.value.name
        }),
        icon: computed(() => clockBaseMsg.value.icon),
        fn:(e) => {
            console.log('3',e)
            const itemPosition = {
                x:300,
                y:300
            }
            const position = {
                x: e.clientX,
                y: e.clientY
            }
            pos.value = usePosition(position,itemPosition)
            clockVisible.value = ! clockVisible.value
        }
    },
    {
        name:"辅助模式",
        icon:'fluent:accessibility-16-regular',
        disabled:computed(() => aided.value),
    }
])

// 当前显示的状态列表
const list = computed(() => {
    const arr = []
    queue.value.forEach((item) => {
        if (item.disabled) {
            arr.unshift(item)
        }
    })
    return arr
})

// 快递
const courierVisible = ref(false)
// 番茄钟
const tomatoVisible = ref(false)
// 时钟
const clockVisible = ref(false)
// 右边抽屉
const drawerVisible = ref(false)
// 左边抽屉
const leftDrawerRef = ref(null)
// 定位
const pos = ref({})
// 左边抽屉
provide('drawerVisible', drawerVisible)

// 关闭所有弹窗
const closeAll = () => {
    clockVisible.value = false
    tomatoVisible.value = false
    courierVisible.value = false
}
</script>
<style lang='scss' scoped></style>
