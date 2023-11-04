<template>
 <div v-if="topCourierVisible" style="position: absolute; top: 40px;z-index: 9999;left: 10px;">
     <div class="w-[572px] h-[420px] rounded-xl p-4 " style="background-color: var(--secondary-bg);">
         <div class="flex justify-between h-[32px]">
             <div class="flex mt-2">
                 <div class="xt-text">
                     <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
                 </div>
                 <div class="flex ml-4 xt-text">
                     <div class="text-base " style="line-height: 20px;">我的快递</div>
                     <div class="ml-3 text-base" style="line-height: 20px;">({{ this.courierDetailList.length }})</div>
                 </div>
             </div>
             <div class="flex">
                 <a-tooltip autoAdjustOverflow title="添加快递">
                     <xt-button :w="32" :h="32" class="ml-2 xt-bg" style="border-radius: 8px;" @click="addCourier">
                         <newIcon icon="fluent:add-16-filled" style="vertical-align: sub; padding-bottom: 2px;"></newIcon>
                     </xt-button></a-tooltip>
                 <a-tooltip autoAdjustOverflow title="刷新">
                     <xt-button :w="32" :h="32" class="ml-2 xt-bg" style="border-radius: 8px;" @click="refreshCourier">
                         <newIcon icon="fluent:arrow-counterclockwise-20-filled" style="vertical-align: sub;padding-bottom: 2px;"></newIcon>
                     </xt-button></a-tooltip>
                 <a-tooltip autoAdjustOverflow title="设置">
                     <xt-button :w="32" :h="32" class="ml-2 xt-bg" style="border-radius: 8px;">
                         <newIcon icon="fluent:settings-16-regular" style="vertical-align: sub;padding-bottom: 2px;"></newIcon>
                     </xt-button></a-tooltip>
                 <a-tooltip autoAdjustOverflow title="关闭">
                     <xt-button :w="32" :h="32" class="ml-2 xt-bg" style="border-radius: 8px;" @click="showTopCourier">
                         <newIcon icon="fluent:dismiss-16-filled" style="vertical-align: sub;padding-bottom: 2px;"></newIcon>
                     </xt-button></a-tooltip>
             </div>
         </div>
         <div v-if="isLoading">
             <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
         </div>
         <template v-else>
             <vue-custom-scrollbar ref="threadListRef" :key="currentPage" :settings="outerSettings"
                 style="height: calc(100% - 25px) ;overflow: hidden;flex-shrink: 0;width: 100%;">
                 <CourierItem v-for="(item, index) in courierDetailList" :key="index" :courier="item" @click="viewDeliveryDetails(item)" />
             </vue-custom-scrollbar>
         </template>

        </div>
    </div>
    <xt-button :w="60" :h="27" v-if="courierDetailList.length > 0"
        style="background-color: var(--active-secondary-bg);margin-left: 12px;position: relative;color: var(--primary-text);"
        @click="showTopCourier">
        <newIcon icon="fluent-emoji:package" style="font-size: 20px;margin-right: 4px;vertical-align: sub" />
        <span
            style="display: inline-block; width: 20px; height: 20px;background-color: var(--active-bg);border-radius: 50%;text-align: center;line-height: 20px;font-size: 14px;">{{
                courierDetailList.length }}</span>
    </xt-button>
    <teleport to='body'>
        <AddCourierModal ref="addCourierRef" />
    </teleport>
    <teleport to='body'>
        <xt-modal v-if="showCourierDetail" v-model:visible="showCourierDetail" title="" :isFooter="false" zIndex="9"
            :isHeader="false" :boxIndex="100" :maskIndex="99">
            <LogisticsDetail :orderNum="orderNum" @close="closeCourierDetail" @back="showCourierDetail = false" />
        </xt-modal>
    </teleport>
</template>
<script>
import Widget from '../../card/Widget.vue';
import { Icon as newIcon } from '@iconify/vue'
import CourierItem from './CourierItem.vue';
import { courier } from './mock'
import MinCourierItem from './MinCourierItem.vue';
import Empty from './Empty.vue'
import MinEmpty from './MinEmpty.vue';
import { courierStore } from '../../../store/courier.ts'
import { mapWritableState, mapActions } from 'pinia'
import AddCourierModal from './courierModal/AddCourierModal.vue'
import LogisticsDetail from './courierModal/content/LogisticsDetail.vue';
export default {
 name: '我的快递',
 components: {
     Widget,
     newIcon,
     CourierItem,
     MinCourierItem,
     Empty,
     MinEmpty,
     AddCourierModal,
     LogisticsDetail
 },
 data() {
     return {
         settingVisible: false,
         outerSettings: {
             useBothWheelAxes: true,
             swipeEasing: true,
             suppressScrollY: false,
             suppressScrollX: true,
             wheelPropagation: true,
         },
         topCourierVisible: false,
         couriersList: [],
         isLoading: false,
         showCourierDetail: false,
     }
 },
 methods: {
     ...mapActions(courierStore, [
         // 'getCourierMsg',
         'getDbCourier','refreshCouriers'
     ]),
     async showTopCourier() {
         this.topCourierVisible = !this.topCourierVisible
         // if (this.topCourierVisible == true) {
         //     this.couriersList = await this.couriersDetailMsg
         // }
     },
     addCourier() {
         this.topCourierVisible = false
         this.$refs.addCourierRef.openCourierModel()
     },
     // async refreshExpress() {
     //     this.isLoading=true
     //     this.couriersList = await this.couriersDetailMsg
     //     setTimeout(() => {
     //         this.isLoading=false
     //     });

     // }
     viewDeliveryDetails(item) {
         this.showCourierDetail = true
         this.orderNum = item
         this.topCourierVisible=false
         console.log(this.orderNum)
     },
     closeCourierDetail(){
         this.showCourierDetail=false
     },
     refreshCourier(){
        this.refreshCouriers()
     }

 },
 computed: {
     ...mapWritableState(courierStore, ['courierDetailList', 'couriersDetailMsg']),

 },
 mounted() {
     this.getDbCourier()
 },

}
</script>
<style lang="scss">
.courier {
 .add-courier {
     display: none;

 }

 &:hover {
     .add-courier {
         display: block;
     }
 }
}
</style>
