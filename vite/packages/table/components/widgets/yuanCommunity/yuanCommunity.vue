<template>
    <div>
        <Widget :desk="desk" :options="options" :customIndex="customIndex" :menuList="menuList" ref="cardSlot" :env="env"
            :sizeList="sizeList" :customData="customData">
            <template #left-title-icon>
                <div class="icon"
                    style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
                    <YuanIcon icon="fluent:chat-16-regular" style="font-size: 24px;"></YuanIcon>
                </div>
            </template>
            <template #left-title v-if="showForumList.length > 0">
                <div @click="refreshPost">
                    <!-- <xt-button :w="22" :h="22" style="background: transparent;"> -->
                    <YuanIcon class="xt-text refresh pointer" style=" font-size: 18px;margin-top: 1px;vertical-align: sub;"
                        icon="akar-icons:arrow-clockwise" />
                    <!-- </xt-button> -->
                </div>
            </template>
            <div v-if="showForumList.length > 0">
                <!-- 顶部导航栏 -->
                <div class="flex justify-between mt-3">
                    <YuanHorizontalPanel :navList="showForumList" v-model:selectType="defaultForum"
                        style="height: 40px;width: 100%;" v-if="this.showForumList.length > 1" @changed="changeContent">
                    </YuanHorizontalPanel>
                </div>
                <!-- {{ defaultForum }} -->
                <!-- 内容区 -->
                <div :style="{ height: showItem }" v-if="this.showForumPost?.length > 0">
                    <vue-custom-scrollbar ref="threadListRef" :key="currentPage" :settings="outerSettings"
                        style="overflow: hidden;flex-shrink: 0;width: 100%;" :style="{ height: scrollBarHeight }">
                        <div v-if="isLoading">
                            <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
                        </div>
                        <div class="content" v-else>
                            <div v-for="(item, index) in showForumPost" style="display: flex;" class="">
                                <div class="item" @click="showDetail(item)">
                                    <!-- {{ item.pc_summary }} -->
                                    <communItem :key="index" :copyNum="copyNum" :showForumPost="item" />
                                </div>

                            </div>
                            <div class="flex items-center justify-center w-full h-[40px] mt-3">
                                <xt-button
                                    style="backend:var(--primary-bg);color:var(--secondary-text);width:84px;height:32px;border-radius: 8px;">查看更多</xt-button>
                            </div>
                        </div>

                    </vue-custom-scrollbar>

                </div>
                <!-- <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据" ></DataStatu> -->
                <Unusual  :title="'暂无数据'" :buttonTitle="'设置'" v-else @back="backSetting"></Unusual>
            </div>
            <Unusual :title="'暂无数据'" :buttonTitle="'设置'" v-else @back="backSetting"></Unusual>
            <!-- <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据"
                @click="this.settingVisible = true; this.$refs.cardSlot.visible = false"></DataStatu> -->
            <xt-button :w="40" :h="40" type="theme" @click="publishModalVisible"
                style="flex-shrink: 0;position: absolute;right: 24px;bottom: 24px">
                <div class="flex items-center justify-center">
                    <YuanIcon class="text-lg " style="font-size: 20px;color: rgba(255,255,255,0.85);"
                        icon="fluent:add-16-filled" />
                </div>

            </xt-button>

            <!-- {{ customData.defaultForum.value }} -->
        </Widget>
        <!-- {{ showForumPost }} -->
        <teleport to="body" :disabled="false">
            <YuanPublishModal v-if="showPublishModal" :showPublishModal="showPublishModal" @handleOk="modalVisible"
                @refreshDefaultForum="refreshPost"></YuanPublishModal>
            <div v-if="showDetailModal">
                <detailModal v-if="toggleDetail" :cardData="cardData" :showDetailModal="showDetailModal"
                    @closeDetail="closeDetail" />
                <MinDetailModal v-else :cardData="cardData" :showDetailModal="showDetailModal" @closeDetail="closeDetail" />
            </div>


        </teleport>

        <a-drawer :width="500" title="元社区小组件设置" v-model:visible="settingVisible" placement="right">
            <template #extra>
                <xt-button :w="56" :h="32"
                    style="background-color: var(--active-bg) !important;color: rgba(255, 255, 255, 0.85) !important;font-size: 16px;border-radius: 8px;"
                    @click="saveSetting">保存</xt-button>
            </template>
            <div class="mb-6 xt-text font-16">
                数据来源
            </div>
            <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
            <div class="mt-6 font-16 xt-text">
                {{ defaultType.title }}
            </div>
            <div class="mt-2 mb-4 font-14 xt-text-2">
                最多支持选择在卡片上的展示5个圈子
            </div>
            <!-- {{ selectForumList }}  @change="handleChange(selectValue)" -->
            <a-select v-model:value="selectValue" mode="tags" autoClearSearchValue="false" class="optionClass" 
                style="width: 100%;height: 48px;border-radius: 8px;line-height: 48px;" :bordered="false"
                @deselect="handleDeselect(selectValue)" @select="handleChange(selectValue)">
                <a-select-option :value="index" v-for="(item, index) in forumList"
                    class="absolute z-auto xt-bg xt-text-2 selsect-options">
                    {{ item.name }}
                </a-select-option>
                <template #placeholder>
                    <div class="xt-text font-16">
                        选择您的圈子
                    </div>
                </template>
                <template #removeIcon>
                    <YuanIcon icon="fluent:dismiss-16-filled" class="mt-1 xt-text" style="font-size: 14px;"></YuanIcon>
                </template>
                <template #suffixIcon>
                    <YuanIcon icon="fluent:chevron-left-16-filled" style="font-size: 20px;vertical-align: sub;"
                        class="mr-3 rotate-180 xt-text"></YuanIcon>
                </template>
            </a-select>
            <div class="mt-4 mb-4 text-base xt-text">
                打开方式
            </div>
            <RadioTab :navList="openWay" v-model:selectType="defaultOpenWay"></RadioTab>
        </a-drawer>

    </div>
