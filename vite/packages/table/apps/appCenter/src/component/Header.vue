<template>
    <div class="flex items-center justify-between pl-4">
        <div class="flex items-center">
            <xt-ify-icon :icon="props.icon" class="mr-2" />
            {{ props.title }}
        </div>
        <div class="flex items-center gap-3">
            <slot name="right"></slot>
            <Exit />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import Exit from './exit.vue'

interface PropsType {
    icon: string,
    title: string,
}

const props = withDefaults(defineProps<PropsType>(), {
    icon: "fluent:settings-16-regular",
    title: "设置",
});

</script>
<style lang='scss' scoped></style>