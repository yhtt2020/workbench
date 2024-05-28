<template>
    <!-- 弹窗 -->
    <div 
        v-if="modelValue" 
        class="p-4 text-sm rounded-xl xt-modal xt-shadow xt-text max-w-[400px] "
        style="
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
      ">
        <div class="flex justify-between">
            <div class="flex items-center">
                <div class="mr-4">
                    <xt-new-icon icon="fluent:info-12-filled"/>
                </div>
                <span class="xt-text">Tips</span>
            </div>
            <xt-new-icon icon="fluent:dismiss-16-regular" :size="16" @click="close" v-if="closeVisible"/>
        </div>

        <div class="w-full my-2 xt-text-2" style="margin-left: 40px;">
            将你常用的应用固定到此处，方便后续进行快速访问。
            <div class="mt-2 pointer xt-theme-text xt-active" @click="jumpMy">浏览我的应用</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, onMounted } from 'vue';
const props = defineProps({
    modelValue: {
        default: true,
    },
    closeVisible:{
        default:true
    }
});

const { modelValue, closeVisible } = toRefs(props);

const emit = defineEmits(['close', 'update:modelValue', 'update:closeVisible', 'jumpMy']);

// 关闭弹窗回调
const close = () => {
    emit('close')
    // 关闭弹窗
    emit('update:modelValue', false)
    // 隐藏关闭按钮
    emit('update:closeVisible', false)
}

// onMounted(() => {
//     emit('update:modelValue', true)
//     console.log('closeVisible', true)
// })

const jumpMy = () => {
    emit('jumpMy')
}
</script>

<style lang="scss" scoped></style>