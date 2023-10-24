<template>
    <div class="p-0 -mt-8 card content">
        <a-row>
            <a-col :span="12" style="border-right: 1px solid var(--divider); height: calc(100vh - 5em )">
                <vue-custom-scrollbar :settings="outerSettings"
                    style="position: relative; height: calc(100vh -5em );color: var(--primary-text);" class="scroll">
                    <div class="pr-6">
                        <div class="mb-4 font-16 xt-text">添加闹钟</div>
                        <div class="mb-4 ">
                            <a-input ref="input" allow-clear @click="$refs.input.select()" v-model:value="eventValue"
                                style="border-radius: 10px;height: 40px; width: 100%;border: 1px solid var(--divider);background-color: var(--secondary-bg); " placeholder="新闹钟" />
                        </div>

                        <div class="mb-4 font-16 xt-text">小时</div>
                        <div>
                            <!-- <a-radio-group button-style="solid " v-model:value="timeHour" class="flex ml-1 rounded-lg xt-bg-2" style="1px solid var(--secondary-text);"
                                option-type="button">
                                <template
                                    v-for="(i, index) in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]">
                                    <a-radio-button :value="i" class="mb-2 text-center xt-text" style="width: 58px;">{{ index }}</a-radio-button>
                                </template>
                            </a-radio-group> -->
                            <!-- <a-radio-group v-model:value="timeHour" button-style="solid"
                                class="flex ml-1 rounded-lg xt-bg-2">
                                <a-radio-button :value="i"
                                    v-for="(i, index) in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                                    style="width: 58px;" class="mb-2 text-center xt-text">{{ index }}</a-radio-button>
                            </a-radio-group> -->
                            <div class="flex flex-wrap w-[232px] h-[240px] xt-bg-2 rounded-lg " style="">
                                <div v-for="(i, index) in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                                style="width: 58px;height: 40px;line-height: 40px;text-align: center;flex-shrink: 0;font-size: 16px;"
                                class="flex items-center justify-center xt-text-2 pointer setting-hour" :class="{'active': timeHour === index}"
                                @click="timeHour = index">
                                    {{ index }}
                                </div>
                            </div>

                        </div>
                        <div>
                            <div class="mt-4 mb-4 font-16 xt-text">分钟</div>
                            <!-- <div class="w-full xt-bg-2" style="border-radius: 10px;border: 1px solid var(--secondary-text);"> -->
                            <a-select v-model:value="timeMinute" placeholder="选择分钟"
                                style="width:100%;  height: 40px; border-radius: 10px;border: 1px solid var(--divider); " :bordered="false">
                                <a-select-option :value="index" v-for="(i, index) in new Array(60)" class="xt-bg xt-text-2">
                                    {{ index }}
                                </a-select-option>
                            </a-select>
                            <!-- </div> -->

                        </div>
                        <div class="w-full mt-4 mb-4">
                            <div class="mt-4 mb-4 font-16 xt-text">
                                重复
                            </div>
                            <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
                        </div>
                        <div>
                            <xt-button type="primary" class=" font-16 xt-text"
                                style="width: 100%; height: 40px; background-color: var(--active-bg);"
                                @click="addSettingClock">确认添加</xt-button>
                        </div>
                    </div>

                </vue-custom-scrollbar>
            </a-col>
            <a-col :span="12">
                <vue-custom-scrollbar :settings="outerSettings" style="position: relative; height: calc(100vh - 10em)"
                    class="scroll">
                    <div class="pl-4">
                        <div class="w-full h-[160px] xt-bg-2 mb-2 p-4 rounded-xl">
                            <div class="flex justify-between">
                                <div class="font-16 xt-text-2">显示在状态栏</div>
                                <a-switch v-model:checked="checked" @change="changeSwitchStatus(checked)" />
                            </div>
                            <div class="font-14 xt-text-2 " style="margin-top: 10px;margin-bottom: 10px;">
                                在顶部状态栏显示最近闹钟时间。
                            </div>
                            <div>
                                <a-select v-model:value="defaultDataType" dropdownSyle=""
                                    @select="changeDataType(defaultDataType)" :bordered="false"
                                    style="width:100%;  height: 40px; border-radius: 10px;background-color: var(--primary-bg);">
                                    <a-select-option :value="index" v-for="(item, index) in selectDataType"
                                        class="xt-bg xt-text-2 selsect-options">
                                        {{ item.title }}
                                    </a-select-option>
                                </a-select>
                            </div>


                        </div>
                        <div style="color:var(--primary-text)"> 我的闹钟</div>
                        <a-empty v-if="clockEvent.length === 0" description="暂无闹钟" image="/img/test/load-ail.png"
                            style="margin-top: 40%;"></a-empty>
                        <!-- <a-row> -->
                        <div class="flex items-center" v-for="(item, index) in clockEvent" style="margin-top: 0.5em;">
                            <div class="rounded-lg event-list "
                                style="background: var(--secondary-bg);color: var(--primary-text);width: calc(100% - 20px);height: 56px; ">
                                <div class="card-list ">
                                    <div class="event-title">
                                        <span class="font-14 xt-text">{{ item.eventValue }}</span>
                                        <span class="font-12 xt-text-2" style="color:var(--secondary-text)">{{
                                            item.clockType }}</span>
                                    </div>
                                    <span class="font-20">{{ item.dateValue.hours }}:{{ item.dateValue.minutes }}</span>
                                </div>
                            </div>
                            <clockIcon icon="akar-icons:circle-x-fill" @click="onClockMenuClick"
                                class="ml-2 xt-bg xt-text-2 pointer" style="font-size: 18px;">
                            </clockIcon>
                        </div>

                        <!-- </a-row> -->
                    </div>

                </vue-custom-scrollbar>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { cardStore } from '../../store/card'
