<template>
    <div>
        <Widget :desk="desk" :options="options" :customIndex="customIndex" :menuList="menuList" ref="cardSlot"
            :sizeList="sizeList" :customData="customData">
            <template #left-title>
                <div class="icon"
                    style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
                    <YuanIcon icon="fluent:chat-16-regular" style="font-size: 24px;"></YuanIcon>
                </div>
            </template>
            <div v-if="showForumList.length > 0">
                <!-- 顶部导航栏 -->
                <div class="flex justify-between mt-4">
                    <!-- {{ showForumList }} -->
                    <div v-if="this.showForumList.length === 1" class="flex items-center pointer">
                        <div class="w-[32px] h-[32px] rounded-md ml-2">
                            <a-avatar shape="square" :src="this.showForumList[0].value.logo" alt="" class="w-full h-full" />

                        </div>
                        <div class="ml-2 font-16 xt-text">
                            {{ this.showForumList[0].value.name }}
                        </div>
                    </div>
                    <YuanHorizontalPanel :navList="showForumList" v-model:selectType="defaultForum" style="height: 40px;"
                        v-else @changed="changeContent"></YuanHorizontalPanel>
                    <div>
                        <!-- <a-tooltip title="发布帖子" autoAdjustOverflow> -->
                        <button class="ml-3 border-0 rounded-md xt-bg pointer w-[40px] h-[40px] " style="flex-shrink: 0;"
                            @click="publishModalVisible">
                            <YuanIcon class="text-lg xt-text clock-icon" style="vertical-align: sub;font-size: 20px;"
                                icon="fluent:add-16-filled" />
                        </button>
                        <!-- </a-tooltip> -->

                        <!-- <a-tooltip title="跳转元社区" placement="bottom"> -->
                        <button class="ml-3 border-0 rounded-md xt-bg pointer w-[40px] h-[40px]" @click="goYuan"
                            style="flex-shrink: 0;" v-if="false">
                            <YuanIcon class="text-lg xt-text clock-icon" style="vertical-align: sub;font-size: 20px;"
                                icon="fluent:chat-16-regular" />
                        </button>
                        <!-- </a-tooltip> -->

                        <!-- <a-tooltip title="刷新" placement="bottom" > -->
                        <button class="ml-3 border-0 rounded-md xt-bg pointer w-[40px] h-[40px]" style="flex-shrink: 0;"
                            @click="refreshPost">
                            <YuanIcon class="text-lg rotate-90 xt-text clock-icon"
                                style="vertical-align: sub; font-size: 20px;" icon="akar-icons:arrow-clockwise" />
                        </button>
                        <!-- </a-tooltip> -->

                    </div>
                </div>
                <!-- 内容区 -->

                <div v-if="isLoading">
                    <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
                </div>
                <div class="content" v-else>
                    <div v-for="(item, index) in showForumPost" style="display: flex;" class="">
                        <div class="item">
                            <!-- {{ item.pc_summary }} -->
                            <communItem :key="index" :copyNum="copyNum" :showForumPost="item" @click="showDetail(item)" />
                        </div>

                    </div>

                </div>

            </div>
            <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据"
                @click="this.settingVisible = true; this.$refs.cardSlot.visible = false"></DataStatu>
        </Widget>

        <teleport to="body" :disabled="false">
            <YuanPublishModal v-if="showPublishModal" :showPublishModal="showPublishModal" @handleOk="modalVisible"
                :forumIndex="currentIndex"></YuanPublishModal>
        </teleport>

        <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
            <div class="mb-6 xt-text font-16">
                数据来源
            </div>
            <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
            <div class="mt-6 font-16 xt-text">
                我加入的圈子
            </div>
            <div class="mt-2 mb-4 font-14 xt-text-2">
                最多支持选择在卡片上的展示3个圈子
            </div>
            <!-- {{ selectForumList }}  @change="handleChange(selectValue)" -->
            <a-select v-model:value="selectValue" mode="tags" autoClearSearchValue="false" class="optionClass"
                style="width: 100%;height: 48px;border-radius: 8px;line-height: 48px;" :bordered="false"
                @deselect="handleDeselect((selectValue))" @select="handleChange(selectValue)">
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
        </a-drawer>
    </div>
