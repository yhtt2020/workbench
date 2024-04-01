<template>
    <a-tooltip :title="item.tip">
        <div 
            @contextmenu="item.rightFn"
            @click="item.fn"
            class="h-[28px] flex justify-center items-center xt-bg rounded-md max-w-[164px] p-2">
            <xt-new-Icon 
                :icon="item.icon" 
                size="14" 
                class="flex-shrink-0" 
                v-if="item.icon" 
                :class="item.name !== '' ? 'mr-1': ''">
            </xt-new-Icon>
            <a-avatar 
                :size="14" 
                :src="item.avatar" 
                v-else-if="item.avatar" 
                class="flex-shrink-0" 
                :class="item.name !== '' ? 'mr-1': ''">
            </a-avatar>
            <div class="omit">
                {{ item.name }}
            </div>
        </div>
    </a-tooltip>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'

interface PropsType {
    item: {
        icon: string;
        avatar?: string;
        tip: string;
        name: string;
        w: number;
        fn: () => void;
        rightFn: () => void;
    };
}

const props = withDefaults(defineProps<PropsType>(), {
    item: {
        icon: 'fluent:box-16-regular',
        tip: '点击打开查看快递状态',
        name: '快递',
        w: 60,
    }
});
</script>
<style lang='scss' scoped></style>