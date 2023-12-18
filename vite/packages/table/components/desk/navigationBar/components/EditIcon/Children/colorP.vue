<template>
    <tippy trigger="click" placement="right" :interactive="true" :appendTo="body">
        <xt-button :w="40" :h="40" class="xt-bg"><xt-new-icon icon="fluent:more-horizontal-16-regular"></xt-new-icon></xt-button>
        <template #content>
            <div class="w-[320px] rounded-xl shadow p-4 ">
                <div class="flex justify-between mb-4">
                    <div class="text-base xt-text-2">推荐颜色</div>
                    <xt-button :w="24" :h="24">
                        <xt-new-icon icon="fluent:dismiss-circle-16-filled" size="24" class="ml-1"></xt-new-icon>
                    </xt-button>
                </div>
                <div class="item-box">
                    <div class="flex items-center justify-center mr-4 item" :key="item"
                        :style="{ background: props.defaultList[`${'color' + item}`] }" v-for="(item, index) in 9"
                        @click="chooseDf(item)">
                        <xt-new-icon v-show="colorIndex == item" icon="ri:checkbox-circle-fill" size="20"></xt-new-icon>
                    </div>
                    <a-avatar shape="square" src="/img/bg.png" style="width: 40px; height: 40px;border: 1px solid var(--divider);border-radius: 12px;"
                        class="pointer rounded-xl" />
                </div>
                <div class="h-[1px] w-full mt-4 mb-4" style="background: var(--divider);"></div>
                <XtBaseColor v-model:data="defaultColor" @update:data="updateBackground"></XtBaseColor>
                <div class="mb-4 text-base xt-text-2">渐变色</div>
                <div class="item-box">
                    <div class="flex items-center justify-center mr-4 item" :key="item"
                        :style="{ background: props.linearList[`${'color' + item}`] }" v-for="(item, index) in 10"
                        @click="chooseLinear(item)">
                        <xt-new-icon v-show="linearIndex == item" icon="ri:checkbox-circle-fill" size="20"></xt-new-icon>
                    </div>
                    <!-- <a-avatar shape="square" src="/img/bg.png" style="width: 40px; height: 40px" class="pointer rounded-xl"/> -->
                </div>

            </div>

        </template>

    </tippy>
</template>

<script setup lang='ts'>
import { ref, reactive,computed,watch } from 'vue'
const colorIndex = ref(0)
const linearIndex = ref(0)
const defaultColor = ref('#508BFE')
const emit = defineEmits(['change'])
export interface colorPicker {
    defaultList: {
        [key: string]: string
    },
    linearList: {
        [key: string]: string
    },
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
    }

})
const body = computed(()=>{
    return document.body
})
const chooseDf = (item) => {
    if (colorIndex.value === item) {
        colorIndex.value = 0;
        emit('change', '');
    } else {
        colorIndex.value = item;
        linearIndex.value = 0;
        emit('change', props.defaultList[`color${item}`]);
    }
}

const chooseLinear = (item) => {
    if (linearIndex.value === item) {
        linearIndex.value = 0; 
        emit('change', '');
    } else {
        linearIndex.value = item;
        colorIndex.value = 0;
        emit('change', props.linearList[`color${item}`]);
    }
}
const updateBackground = () => {
    emit('change', defaultColor.value)
}
</script>
<style lang='scss' scoped>
.item {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 16px;
}

.item-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
.shadow{
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
}
:deep(.tippy-box){
    border-radius: 12px !important;
    padding: 0px;
    background: var(--modal-bg);
    & .tippy-content{
        background: var(--modal-bg) !important;
        padding: 0px;
    }
}
</style>