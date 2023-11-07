<template>
    <div v-if="topCourierVisible" style="position: absolute; top: 40px;z-index: 500;left: 10px;">
        <div class="w-[572px] h-[420px] rounded-xl p-4 " style="background-color: var(--secondary-bg);">
            <div class="flex justify-between h-[32px]">
                <div class="flex mt-2">
                    <div class="xt-text">
                        <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
                    </div>
                    <div class="flex ml-4 xt-text" style="margin-top: -6px;">
                        <TopDrop :navList="filterType" v-model:selectType="defaultType" />
                        <!-- <div class="text-base " style="line-height: 20px;">我的快递</div>
                     <div class="ml-3 text-base" style="line-height: 20px;">({{ this.courierDetailList.length }})</div> -->
                    </div>
                </div>
                <div class="flex">
                    <!-- <a-tooltip autoAdjustOverflow title="添加快递">
                     <xt-button :w="32" :h="32" class="ml-2 xt-bg" style="border-radius: 8px;" @click="addCourier">
                         <newIcon icon="fluent:add-16-filled" style="vertical-align: sub;"></newIcon>
                     </xt-button></a-tooltip> -->
                    <DropIndex :navList="addList" dropClass="xt-bg rounded-md" mClass="mr-2"></DropIndex>

                    <a-tooltip autoAdjustOverflow title="刷新">
                        <xt-button :w="32" :h="32" class=" xt-bg xt-text-2" style="border-radius: 8px;" @click="refreshCourier">
                            <div class="flex items-center justify-center">
                                <newIcon icon="fluent:arrow-counterclockwise-20-filled" style="vertical-align: sub;font-size: 1.25rem;"></newIcon>
                            </div>
                            
                        </xt-button></a-tooltip>
                    <a-tooltip autoAdjustOverflow title="设置">
                        <xt-button :w="32" :h="32" class="ml-2 xt-bg xt-text-2" style="border-radius: 8px;"
                            @click="openCourierSetting">
                            <div class="flex items-center justify-center">
                                <newIcon icon="fluent:settings-16-regular" style="vertical-align: sub;font-size: 1.25rem;"></newIcon>
                            </div>
                            
                        </xt-button></a-tooltip>
                    <a-tooltip autoAdjustOverflow title="关闭">
                        <xt-button :w="32" :h="32" class="ml-2 xt-bg xt-text-2" style="border-radius: 8px;" @click="showTopCourier">
                            <div class="flex items-center justify-center">
                                <newIcon icon="fluent:dismiss-16-filled" style="vertical-align: sub;font-size: 1.25rem;"></newIcon>
                            </div>
                            
                        </xt-button></a-tooltip>
                </div>
            </div>
            <!-- {{ this.storeInfo.jd.order }} -->
            <!-- {{ this.storeInfo.tb.order.orders.length }} -->
            <div v-if="isLoading">
                <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
            </div>
            <template v-else>
                <vue-custom-scrollbar ref="threadListRef" :key="currentPage" :settings="outerSettings"
                    style="height: calc(100% - 25px) ;overflow: hidden;flex-shrink: 0;width: 100%;">
                    <CourierItem v-for="(item, index) in courierDetailList" :key="index" :courier="item"
                        @click="viewDeliveryDetails(item)" />
                </vue-custom-scrollbar>
            </template>

        </div>
    </div>
    <xt-button :w="60" :h="27" v-if="this.settings.courierStatus.statusBar && courierDetailList.length > 0"
        style="background-color: var(--active-secondary-bg);margin-left: 12px;position: relative;color: var(--primary-text);"
        @click="showTopCourier">
        <div class="flex items-center justify-between">
           <newIcon icon="fluent-emoji:package" style="font-size: 20px;margin-right: 4px;vertical-align: sub" />
        <span
            style="display: inline-block; width: 20px; height: 20px;background-color: var(--active-bg);border-radius: 50%;text-align: center;line-height: 20px;font-size: 14px;color: rgba(255,255,255,0.85);">{{
                allCouriers }}</span> 
        </div>
        
    </xt-button>
    <teleport to='body'>
        <AddCourierModal ref="addCourierRef" />
    </teleport>
    <teleport to='body'>
        <xt-modal v-if="showCourierDetail" v-model:visible="showCourierDetail" title="" :isFooter="false" zIndex="9"
            :isHeader="false" :boxIndex="100" :maskIndex="99">
            <LargeCourierDetail v-if="largeDetailVisible" @close="showCourierDetail = false" />
            <LogisticsDetail v-else :orderNum="orderNum" @close="closeCourierDetail" @back="backAllCoutiers" />
        </xt-modal>
    </teleport>
    <SmallCourierModal :show="showSmallDetail" @close-modal="smallDetailsVisible" />
    <teleport to='body'>
        <CourierSetting ref="courierSettingRef" />
    </teleport>