</template>
<script>
import Widget from '../../card/Widget.vue';
import { Icon as YuanIcon } from '@iconify/vue'
import communItem from './communItem.vue'
import RadioTab from '../../RadioTab.vue';
import { mapWritableState, mapActions } from 'pinia';
import { yuanCommunityStore } from '../../../store/yuanCommunity.ts'
import browser from '../../../js/common/browser'
import DataStatu from "../DataStatu.vue"
import YuanPublishModal from './YuanPublishModal.vue';
import YuanHorizontalPanel from './YuanHorizontalPanel.vue'
export default {
    name: '元社区',
    components: {
        Widget,
        YuanIcon,
        communItem,
        RadioTab,
        DataStatu,
        YuanPublishModal,
        YuanHorizontalPanel
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
                icon: '',
                type: 'community'
            },
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => { this.settingVisible = true; this.$refs.cardSlot.visible = false }
                },
            ],
            currentIndex: 0,
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
            defaultForum: ' '
        }
    },
    methods: {
        ...mapActions(yuanCommunityStore, [
            'getMyForumList',
            'getCommunityPost',
        ]),
        // 切换圈子
        // async setCurrentIndex(index, item) {
        //     this.currentIndex = index
        //     await this.getCommunityPost(item.id)
        // },
        // 刷新圈子
        async refreshPost() {
            this.isLoading = true
            await this.getCommunityPost(this.defaultForum.id)
            this.isLoading = false
        },
        // 查看内容详情
        showDetail(item) {
            browser.openInUserSelect(`${this.browserUrl}${item.id}`)
        },
        // 选择板块
        handleChange(value) {
            value.forEach((item) => {
                // console.log(item);
                const newItem = {
                    index: item,
                    value: this.forumList[item]
                };

                if (!this.selectList.some((el) => el.value === newItem.value)) {
                    this.selectList.push(newItem);
                }
            });
            // console.log(this.selectList);
            let temp = this.selectList;
            this.customData.selectList = temp;
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
            this.selectList = this.selectList.filter((item) => {
                return val.includes(item.index); // 过滤掉 val 中包含的索引的项目
            });

            // this.selectList = this.selectList.filter((item) => {
            //     console.log(item);
            //     val.forEach((index) => {
            //         console.log(item.index , index , 'from val to item');
            //         return item.index !== index
            //     })
            // })
            // console.log(this.selectList, '删除');
            this.selectList = this.selectList.filter((item, index) => {
                return item.value !== undefined
            })
            // console.log(this.selectList, '过滤');
            let temp = this.selectList
            this.customData.selectList = temp
            // val.forEach((item) => {
            //     console.log(item, 'from val to item');
            // })

        },

    },
    computed: {
        ...mapWritableState(yuanCommunityStore, ['communityPost', 'myForumList']),
        // 判断尺寸大小
        showSize() {
            if (this.customData && this.customData.width && this.customData.height) {
                return { width: this.customData.width, height: this.customData.height }
            }
            return this.sizeList[0]
        },
        // 判断不同高度返回不同个数
        copyNum() {
            return this.showSize.height == 2 ? 3 : 5

        },
        forumList() {
            // this.customData.forumList = this.myForumList.joined
            // return this.customData.forumList
            if (this.customData && this.customData.forumList) {
                return this.customData.forumList
            }
            return this.myForumList.joined
        },
        showForumList() {
            if (this.customData && this.customData.selectList) {
                return this.customData.selectList?.slice(0, 3)
            }
            return this.selectList.slice(0, 3)
        },
        async forumPost() {
            this.customData.forumPost = await this.communityPost.list
            return this.customData.forumPost
        },
        showForumPost() {
            if (this.customData && this.customData.forumPost) {
                return this.customData.forumPost?.slice(0, this.copyNum)
            }
            return this.communityPost.list?.slice(0, this.copyNum)
        },
    },
    async mounted() {
        this.isLoading = true
        await this.getMyForumList()
        // await this.getCommunityPost(this.showForumList[0].id)
        // this.myForumList.joined
        this.customData.forumList = this.myForumList.joined
        this.isLoading = false
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
            this.getCommunityPost(newValue.value?.id)
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
        }
    }
}
</script>
<style>
.clock-icon {
    cursor: pointer;
    transition: transform 0.3s;
    /* 添加一个过渡效果 */
}

.clock-icon:hover {
    transform: scale(1.3);
    /* 鼠标悬停时放大 */
    background-color: var(--secondary-bg);
}

.action {
    background: var(--active-bg);
    border-radius: 8px;
    cursor: pointer;
    width: 123px;
    height: 32px;
    border-left: 0px;
    padding: 0px;
    margin-right: 0px;
    text-align: center;
    color: var(--active-text);
    border: none;
}

:deep(.ant-tag-close-icon) {
    color: var(--secondary-text);
    margin-left: 8px;
    font-size: 12px;
}

:deep(.ant-drawer-title) {
    color: var(--primary-text) !important;
}

:deep(.ant-select-selection-item) {
    background: rgba(80, 139, 254, 0.20);
}

:deep(.ant-select-multiple .ant-select-selection-item) {
    background: rgba(80, 139, 254, 0.20) !important;
}

.optionClass {
    & .ant-select-selection-item {
        background-color: red !important;
    }
}
</style>