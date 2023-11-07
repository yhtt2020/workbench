<template>
    <div class="flex flex-col items-center w-full" style="margin: 0 auto;">
        <div class="w-[452px] flex flex-col items-center  mt-3">
            <div>
                <newIcon icon="fluent-emoji:package" style="font-size: 56px;" />
            </div>
            <div class="p-4 xt-bg rounded-xl">
                在桌面上时刻关注你的快递动态，支持同步主流电商平台的订单列表，自定义添加快递单号，自定义修改快递名称和图标。
            </div>
            <div class="flex w-full p-4 mt-3 mb-5 pointer xt-bg rounded-xl">
                <div class="mr-4">
                    <div class="w-[56px] h-[56px] rounded-xl xt-bg-2 flex justify-center items-center pointer">
                        <newIcon icon="fluent-emoji:couch-and-lamp" style="font-size: 32px;text-align: center;"></newIcon>
                    </div>
                </div>
                <div class="w-full">
                    <div class="flex justify-between">
                        <div class="flex">
                            <div class=" commerce" style="background-color: #E12419;">JD</div>
                            <div style="font-size: 16px;" class="xt-text">IKEA宜家沙发（示例）</div>
                        </div>

                        <div class="flex xt-text-2" style="font-size: 14px;text-align: center;">
                            <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2">
                                中通快递
                            </div>
                            <div class="flex items-center pl-1 pr-1 rounded-md" style="background: #508BFE ;">
                                在途中
                            </div>
                        </div>
                    </div>
                    <div class="mt-2 xt-text-2" style="font-size: 14px;">
                        2023年10月22日 19:23
                    </div>
                    <div class="mt-2 xt-text" style="font-size: 14px;">
                        快件在「浙江陆运枢纽杭州」完成分拣，准备发往「嘉兴中通分拨」，根据规划班次预计发出时间「10月23日…
                    </div>
                </div>
            </div>
            <xt-button :w="95" :h="40" style="background: #508BFE;" class="xt-text" @click="addCourier">添加快递</xt-button>
        </div>
    </div>

    <AddCourierModal ref="addCourierRef" />
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Icon as newIcon } from '@iconify/vue'
import AddCourierModal from './courierModal/AddCourierModal.vue';

const addCourierRef = ref(null)

const addCourier = () => {
    addCourierRef?.value.openCourierModel()
}

</script>
<style lang='scss' scoped></style>