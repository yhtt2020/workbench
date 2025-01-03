<template>
    <div @click="clickRightListItem(item)" :class="{'selected':item.active}"
        class="relative flex flex-col items-center justify-center rounded-xl pointer"
        :style="[checked, { width: size + 'px', height: size + 'px'}]">

       <div style="position:absolute;left: 10px;top: 10px;">
          <xt-new-icon  v-if="item.active" icon="fluent:checkmark-starburst-16-filled" color="var(--active-bg)" :size="15"></xt-new-icon>
       </div>
        <xt-button v-if="item.type === 'folder' && showFolder" w="48" h="22" radius="6" type="theme" style="font-size: 12px;"
            class="absolute z-50 top-2 left-2">
            图标组
        </xt-button>
        <div class="w-[64px] h-[64px] rounded-xl  flex items-center justify-center">
            <div style="width: 64px; height:64px;border-radius: 8px;" v-if="item.type !== 'folder' || !showFolder"
                class="flex items-center justify-center rounded-lg ">
                <a-avatar :size="64" shape="square" :src="item.icon"></a-avatar>
            </div>
            <div style="width: 64px; height:64px;border-radius: 8px;" v-else
                class="relative flex items-center justify-center rounded-lg icon-img">
                <a-avatar class="absolute flex-shrink-0" :size="64" shape="square" :src="i.icon"
                    v-for="(i, index) in item.children.slice(0, 3)">
                </a-avatar>
            </div>
        </div>
        <div class="pl-3 pr-3 mt-3 mb-2 text-base xt-text omit-1 flex" >
          <div>
            {{ item.name }}</div></div>
        <div class="pl-3 pr-3 text-sm text-center xt-text-2 omit-1">{{ msg }}</div>
        <div class="absolute top-2 right-2" v-if="isMultiple">
            <xt-button w="32" h="32" radius="8" class="xt-bg">
                <a-checkbox v-model:checked="isCheck" @change="multiple"></a-checkbox>
            </xt-button>

        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, computed, toRefs, watch } from 'vue'

// 单选和多选模式相关数据
import { useIconStore } from '../store';
import { storeToRefs } from 'pinia';
const iconStore = useIconStore()
const { multipleList, isMultiple } = storeToRefs(iconStore)

const props = defineProps({
    item: Object,  // 图标对象
    info: String,  // 图标提示
    size:{
        type: Number,
        default: 168
    },
    isApp:{
        type: Boolean,
        default: false
    },
    showFolder:{
        type: Boolean,
        default: true
    }
})
const { item, info, size, isApp, showFolder } = toRefs(props)

const emit = defineEmits(['clickRightListItem'])

const isCheck = ref(false)

// 在多选的模式下，点击后修改样式
const checked = computed(() => {
    if (isCheck.value) {
        return {
            border: '1px solid var(--active-bg)',
            background: 'var(--active-secondary-bg)',
        };
    } else {
        return {
            background: isApp.value ? '' : 'var(--secondary-bg)'
        };
    }
});

const msg = computed(() => {
    if (info?.value) {
        return info.value
    } else {
        return item?.value.value
    }
})

// 在单选模式下，点击后触发事件，进行添加
const clickRightListItem = (item) => {
    if (isMultiple.value) {
        isCheck.value = !isCheck.value
        return
    }
    emit('clickRightListItem', item)
}

// 在多选模式下，添加到多选列表
watch(
    () => isCheck.value,
    (newV) => {
        if (newV) {
            iconStore.addList(item.value)
        } else {
            iconStore.removeList(item.value)
        }
    }
)

watch(
    () => isMultiple.value,
    (newVal, oldVal) => {
        if (!newVal && oldVal) {
            isCheck.value = false
        }
    }
)

</script>
<style lang='scss' scoped>
.selected{
  background: var(--third-bg)  !important;
}
.omit-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    display: block;
    /* 使用块级元素 */
    max-width: 150px;
    /* 设置适当的最大宽度 */
    white-space: nowrap;
}

.icon-img {
    & :nth-of-type(1) {
        right: -60px;
    }

    & :nth-of-type(2) {
        right: -5px;
    }

    & :nth-of-type(3) {
        right: 47px;
    }
}
</style>
