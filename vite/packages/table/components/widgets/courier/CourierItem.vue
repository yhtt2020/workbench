<template>
    <div class="flex w-full mt-2 pointer courier ">
        <div class="mr-4">
            <div class="w-[56px] h-[56px] rounded-xl xt-bg-2 flex justify-center items-center pointer">
                <newIcon icon="fluent-emoji:package" style="font-size: 32px;text-align: center;"></newIcon>
            </div>
        </div>
        <div class="w-full">
            <div class="flex justify-between">
                <div style="font-size: 16px;" class="xt-text">{{ courierCode }}</div>
                <div class="flex xt-text-2" style="font-size: 14px;text-align: center;">
                    <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2">
                        {{ switchCompany }}
                    </div>
                    <div class="flex items-center pl-1 pr-1 rounded-md" :style="{ 'background': stateColor }">
                        {{ switchState }}
                    </div>
                </div>
            </div>
            <div class="mt-2 xt-text-2" style="font-size: 14px;">
                {{ lastTraces.AcceptTime }}
            </div>
            <div class="mt-2 xt-text omit" style="font-size: 14px;">
                {{ lastTraces.AcceptStation }}
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon as newIcon } from '@iconify/vue';
import { courierStore } from '../../../store/courier'
import { kdCompany, kdState } from './mock'
const useCourierStore = courierStore()
const props = defineProps({ courier: Object })
const stateColor = computed(() => {
    switch (useCourierStore.courierMsgList.State) {
        case "0":
            return '#508BFE';
            break;
        case "1":
            return '#43CADE';
            break;
        case "2":
            return '#508BFE';
            break;
        case "3":
            return '#FA7B14';
            break;
        case "4":
            return '#52C41A';
            break;
        case "5":
            return '#508BFE';
            break;
        case "6":
            return '#508BFE';
            break;

        default:
            return '#508BFE';
    }
})
const courierCode=computed(()=>{
    const code=useCourierStore.courierMsgList.LogisticCode
    let start=code.substring(0,4)
    let end=code.substring(code.length-4)
    return ` ${start} - ${end}`
})
const switchCompany = computed(() => {
    return kdCompany(useCourierStore.courierMsgList.ShipperCode)

})
const switchState = computed(() => {
    return kdState(useCourierStore.courierMsgList.State)
})
const lastTraces = ref({AcceptTime:null,AcceptStation:null})
onMounted(() => {
    useCourierStore.getCourierMsg(props.courier.shopperCode, props.courier.logisticCode)
    setTimeout(() => {
        lastTraces.value = useCourierStore.courierMsgList.Traces[useCourierStore.courierMsgList.Traces.length - 1]
    });
})
</script>
<style lang='scss' scoped>
.omit {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}

.courier {
    // border: 1px solid var(--divider);
    border-radius: 12px;
    padding: 12px;
    transform: all 0.3s;

    &:hover {
        background-color: var(--active-secondary-bg);
    }
}
</style>