</template>
<script>
import { appStore } from "../../../store";
import Widget from '../../card/Widget.vue';
import { Icon as newIcon } from '@iconify/vue'
import CourierItem from './CourierItem.vue';
import { courier } from './mock'
import MinCourierItem from './MinCourierItem.vue';
import Empty from './Empty.vue'
import MinEmpty from './MinEmpty.vue';
import { courierStore } from '../../../store/courier.ts'
import { mapWritableState, mapActions } from 'pinia'
import TopDrop from "./courierModal/dropdown/index.vue";
import AddCourierModal from './courierModal/AddCourierModal.vue'
import LogisticsDetail from './courierModal/content/LogisticsDetail.vue';
import CourierSetting from './courierModal/CourierSetting.vue';
import LargeCourierDetail from "./courierModal/content/LargeCourierDetail.vue";
import SmallCourierModal from './courierModal/SmallCourierModal.vue'
import DropIndex from './courierModal/dropdown/DropIndex.vue';

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
        LogisticsDetail,
        CourierSetting,
        TopDrop,
        LargeCourierDetail,
        SmallCourierModal,
        DropIndex
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
            typeList: [
                {
                    title: '全部',
                    name: "全部",
                    type: "all"
                },
                {
                    title: '淘宝',
                    name: "淘宝",
                    type: "TB"
                },
                {
                    title: '京东',
                    name: "京东",
                    type: "JD"
                },

            ],
            largeDetailVisible: true,
            showSmallDetail: false,
            addList: [
                {
                    title: '京东账号', name: 'jd',
                    callBack: () => { }
                },
                {
                    title: '淘宝账号', name: 'tb',
                    callBack: () => { }
                },
                {
                    title: '自定义',
                    icon: 'fluent:add-16-filled',
                    callBack: () => {
                        this.addCourier()
                    }
                },
            ],
            defaultType:'',
        }
    },
    methods: {
        ...mapActions(courierStore, [
            // 'getCourierMsg',
            'getDbCourier', 'refreshCouriers'
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
            this.topCourierVisible = false
            // console.log(this.orderNum)
        },
        closeCourierDetail() {
            this.showCourierDetail = false
        },
        refreshCourier() {
            // console.log(this.storeInfo.jd.order.orders.length)
            this.refreshCouriers()
        },

        //打开设置
        openCourierSetting() {
            this.$refs.courierSettingRef.openSettingModal()
        },
        backAllCoutiers() {
            this.showSmallDetail = true,
                this.showCourierDetail = false
        },
        smallDetailsVisible() {
            this.showSmallDetail = false
        },
        handleResize() {
            let windoWidth = window.innerWidth;
            // console.log(windoWidth);
            if (windoWidth > 1200) {
                this.largeDetailVisible = true
                // this.courierShow = true;
            } else {
                this.largeDetailVisible = false
                // this.courierShow = false;
            }
            // console.log(windoWidth,'windoWidth')
        },

    },
    computed: {
        ...mapWritableState(courierStore, ['courierDetailList', 'couriersDetailMsg','storeInfo']),
        ...mapWritableState(appStore, ['settings']),
        filterType(){
            const allLength=this.courierDetailList.length + this.storeInfo.jd.order.orders.length + this.storeInfo.tb.order.orders.length
            const jdLength=this.storeInfo.jd.order.orders
            const tbLength=this.storeInfo.tb.order.orders
            const list=[...this.typeList]
            const filterList=list.map((item)=>{
                switch(item.type){
                    case 'all':
                        return {
                            title: `${item.title}${allLength!==0?`(${allLength})`:''}`,
                            name: item.name,
                            type: item.type
                        }
                    case 'JD':
                        return {
                            title: `${item.title}${jdLength.length!==0?`(${jdLength.length})`:''}`,
                            name: item.name,
                            type: item.type
                        }
                    case 'TB':
                        return {
                            title: `${item.title}${tbLength.length!==0?`(${tbLength.length})`:''}`,
                            name: item.name,
                            type: item.type
                        }
                }
            })
            return filterList
        },
        currentType(){
            return {
                title: `全部  (${this.courierDetailList.length + this.storeInfo.jd.order.orders.length + this.storeInfo.tb.order.orders.length})`,
                name: "全部",
                type: 'all'
            }
        },
        allCouriers(){
            return this.courierDetailList.length + this.storeInfo.jd.order.orders.length + this.storeInfo.tb.order.orders.length
        }

    },
    mounted() {
        this.getDbCourier()
        window.addEventListener("resize", this.handleResize)
        setTimeout(() => {
            this.defaultType=this.currentType
        }, 2000);
        
        
    },
    beforeDestroy() {
        window.addEventListener("resize", this.handleResize)
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
}</style>