import { topClockSettingStore } from '../../store/topClockSetting'
import { timeStamp, transDate } from "../../util";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import BackBtn from '../../components/comp/BackBtn.vue'
import { getDateTime } from '../../../../src/util/dateTime'
import { Icon as clockIcon } from '@iconify/vue'
import RadioTab from '../../components/RadioTab.vue'
export default {
    name: "SetupClock",
    components: { BackBtn, clockIcon, RadioTab },

    data() {
        return {
            outerSettings: {
                useBothWheelAxes: true,
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: true,
            },
            title: "",
            countdownDayType: "大",
            clockType: "不重复",

            eventValue: "未命名",
            dateValue: null,
            clockDate: null,
            flag: true,
            customIndex: 0,

            timeHour: 0,//时钟设置的小时
            timeMinute: 0,//时钟设置的分钟

            dateTime: {},//当前时间
            timer: null,//当前时间更新计时器
            dataType: [
                { title: '不重复', name: '不重复' },
                { title: '每天', name: '每天' }
            ],
            defaultType: { title: '不重复', name: '不重复' },
            selectDataType: [
                { title: '始终显示', tag: 'always', type: '0' },
                { title: '显示30分钟内的闹钟', tag: 'within30min', type: '1' },
                { title: '显示1小时内的闹钟', tag: 'within1hour', type: '2' },
            ],
            defaultDataType: '显示30分钟内的闹钟',
            checked: true,
        };
    },

    mounted() {
        if (this.$route.params["name"]) {
            // console.log(this.$route.params);
            this.title = this.$route.params["cname"];
            this.cardType = this.$route.params["name"];
            this.customIndex = this.$route.params["customIndex"];
        }
        this.updateTime()
        this.timer = setInterval(() => {
            this.updateTime()
        }, 1000)
    },
    unmounted() {
        clearInterval(this.timer)
    },
    computed: {
        ...mapWritableState(cardStore, ["countdownDay", "appDate", "clockEvent", 'chooseType']),
        ...mapWritableState(topClockSettingStore, ['checkTopClock'])
    },
    methods: {
        dayjs,
        transDate,
        ...mapActions(cardStore, [
            "addCountdownDay",
            "addClock",
            "addCard",
            "removeCountdownDay",
            "removeClock",
            'filterClock',
        ]),
        ...mapActions(topClockSettingStore, ['changeTopClockStatus']),
        updateTime() {
            this.dateTime = getDateTime()
        },
        addCard() {
            if (this.eventValue === "" || this.dateValue === null) {
                if (this.flag !== true) return;
                this.flag = false;
                setTimeout(() => {
                    message.info("不可为空！");
                    this.flag = true;
                }, 500);
                return;
            }
            this.addCountdownDay({
                eventValue: this.eventValue,
                dateValue: timeStamp(this.dateValue.valueOf()),
                customIndex: this.customIndex
            });
            // this.$router.push({
            //   name: "home",
            // });
            message.success("添加成功！");
        },
        addSettingClock() {
            if (this.eventValue === "") {
                if (this.flag !== true) return;
                this.flag = false;
                message.info("闹钟名称不可为空！");
                setTimeout(() => {
                    this.flag = true;
                }, 500);
                return;
            }

            let date = new Date(Date.now())
            let timeSpan = {
                day: date.getDate(),
                hours: this.timeHour < 10 ? '0' + this.timeHour : this.timeHour,
                minutes: this.timeMinute < 10 ? '0' + this.timeMinute : this.timeMinute,
                month: date.getMonth() + 1,
                seconds: '00',
                year: date.getFullYear()
            }
            let dateSpan = timeStamp(timeSpan)


            this.addClock({
                clockType: this.defaultType.name,
                eventValue: this.eventValue,
                dateValue: timeSpan,
                clockTimeStamp: timeSpan
            });
            // this.$router.push({
            //   name: "home",
            // });
            message.success("添加成功！");
        },
        onContextMenuClick(e, index) {
            this.removeCountdownDay(index);
        },
        onClockMenuClick(e, index) {
            this.removeClock(index, 1);
        },
        changeSwitchStatus(value) {
            console.log(this.checked);
            this.changeTopClockStatus(value)
        },
        changeDataType(value) {
            // console.log(this.selectDataType[value.title]);
            // console.log(value);
            let tag = this.selectDataType[value].tag

            let temp = this.selectDataType[value].type
            this.filterClock(tag, temp)
        }
    },
    mounted() {
        // console.log(this.chooseType, 'this.chooseType--isUndefined');
        // console.log(this.checkTopClock,'this.checkTopClock');
        this.checked = this.checkTopClock
        if (this.chooseType == undefined) {
            this.defaultDataType = '显示30分钟内的闹钟'
        } else {
            let data
            for (let i = 0; i < this.selectDataType.length; i++) {
                if (this.selectDataType[i].type == this.chooseType) {
                    data = this.selectDataType[i].title
                }
            }
            // console.log(data, 'beforeMount');
            this.defaultDataType = data
        }

    },
    /*
        目前的主要问题是无法保存正确的页面数据，逻辑是没问题，但是表面的数据无法留存
    */
    watch: {
        checkTopClock: {
            handler(value) {
                this.checked = value
            }
        },
        chooseType: {
            handler(value) {
                if (value == undefined) {
                    this.defaultDataType = '显示30分钟内的闹钟'
                }
                else {
                    // let data=this.selectDataType.filter(item=>item.type==value)
                    let data
                    for (let i = 0; i < this.selectDataType.length; i++) {
                        if (this.selectDataType[i].type == value) {
                            data = this.selectDataType[i].title
                        }
                    }
                    // console.log(data, 'clock-value-change');
                    this.defaultDataType = data
                }
            },
            deep: true
        }
    }
};
</script>