</template>
<script>
import Widget from '../../card/Widget.vue';
import { Icon as YuanIcon } from '@iconify/vue'
import communItem from './CommunItem.vue'
import RadioTab from '../../RadioTab.vue';
import { mapWritableState, mapActions } from 'pinia';
import { useCommunityStore } from '../../../page/chat/commun'
import { yuanCommunityStore } from '../../../store/yuanCommunity.ts'
import DataStatu from "../DataStatu.vue"
import Unusual from '../Unusual.vue'
import YuanPublishModal from './YuanPublishModal.vue';
import YuanHorizontalPanel from './YuanHorizontalPanel.vue'
import detailModal from './DetailModal.vue'
import MinDetailModal from './MinDetailModal.vue';
export default {
    name: '元社区',
    components: {
        Widget,
        YuanIcon,
        communItem,
        RadioTab,
        DataStatu,
        YuanPublishModal,
        YuanHorizontalPanel,
        detailModal,
        MinDetailModal,
        Unusual
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
            sizeList: [
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
                className: 'card double ',
                title: '元社区',
                rightIcon: ' fluent:arrow-counterclockwise-20-filled',
                type: 'community',
                // isEdit: true
            },
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => { this.settingVisible = true; this.$refs.cardSlot.visible = false }
                },
            ],
            settingVisible: false,
            currentIndex: 0,
            isLoading: false,
            pageToggle: true,
            dataType: [{ title: '社区频道', name: 'channel' }, { title: '我加入的圈子', name: 'circle' }],
            defaultType: { title: '我加入的圈子', name: 'circle' },
            selectForumList: [],
            browserUrl: 'https://s.apps.vip/post/',
            showPublishModal: false,
            selectList: [],
            defaultForum: { index: 0, value: { name: '版本更新', id: 100304 } },
            outerSettings: {
                useBothWheelAxes: true,
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: true,
            },
            showDetailModal: false,
            openWay: [{ title: '弹窗形式打开', name: "popup" }, { title: '在元社区主应用中打开', name: "main" }],
            defaultOpenWay: { title: '弹窗形式打开', name: "popup" },
            cardData: null,
            toggleDetail: true,
            selectValue: [],
            env: {
                web: false,
                mobile: false,
                client: false,
                offline: true,
            },
            showForumPost: [],
        }
    },
    methods: {
        ...mapActions(yuanCommunityStore, [
            'getMyForumList',
            'getCommunityPost',
        ]),
        // 刷新圈子
        async refreshPost() {
            this.isLoading = true
            await this.getCommunityPost(this.defaultForum.value?.id)
            this.showForumPost = this.communityPost
            this.isLoading = false
        },
        // 查看内容详情
        showDetail(item) {
            // browser.openInUserSelect(`${this.browserUrl}${item.id}`)
            this.showDetailModal = true
            this.cardData = item
            // console.log(this.cardData);
        },
        closeDetail(value) {
            this.communityPostDetail = []
            this.communityReply = []
            this.showDetailModal = value
        },
        // 选择板块
        handleChange(value) {
            value.forEach((item) => {
                // console.log(item);
                const newItem = {
                    index: item,
                    value: this.forumList[item]
                };

                if (!this.selectList.some((el) => el.value.id === newItem.value.id)) {
                    this.selectList.push(newItem);
                }
            });
            let temp = this.selectList;
            this.customData.selectList = temp;
            this.forumsList = this.customData.selectList
        },
        // 显示发布页是否可见
        publishModalVisible() {
            this.showPublishModal = !this.showPublishModal
        },
        // 回调
        modalVisible(val) {
            this.showPublishModal = val
        },
        // 删除选择的板块
        handleDeselect(val) {
            this.selectList = this.customData.selectList.filter((item) => {
                return val.includes(item.index); // 过滤掉 val 中包含的索引的项目
            });
            this.selectList = this.selectList.filter((item, index) => {
                return item.value !== undefined
            })
            let temp = this.selectList
            this.customData.selectList = temp
        },
        saveSetting() {
            this.settingVisible = false
        },
        handleResize() {
            if (window.innerWidth > 1200) {
                this.toggleDetail = true
            } else {
                this.toggleDetail = false
            }
        },
        backSetting(){
            this.settingVisible = true
            this.$refs.cardSlot.visible = false
        }
    },
    computed: {
        ...mapWritableState(yuanCommunityStore, ['communityPost', 'myForumList', 'forumsList', 'defaultSection']),
        ...mapWritableState(useCommunityStore, ['communityReply', 'communityPostDetail']),
        // 判断尺寸大小
        showSize() {
            if (this.customData && this.customData.width && this.customData.height) {
                return { width: this.customData.width, height: this.customData.height }
            }
            return this.sizeList[0]
        },
        showItem() {
            if (this.customData && this.customData.height) {
                return this.customData.height == 2 ? '392px' : '600px'
            }
            return '392px'
        },
        forumList() {
            if (this.customData && this.customData.forumList) {
                return this.customData.forumList
            }
            return this.myForumList
        },
        showForumList() {
            if (this.customData && this.customData.selectList) {
                return this.customData.selectList?.slice(0, 5)
            }
            return this.selectList.slice(0, 5)
        },
        // async forumPost() {
        //     this.customData.forumPost = await this.communityPost.list
        //     return this.customData.forumPost
        // },
        // showForumPost() {
        //     if (this.customData && this.customData.forumPost) {
        //         return this.customData.forumPost?.slice(0, 10)
        //     }
        //     return this.communityPost?.slice(0, 10)
        // },
        scrollBarHeight() {
            if (this.showForumList.length > 1) {
                return 'calc(100% - 65px)'
            } else {
                return 'calc(100% - 40px)'
            }
        },
    },
    async beforeMount() {
        await this.getMyForumList()
        this.customData.forumList = this.myForumList
        // console.log(this.myForumList,'this.myForumList');
        // 判断是否刷新加载内容
        if (this.customData && this.customData.defaultForum) {
            this.defaultForum = this.customData.defaultForum
            // console.log(this.defaultForum,'1');
        } else if (this.customData && this.customData.selectList) {
            // console.log(this.customData.selectList,'2')
            this.defaultForum = this.customData.selectList[0]
        } else {
            // return this.defaultForum
            this.selectList.push(this.defaultForum)
            this.customData.selectList = this.selectList
        }
    },
    async mounted() {
        this.isLoading = true
        // 判断组件名称
        if (this.customData.selectList && this.customData.selectList.length === 1) {
            this.options.title = this.customData.selectList[0].value.name
        }
        // console.log(this.defaultForum,this.customData.defaultForum,'this.customData.defaultForum');
        this.isLoading = false
        window.addEventListener("resize", this.handleResize)
        this.showForumPost = this.communityPost
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.handleResize)
    },
    watch: {
        showForumList(newValue) {
            this.isLoading = true
            if (this.showForumList.length > 0) {
                this.getCommunityPost(this.showForumList[0].value.id)
            }
            setTimeout(() => {
                this.isLoading = false
            });

        },
        defaultForum(newValue) {
            this.customData.defaultForum = newValue
            this.defaultForum = this.customData.defaultForum
            this.defaultSection = this.customData.defaultForum
            this.isLoading=true
            this.getCommunityPost(this.customData.defaultForum.value?.id).then(() => {
                this.showForumPost = this.communityPost;
                this.isLoading=false
            })
            // this.showForumPost = this.communityPost
        },
        immediate: true,
        // 切换频道和圈子时触发获取
        defaultType(newValue) {
            // console.log(newValue.name);
            if (newValue.name == 'circle') {
                this.getMyForumList()
            } else {
                return
            }
        },
        'customData.selectList': {
            handler(newValue, oldValue) {
                if (newValue.length === 1) {
                    this.options.title = newValue[0].value.name
                } else if (newValue.length > 1 || newValue.length < 1) {
                    this.options.title = '元社区'
                }
            }
        },
        settingVisible() {
            // 加载已选择的模块
            if (this.customData && this.customData.selectList && this.settingVisible == true) {
                this.selectValue = this.customData.selectList.map((item) => {
                    return item.index
                })
            }
        }
    }
}
</script>
<style>
:deep(.xt-active-btn span) {
    color: rgba(255, 255, 255, 0.85) !important;
}

:deep(.ant-tag-close-icon) {
    color: var(--secondary-text);
    margin-left: 8px;
    font-size: 12px;
}

:deep(.ant-select-selection-item) {
    background: rgba(80, 139, 254, 0.20);
}

:deep(.ant-select-multiple .ant-select-selection-item) {
    background: rgba(80, 139, 254, 0.20) !important;
}

.optionClass {
    & .ant-select-selection-item {
        background-color: rgba(80, 139, 254, 0.20) !important;
        height: 28px;
    }
}
</style>
