<template>
    <div class="flex flex-col w-full mt-2 pointer courier">

        <div class="flex w-full">
            <div class="mr-4">
                <div class="w-[52px] h-[52px] rounded-xl xt-bg-2 flex justify-center items-center pointer">
                    <newIcon icon="fluent-emoji:package" style="font-size: 32px;text-align: center;"></newIcon>
                </div>
            </div>
            <div class="w-full">
                <div class="flex justify-between">
                    <div class="flex items-center">
                        <div class="commerce-small" style="background-color: #FA5000;color: rgba(255,255,255,0.85);"
                            v-if="isTb">淘</div>
                        <div class=" commerce-small" style="background-color: #E12419;color: rgba(255,255,255,0.85);"
                            v-if="isJd">JD</div>
                        <div style="font-size: 16px;" class="mr-2 xt-text">{{ courierCode }}</div>
                        <newIcon icon="fluent:star-12-regular" style="font-size: 20px;" class="xt-text" />
                    </div>

                    <div class="flex xt-text-2" style="font-size: 14px;text-align: center;">

                        <div class="flex items-center pl-1 pr-1 rounded-md" :style="{ 'background': stateColors }"
                            style="color: rgba(255,255,255,0.85);">
                            {{ switchState }}
                        </div>
                    </div>
                </div>
                <div class="flex justify-between mt-1">
                    <div class="flex">
                        <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2 xt-text-2">
                            {{ switchCompany }}
                        </div>
                        <!-- v-if="props?.courier.parentId" -->
                        <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2 xt-text-2" v-if="props.courier.parentOrderId">
                            拆</div>
                    </div>

                    <div class="xt-text" v-if="props.courier.arrivalAt">
                        预计到达时间
                    </div>
                </div>

            </div>

        </div>
        <div class="mt-2 xt-text-2" style="font-size: 14px;">
            {{ lastTraces?.AcceptTime }}
        </div>
        <div class="mt-2 xt-text omit" style="font-size: 14px;">
            {{ lastTraces?.AcceptStation }}
        </div>



    </div>
    <!-- <a-divider style="height: 1px; background-color: var(--divider)" /> -->
    <!-- <hr class="divider"> -->
    <!-- <div class="divider"></div> -->
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon as newIcon } from '@iconify/vue';
import { kdCompany, kdState, switchColor } from './mock'
import { courierStore } from '../../../store/courier.ts'
import { appStore } from '../../../store';
const props = defineProps({ 
    courier: Object,
    itemIndex: Number
})
// console.log('查看数据',props.courier);
const useCourierStore = courierStore()
const useAppStore=appStore()
const stateColors = computed(() => {
    return switchColor(props.courier?.State)
})

const switchState = computed(() => {
    return kdState(props.courier?.State)
})

const switchCompany = computed(() => {
    return kdCompany(props.courier?.ShipperCode)
})

const courierCode = computed(() => {
    const orderNum = props.courier?.LogisticCode
    const changCode = `${orderNum.slice(0, 4)}-${orderNum.slice(-4)}`
    return changCode
})

const lastTraces = ref(null)

const newTraces = computed(() => {
    switch (props?.courier?.State) {
        case '3':
            return {
                AcceptStation: props.courier?.Traces[props.courier?.Traces.length - 1]?.AcceptStation,
                AcceptTime: props.courier?.Traces[props.courier?.Traces.length - 1]?.AcceptTime
            }
        case '2':
            return {
                AcceptStation: props.courier?.Traces[0]?.AcceptStation,
                AcceptTime: props.courier?.Traces[0]?.AcceptTime
            }
    }
})

lastTraces.value = newTraces.value
const deleteTime=computed(()=>{
    switch (useAppStore.settings.courierSigned.courierTime) {
        case '24小时':
            return 24 * 60 * 60 * 1000
            break;
        case '48小时':
            return 48 * 60 * 60 * 1000
            break;
        case '一周':
            return 7 * 24 * 60 * 60 * 1000
            break;
        default:24 * 60 * 60 * 1000
            break;
    }
})
onMounted(()=>{
    // console.log(lastTraces?.value.AcceptTime)
    console.log(new Date(lastTraces?.value.AcceptTime).getTime())
    let nowDate=new Date().getTime()
    if(nowDate - new Date(lastTraces?.value.AcceptTime).getTime()>(deleteTime.value)){
        console.log('过期了',props.itemIndex);
        useCourierStore.removeDbData(props.itemIndex)
    }else{
        console.log('没过期');
    }
})

</script>

<style lang='scss' scoped>
.omit {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

.courier {
    // border: 1px solid var(--divider);
    border-radius: 12px;
    padding: 12px;
    transform: all 0.3s;
    // border-bottom: 1px solid var(--divider);
    &:hover {
        background-color: var(--active-secondary-bg);
    }
    // &::after{
    //     content: '';
    //     display: block;
    //     width: 100%;
    //     height: 1px;
    //     background-color: var(--divider);
    // }
    
}
.divider{
    width: 100%;
    height: 1px;
    background-color: var(--divider);
    margin-top: 6px;
}
.commerce {
    &-small {
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        margin-right: 6px;
        text-align: center;
        color: var(--primary-text);
        border-radius: 6px;
    }
}</style>