<style lang="scss" scoped>
.active{
    background: rgba(80,139,254,0.20);
}
.setting-hour{
    &:hover{
        background: rgba(80,139,254,0.20);
        font-size: 30px;
    }
    transform: all 0.3s;
    font-family: Oswald-Regular;
    &:nth-child(1) {
        border-radius: 10px 0 0 0;
    }

    &:nth-child(4) {
        border-radius: 0 10px 0 0;
    }

    &:nth-child(21) {
        border-radius: 0 0 0px 10px;
    }

    &:nth-child(24) {
        border-radius: 0 0 10px 0;
    }
    // &:nth-child(2),
    // &:nth-child(6),
    // &:nth-child(10),
    // &:nth-child(14),
    // &:nth-child(18),
    // &:nth-child(22){
    //     border-right:1px solid var(--divider);
    //     border-left:1px solid var(--divider);
    // }
    // &:nth-child(3),
    // &:nth-child(7),
    // &:nth-child(11),
    // &:nth-child(15),
    // &:nth-child(19),
    // &:nth-child(23){
    //     border-right:1px solid var(--divider);
    // }
    // &:not(:nth-child(21),
    // :nth-child(22),
    // :nth-child(23),
    // :nth-child(24)){
    //     border-bottom:1px solid var(--divider);
    // }


}
.event-list {
    padding: 0.2em 0.5em;

    width: 100%;


    .card-list {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .event-title {
            display: flex;
            flex-direction: column;
            width: 70%;

            .event {
                padding: 0;
                margin: 0;
                font-size: 0.6em;
                color: #6a6a6a;
            }
        }
    }
}

