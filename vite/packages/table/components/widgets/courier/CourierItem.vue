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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon as newIcon } from '@iconify/vue';
import { stateColor,kdState,kdCompany } from './mock'

const props = defineProps({courier:Object})
console.log('查看数据',props.courier);

stateColor(props.courier?.State)

const switchState = computed(() => {
    return kdState(props.courier?.State)
})

const switchCompany = computed(() => {
    return kdCompany(props.courier?.ShipperCode)
})

const courierCode = computed(()=>{
    const orderNum = props.courier?.LogisticCode
    const changCode = `${orderNum.slice(0,4)}-${orderNum.slice(-4)}`
    return changCode
})

const lastTraces = ref(null)

lastTraces.value = {
    AcceptStation:props.courier?.Traces[0]?.AcceptStation,
    AcceptTime:props.courier?.Traces[0]?.AcceptTime
}

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