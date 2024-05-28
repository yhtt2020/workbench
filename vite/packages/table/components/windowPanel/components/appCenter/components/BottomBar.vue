<template>
    <div class="w-full h-[56px] xt-bg rounded-b-2xl flex justify-between flex-shrink-0">
        <div class="flex items-center justify-between gap-2 p-4 text-sm pointer" @click="goApps('MyApps')">
            <xt-new-icon icon="fluent:grid-16-filled" size="16"></xt-new-icon>
            全部应用
        </div>
        <div class="flex items-center justify-between gap-1 p-2">
            <xt-button :w="40" :h="40" @click="goApps('Market')" icon="fluent:building-shop-16-filled"
                style="background-color: transparent;" :iconSize="16">
            </xt-button>
            <xt-button :w="40" :h="40" icon="fluent:settings-16-filled" @click="goApps('Setting')"
                style="background-color: transparent;" :iconSize="16">
            </xt-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

const emit = defineEmits(['goApps'])

const goApps = (key: string) => {
    emit('goApps', key)
}

</script>
<style lang='scss' scoped></style>