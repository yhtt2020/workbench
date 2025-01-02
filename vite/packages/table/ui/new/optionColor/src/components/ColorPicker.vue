<template>
    <!-- ref="tippyRef" -->
    <tippy
        :zIndex="(9999999 + 10)"
        ref="tippyRef"
        trigger="click"
        placement="right"
        :interactive="true"
        :appendTo="body"
        :arrow="false">
        <xt-button
            :w="40"
            :h="40"
            class="xt-bg"
            icon="fluent:more-horizontal-16-regular">
        </xt-button>
        <template #content>
            <div class="w-[385px] rounded-xl shadow p-4 -mt-2 -mr-3 -ml-3 -mb-2 xt-modal">
                <div class="flex justify-between mb-4">
                    <div class="text-base xt-text-2">推荐颜色</div>
                    <!-- <xt-button :w="24" :h="24"> -->
                    <xt-new-icon icon="fluent:dismiss-circle-16-filled" size="24" @click="hideTippy"></xt-new-icon>
                    <!-- </xt-button> -->
                </div>
                <div class="flex flex-1 ml-2 mr-2">
                    <div class="item-box">
                        <div class="flex items-center justify-center item" :key="item"
                            :style="{ background: props.defaultList[`${'color' + item}`] }"
                            v-for="(item, index) in Object.keys(props.defaultList).length" @click="chooseDf(item)">
                            <xt-new-icon v-show="color == props.defaultList[`${'color' + item}`]" icon="ri:checkbox-circle-fill" size="20"></xt-new-icon>
                        </div>

                        <div class="w-[40px] h-[40px] pointer">
                           <img src="/img/bg.png" class="w-[40px] h-[40px] absolute" style="object-fit: cover;z-index: 999;pointer-events: none;">
                           <XtBaseColor
                                v-model:data="defaultColor"
                                @update:data="updateBackground">
                            </XtBaseColor>
                        </div>

                    </div>
                </div>


                <div v-if="props.isLinear" class="h-[1px] w-full mt-4 mb-4" style="background: var(--divider);"></div>

                <div v-if="props.isLinear">
                    <div class="mb-4 text-base xt-text-2">渐变色</div>
                    <div class="flex flex-1 ml-2 mr-2">
                        <div class="item-box">
                            <div class="flex items-center justify-center item" :key="item"
                                :style="{ background: props.linearList[`${'color' + item}`] }"
                                v-for="(item, index) in Object.keys(props.linearList).length" @click="chooseLinear(item)">
                                <xt-new-icon v-show="color == props.linearList[`${'color' + item}`]" icon="ri:checkbox-circle-fill"
                                    size="20"></xt-new-icon>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </template>

    </tippy>
</template>

<script setup lang='ts'>
import { ref, toRefs, computed, onMounted } from 'vue'
import 'tippy.js/dist/tippy.css';
import {message} from 'ant-design-vue'

const colorIndex = ref(0)
const linearIndex = ref(0)
const defaultColor = ref('#508BFE')
const emit = defineEmits(['change'])
// tippy弹窗
const tippyRef = ref(null)
export interface colorPicker {
    // 普通颜色列表
    defaultList: {
        [key: string]: string
    },
    // 渐变色列表
    linearList: {
        [key: string]: string
    },
    // 是否显示渐变色
    isLinear?: boolean,
    // 选中的颜色
    color: string,
}
const props = withDefaults(defineProps<colorPicker>(), {
    defaultList: {
        color1: '#508BFE',
        color2: '#815BD0',
        color3: '#C8BF55',
        color4: '#DE5D5D',
        color5: '#57BF60',
        color6: '#DE5DB3',
        color7: '#000000',
        // color8: '#DE5DB3',
        color8: '#43CADE',
        color9: '#FFFFFF',
    },
    linearList: {
        color1: ' linear-gradient(135deg, #A8A9EE 0%, #3398DA 100%)',
        color2: ' linear-gradient(135deg, #CEA8EE 0%, #333ADA 100%)',
        color3: ' linear-gradient(135deg, #549FA6 0%, #33DA9E 100%)',
        color4: ' linear-gradient(135deg, #EEA8A8 0%, #DA337A 100%',
        color5: '  linear-gradient(135deg, #C0EEA8 0%, #DAAD33 100%)',
        color6: '  linear-gradient(135deg, #D55E5E 0%, #DA6733 100%)',
        color7: '  linear-gradient(135deg, #A8BCEE 0%, #3363DA 100%)',
        color8: ' linear-gradient(135deg, #EEA8A8 0%, #33B4DA 100%)',
        color9: '  linear-gradient(135deg, #EEA8A8 0%, #B633DA 100%)',
        color10: ' linear-gradient(135deg, #A8EEA8 0%, #3354DA 100%)',
        color11: 'linear-gradient(to right, rgb(0, 0, 0), rgb(67, 67, 67))',
        color12:'linear-gradient(to right, rgb(118, 184, 82), rgb(141, 194, 111))',
    },
    isLinear: true,

})

const { color} = toRefs(props);
// Object.keys(linearList).length
const body = computed(() => {
    return document.body
})
/**
 * 默认色
 * @param item
 */
const chooseDf = (item) => {
    if (colorIndex.value === item) {
        colorIndex.value = 0;
        emit('change', '');
    } else {
        colorIndex.value = item;
        linearIndex.value = 0;
        emit('change', props.defaultList[`color${item}`]);
    }
    hideTippy()
}
/**
 * 线性渐变
 */
const chooseLinear = (item) => {
    if (linearIndex.value === item) {
        linearIndex.value = 0;
        emit('change', '');
    } else {
        linearIndex.value = item;
        colorIndex.value = 0;
        emit('change', props.linearList[`color${item}`]);
    }
    hideTippy()
}
/**
 * 取色器
 */
const updateBackground = () => {
    // 由于新的取色器返回的是rgb格式，需要转为16进制
    const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/
    const match = defaultColor.value.match(regex)
    if (match) {
        const r = parseInt(match[1])
        const g = parseInt(match[2])
        const b = parseInt(match[3])
        const hex = rgbToHex(r, g, b)
        emit('change', hex)
    }
    // 转为16进制格式
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }
}

// 容错处理，防止没有获取到tippyRef，导致页面卡死
const hideTippy = () => {
    if(tippyRef.value){
        tippyRef.value.hide()
    }else{
        message.error('自动关闭失败，请手动关闭')
    }
}
</script>
<style lang='scss' scoped>
.item {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
}

.item-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-center;
    gap: 16px;

}

.shadow {
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.03);
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.2);
}

:deep(.vc-color-wrap) {
    width: 40px;
    height: 40px;
    border-radius: 12px;
}

:deep(.zs-color-picker-btn-color) {
    border-radius: 12px;
    background-size: cover;
    opacity: 0.2;
}
</style>
