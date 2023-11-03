<template>
    <div>
        <div class="mt-2">
            <div class="flex ">
                <div class="w-[56px] h-[56px] rounded-xl xt-bg-2 flex justify-center items-center pointer">
                    <newIcon icon="fluent-emoji:package" style="font-size: 32px;text-align: center;"></newIcon>
                </div>
                <div class="ml-2 flex flex-col justify-between h-[56px]" >
                    <div class="text-base xt-text pointer">
                        {{ courierCode }}
                    </div>
                    <div class="flex xt-text-2 h-[24px]" style="font-size: 14px;text-align: center;">
                        <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2">
                            {{switchCompany }}
                        </div>
                        <div class="pl-1 pr-1 rounded-md h-[24px] flex items-center" :style="{ 'background': stateColor }">
                            {{ switchState }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full h-[84px] xt-bg rounded-xl p-3 pt-2 mt-2 pointer" style="text-align: left;">
                <div class="xt-text-2 ">
                    {{ props.courier.Traces[props.courier.Traces.length-1].AcceptTime }}
                </div>
                <div class="mt-1 xt-text omit">
                    {{ props.courier.Traces[props.courier.Traces.length-1].AcceptStation }}
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,computed,onMounted } from 'vue'
import { Icon as newIcon } from '@iconify/vue'
import { courierStore } from '../../../store/courier'
import { kdCompany, kdState,switchColor } from './mock'
const useCourierStore = courierStore()
const props = defineProps({ courier: Object })
const stateColor = computed(() => {
    return switchColor(props.courier.State)
})
const courierCode=computed(()=>{
    const code=props.courier.LogisticCode
    let start=code.substring(0,4)
    let end=code.substring(code.length-4)
    return ` ${start} - ${end}`
})
const switchCompany = computed(() => {
    return kdCompany(props.courier.ShipperCode)
})
const switchState = computed(() => {
    return kdState(props.courier.State)
})
// const lastTraces = ref({AcceptTime:null,AcceptStation:null})
// onMounted( async () => {
//     await useCourierStore.getCourierMsg(props.courier.shipperCode, props.courier.logisticCode,props.courier.customerName)
//     // console.log(props.courier.shipperCode, props.courier.logisticCode);
    
//     // setTimeout(() => {
//     lastTraces.value = await useCourierStore.courierMsgList.Traces[useCourierStore.courierMsgList.Traces.length - 1]
//     // });
// })
</script>
<style lang='scss' scoped>
.omit{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>