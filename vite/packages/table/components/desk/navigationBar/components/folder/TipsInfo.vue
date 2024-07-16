<template>
    <div style="width: 355px">
        <div class="flex items-center justify-between h-full mb-3">
            <div class="flex ">
                <xt-ify-icon icon="fluent-emoji:light-bulb" class="mr-1" size="22"></xt-ify-icon>
                <div class="flex items-center text-base font-16">Tips</div>
            </div>
            <xt-ify-icon @click="close" size="30" icon="fluent:dismiss-circle-16-filled" class="xt-text-2" />
        </div>
        <div class="my-3 xt-text-2 font-16">
            按住「CTRL」键拖动图标可以进行复制操作。
        </div>
        <div class="flex" style="justify-content: flex-end;">
            <div class="flex justify-between mt-3">
                <xt-button
                    @click="neverTips"
                    type="default"
                    w="124"
                    h="32"
                    radius="8"
                    :plain="true"
                    class="mr-4"
                    style="background-color: var(--secondary-bg);">下次不再提示</xt-button>
                <xt-button
                    @click="close"
                    type="theme"
                    w="84"
                    h="32"
                    radius="8"
                    :plain="true"
                    style="background-color: var(--active-bg);">好的</xt-button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { storeToRefs } from "pinia";
import XtButton from "../../../../../ui/libs/button/index.vue";
import XtIfyIcon from "../../../../../ui/new/IfyIcon/index.vue";
import { useNavBarStore } from "../../navBar";
const navBarStore = useNavBarStore();
const { neverTip } = storeToRefs(navBarStore);
const emits = defineEmits(["close-toast"]);
const close = () => {
    emits("close-toast");
    console.log('关闭');
};
const neverTips = () => {
    console.log('下次不再提示')
    neverTip.value = true;
    emits("close-toast");
}
</script>

<style lang="scss" scoped></style>
