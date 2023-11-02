<template>
    <div v-if="topCourierVisible" style="position: absolute; top: 40px;z-index: 999999;left: 10px;">
        <!-- <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList"
            :showRightIcon="false" ref="cardSlot">
            <template #left-title-icon>
                <div class="icon"
                    style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
                    <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
                </div>
            </template>
            <div class="w-full h-full courier">
                <div style="position: absolute;left: 124px;top: 15px;">
                    ({{ this.courierDetailList.length }})
                </div>
                <div class="flex" style="position: absolute;right: 20px; top: 15px;">
                    <xt-button :w="32" :h="32" class="ml-2">
                        <newIcon icon="fluent:add-16-filled"></newIcon>
                    </xt-button>
                    <xt-button :w="32" :h="32" class="ml-2">
                        <newIcon icon="fluent:arrow-counterclockwise-20-filled"></newIcon>
                    </xt-button>
                    <xt-button :w="32" :h="32" class="ml-2">
                        <newIcon icon="fluent:settings-16-regular"></newIcon>
                    </xt-button>
                    <xt-button :w="32" :h="32" class="ml-2">
                        <newIcon icon="fluent:dismiss-16-filled"></newIcon>
                    </xt-button>
                </div>
                <template>
                    <Empty v-if="courierList.length <= 0" />
                    <template v-else>
                        <vue-custom-scrollbar ref="threadListRef" :key="currentPage" :settings="outerSettings"
                            style="height: calc(100% - 20px) ;overflow: hidden;flex-shrink: 0;width: 100%;">
                            <CourierItem v-for="(item, index) in courierList" :key="index" :courier="item" />
                        </vue-custom-scrollbar>
                        <xt-button :w="40" :h="40" type="theme" @click="settingVisible" class="add-courier"
                            style="flex-shrink: 0;position: absolute;right: 24px;bottom: 10px">
                            <newIcon class="text-lg xt-text "
                                style="vertical-align: sub;font-size: 20px;text-align: center;margin: 10px ;"
                                icon="fluent:add-16-filled" />
                        </xt-button>
                    </template>
                </template>
            </div>

        </Widget> -->
        <div class="w-[572px] h-[420px] rounded-xl p-4 " style="background-color: var(--secondary-bg);">
            <div class="flex justify-between h-[32px]">
                <div class="flex mt-2">
                    <div class="xt-text"><newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
                    </div>
                    <div class="flex ml-4 xt-text">
                        <div class="text-base " style="line-height: 20px;">我的快递</div>
                        <div class="ml-3 text-base" style="line-height: 20px;">({{ this.courierDetailList.length }})</div>
                    </div>
                </div>
                <div class="flex">
                    <a-tooltip autoAdjustOverflow title="添加快递">
                    <xt-button :w="32" :h="32" class="ml-2 xt-bg" style="border-radius: 8px;">
                        <newIcon icon="fluent:add-16-filled" style="vertical-align: sub;"></newIcon>
                    </xt-button></a-tooltip>
                    <a-tooltip autoAdjustOverflow title="刷新">
                    <xt-button :w="32" :h="32" class="ml-2 xt-bg" style="border-radius: 8px;">
                        <newIcon icon="fluent:arrow-counterclockwise-20-filled" style="vertical-align: sub;"></newIcon>
                    </xt-button></a-tooltip>
                    <a-tooltip autoAdjustOverflow title="设置">
                    <xt-button :w="32" :h="32" class="ml-2 xt-bg" style="border-radius: 8px;">
                        <newIcon icon="fluent:settings-16-regular" style="vertical-align: sub;"></newIcon>
                    </xt-button></a-tooltip>
                    <a-tooltip autoAdjustOverflow title="关闭">
                    <xt-button :w="32" :h="32" class="ml-2 xt-bg" style="border-radius: 8px;" @click="showTopCourier">
                        <newIcon icon="fluent:dismiss-16-filled" style="vertical-align: sub;"></newIcon>
                    </xt-button></a-tooltip>
                </div>
            </div>
            <vue-custom-scrollbar ref="threadListRef" :key="currentPage" :settings="outerSettings"
                style="height: calc(100% - 25px) ;overflow: hidden;flex-shrink: 0;width: 100%;">
                <CourierItem v-for="(item, index) in couriersList" :key="index" :courier="item" />
            </vue-custom-scrollbar>
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
export default {
    name: '我的快递',
    components: {
        Widget,
        newIcon,
        CourierItem,
        MinCourierItem,
        Empty,
        MinEmpty
    },
    props: {
        customIndex: {
            type: Number,
            default: 0
        },
        customData: {
            type: Object,
            default: () => { }
        },
        desk: {
            type: Object
        }
    },
    data() {
        return {
            settingVisible: false,
            sizeList: [
                {
                    height: 2,
                    width: 2
                },
            ],



            options: {
                className: 'card double',
                title: '我的快递',
                icon: '',
                type: 'Courier'
            },
            menuList: [
                {
                    newIcon: 'fluent:add-16-filled',
                    title: '添加快递',
                    fn: () => { console.log(1) }
                },
                {
                    newIcon: 'fluent:box-16-regular',
                    title: '全部快递',
                    fn: () => { console.log(1) }
                },
                // {
                //     icon: 'shezhi1',
                //     title: '设置',
                //     fn: () => { this.settingVisible = true; this.$refs.cardSlot.visible = false }
                // },
            ],
            outerSettings: {
                useBothWheelAxes: true,
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: true,
            },
            topCourierVisible: false,
            couriersList:[]
        }
    },
    methods: {
        ...mapActions(courierStore, ['getCourierMsg']),
        showTopCourier() {
            this.topCourierVisible = !this.topCourierVisible
        }

    },
    computed: {
        ...mapWritableState(courierStore, ['courierDetailList','couriersDetailMsg']),

    },
    async mounted() {
        // this.getCourierMsg('YD', '463193332336436')
      this.couriersList=await this.couriersDetailMsg  
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