<template>
    <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList"
        ref="cardSlot">
        <template #left-title-icon>
            <div class="icon"
                style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
                <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
            </div>
        </template>
        <div class="w-full h-full courier">
            <div style="position: absolute;left: 124px;top: 16px;" @click="refreshCourier" class="pointer"
                v-if="courierList.length > 0">
                <xt-button :w="22" :h="22" style="background: transparent;">
                    <newIcon class="xt-text refresh" style=" font-size: 18px;margin-top: 1px;vertical-align: sub;"
                        icon="akar-icons:arrow-clockwise" />
                </xt-button>
            </div>
            <div v-if="showWay">
                <MinEmpty v-if="courierDetailList.length === 0" />
                <MinCourierItem v-else :courier="courierDetailList[0]"></MinCourierItem>
            </div>
            <template v-else>
                <Empty v-if="courierDetailList.length === 0" />
                <template v-else>
                    <vue-custom-scrollbar ref="threadListRef" :key="currentPage" :settings="outerSettings"
                        style="height: calc(100% - 20px) ;overflow: hidden;flex-shrink: 0;width: 100%;">
                        <CourierItem v-for="(item,index) in courierDetailList" :key="index"   :courier="item" />
                    </vue-custom-scrollbar>
                    <xt-button :w="40" :h="40" type="theme" @click="addCourier" class="add-courier"
                        style="flex-shrink: 0;position: absolute;right: 24px;bottom: 10px">
                        <newIcon class="text-lg xt-text " style="vertical-align: sub;font-size: 20px;text-align: center;margin: 10px ;"
                            icon="fluent:add-16-filled" />
                    </xt-button>
                </template>
            </template>
        </div>

    </Widget>

  <AddCourierModal  ref="addCourierRef" />
</template>

<script>
import Widget from '../../card/Widget.vue';
import { Icon as newIcon } from '@iconify/vue'
import {courierStore} from '../../../store/courier.ts'
import {mapWritableState, mapActions} from 'pinia'
import { courier } from './mock'

import CourierItem from './CourierItem.vue';
import MinCourierItem from './MinCourierItem.vue';
import Empty from './Empty.vue'
import MinEmpty from './MinEmpty.vue';
import AddCourierModal from '../courierModal/AddCourierModal.vue';


export default {
    name: '我的快递',
    components: {
        Widget,
        newIcon,
        CourierItem,
        MinCourierItem,
        Empty,
        MinEmpty,
        AddCourierModal
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
                    title: '2x2',
                    height: 1,
                    width: 1,
                    name: '2x2'
                },
                {
                    title: '4x4',
                    height: 2,
                    width: 2,
                    name: '4x4'
                },
                {
                    title: '4x6',
                    height: 3,
                    width: 2,
                    name: '4x6'
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
                    fn: () => { 
                        // console.log(1)
                        this.$refs.addCourierRef.openCourierModel()
                    }
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
            courierList: courier,
            outerSettings: {
                useBothWheelAxes: true,
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: true,
            },
        }
    },
    methods: {
        ...mapActions(courierStore, [
            // 'getCourierMsg',
            'getDbCourier'
        ]),
        refreshCourier() {
            // this.getCourierMsg('YD','463193332336436')
            this.getDbCourier()
        },
        addCourier(){
          this.$refs.addCourierRef.openCourierModel()
        }

    },
    computed: {
        ...mapWritableState(courierStore,['courierMsgList','courierDetailList']),
        // 判断尺寸大小
        showSize() {
            if (this.customData && this.customData.width && this.customData.height) {
                return { width: this.customData.width, height: this.customData.height }
            }
            return this.sizeList[2]
        },
        showWay() {
            if (this.showSize.height === 1) {
                return true
            } else {
                return false
            }
        },
        courierMsg(){
            return this.courierMsgList
        }
    },
    mounted() {
        // this.getCourierMsg('YD','463193332336436')
        this.getDbCourier()
    },

}
</script>
<style lang="scss">
.refresh {
    &:hover {
        background-color: var(--secondary-bg);
    }
}

.courier {
    .add-courier {
        display: none;

    }
    &:hover{
        .add-courier{
            display: block;
        }
    }
}
</style>