:deep(.ant-radio-button-wrapper) {
    // border: 1px solid var(--primary-text);
    border-bottom: none;

}

:deep(.ant-radio-button-wrapper) {
    &:nth-child(21) {
        border-bottom: 1px solid var(--divider);
        // border-left:  solid var(--primary-text);
    }

    &:nth-child(22),
    &:nth-child(23),
    &:nth-child(24) {
        border-bottom: 1px solid var(--divider);
    }

    &:nth-child(5),
    &:nth-child(9),
    &:nth-child(13),
    &:nth-child(17) {
        border-left: 0.1px solid var(--divider);
    }

    &:nth-child(1) {
        border-radius: 10px 0 0 0;
    }

    &:nth-child(4) {
        border-radius: 0 10px 0 0;
    }

    &:nth-child(21) {
        border-radius: 0 0 0px 10px;
    }

    &:nth-child(24) {
        border-radius: 0 0 10px 0;
    }
}

:deep(.ant-select-option) {
    color: var(--primary-text);
}

:deep(.ant-select-arrow) {
    color: var(--primary-text);
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    // border-radius: 10px !important;
    height: 100%;
    border-radius: 10px;

}

:deep(.ant-select-single .ant-select-selector .ant-select-selection-item) {
    line-height: 35px;
}

.font-14 {

    font-size: 14px;
    font-weight: 400;
}

.font-12 {

    font-size: 12px;
    font-weight: 400;
}

.title {
    display: flex;
    align-items: center;
    color: #dddddd;
    font-size: 1.3em;
}

.content {
    color: #dddddd;
    font-size: 1.3em;
    width: calc(100vw - 1em);
    padding: 0;
    // margin-top: 2em;
}

.ant-row {
    margin: 1em;
}

.scroll {
    @media screen and (max-width: 1100px) {
        width: 100%;
    }
}

.button {
    display: flex;
    flex-direction: column;
    height: 5em;
    width: 8em;
    justify-content: space-between;

    button {
        width: 6em;
    }

    @media screen and (max-width: 1200px) {
        flex-direction: row;
        height: 2em;
        width: 14em;
        align-items: center;
    }
}

.list {
    display: flex;
    flex-direction: column;
    margin-top: -0.5em;
}

:deep(.ant-select) {
    border: none !important;
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    // border-radius: 10px !important;
    height: 100%;
    border-radius: 10px;

}

:deep(.ant-select-option) {
    color: var(--primary-text);
}

:deep(.ant-select-arrow) {
    color: var(--primary-text);
}

:deep(.ant-input) {
    color: var(--primary-text);

    &::placeholder {

        font-size: 14px;
        font-weight: 400;
        color: var(--primary-text);
    }
}

:deep(.ant-select-single .ant-select-selector .ant-select-selection-item) {
    line-height: 35px;
}

:deep(.ant-picker-header) {
    -webkit-app-region: no-drag;
}

:deep(.ant-drawer-body) {
    padding-top: 0px;
}



.font-16 {

    font-size: 16px;
    font-weight: 400;
}

.font-20 {
    font-family: Oswald-Medium;
    font-size: 20px;
    font-weight: 500;
}
</style>
