<template>
    <div>
        <div class="mt-2">
            <div class="flex ">
              <div class="flex items-center justify-center mr-4 rounded-lg">
                <Cover :cover="courier.cover" :store="courier.store" bg="var(--mask-bg)"></Cover>
              </div>
                <div class="ml-2 flex flex-col justify-between h-[56px]" >
                    <div class="text-base xt-text pointer">
                        {{ item.title }}
                    </div>
                    <div class="flex xt-text-2 h-[24px]" style="font-size: 14px;text-align: center;">
                        <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2">
                            {{item.company }}
                        </div>
                        <div class="pl-1 pr-1 rounded-md h-[24px] flex items-center" :style="{ 'background': stateColors }" style="color: rgba(255,255,255,0.85);">
                          {{ item.stateText }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full h-[84px] xt-bg rounded-xl p-3 pt-2 mt-2 pointer" style="text-align: left;">
                <div class="xt-text-2 ">
                  {{ item.lastNodeTime }}
                </div>
                <div :title="item.lastNodeSummary" class="mt-1 xt-text omit " :class="choseOmit">
                  {{ item.lastNodeSummary }}
                </div>
                <div class="xt-text-2">
                    {{ item?.content?.arrivalAt.replaceAll('您的订单','') }}
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive,computed,onMounted } from 'vue'
import { Icon as newIcon } from '@iconify/vue'
import { courierStore } from '../../../apps/ecommerce/courier'
import { kdCompany, kdState,switchColor } from './mock'
import Cover from './component/Cover.vue'
import { preHandleItem } from './courierTool'
const useCourierStore = courierStore()

const props = defineProps({ courier: Object })

const stateColors = computed(()=>{
  return switchColor(props.courier?.State)
})

const item=preHandleItem(props.courier)
const choseOmit=computed(()=>{
    if(item?.content?.arrivalAt){
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
