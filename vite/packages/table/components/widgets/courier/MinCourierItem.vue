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
                        <div class="pl-1 pr-1 rounded-md h-[24px] flex items-center" :style="{ 'background': stateColors }" style="color: rgba(255,255,255,0.85);">
                            {{ switchState }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full h-[84px] xt-bg rounded-xl p-3 pt-2 mt-2 pointer" style="text-align: left;">
                <div class="xt-text-2 ">
                    {{ lastTraces?.AcceptTime }}
                </div>
                <div class="mt-1 xt-text omit" :class="choseOmit">
                    {{ lastTraces?.AcceptStation }}
                </div>
                <div class="xt-text-2">
                    {{ props?.courier?.arrivalAt }}
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive,computed,onMounted } from 'vue'
import { Icon as newIcon } from '@iconify/vue'
import { courierStore } from '../../../store/courier'
import { kdCompany, kdState,switchColor } from './mock'
const useCourierStore = courierStore()

const props = defineProps({ courier: Object })

const stateColors = computed(()=>{
  return switchColor(props.courier?.State)
})

const courierCode = computed(()=>{
    const orderNum = props.courier?.LogisticCode
    const changCode = `${orderNum.slice(0,4)}-${orderNum.slice(-4)}`
    return changCode
})


const switchCompany = computed(() => {
    return kdCompany(props?.courier?.ShipperCode)
})
const switchState = computed(() => {
    return kdState(props?.courier?.State)
})
const lastTraces = ref(null);

const newTraces = computed(()=>{
   switch (props?.courier?.State) {
    case '3':
       return {
         AcceptStation:props.courier?.Traces[props.courier?.Traces.length - 1]?.AcceptStation,
         AcceptTime:props.courier?.Traces[props.courier?.Traces.length - 1]?.AcceptTime
        }
    case '2':
       return {
         AcceptStation:props.courier?.Traces[0]?.AcceptStation,
         AcceptTime:props.courier?.Traces[0]?.AcceptTime
        }
   }
})

lastTraces.value = newTraces.value
const choseOmit=computed(()=>{
    if(props.courier?.arrivalAt){
        return 'omit-1'
    }else{
        return 'omit-2'
    }
})
</script>
<style lang='scss' scoped>
.omit{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
.omit-2{
    -webkit-line-clamp: 2;
}
.omit-1{
    -webkit-line-clamp: 1;
}
</style>