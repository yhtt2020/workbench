<template>
    <div>
        <Widget :desk="desk" :options="options" :customIndex="customIndex" :menuList="menuList" ref="cardSlot"
            :sizeList="sizeList" :customData="customData">
            <template #left-title>
                <div class="icon"
                    style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
                    <YuanIcon icon="fluent:chat-16-regular" style="font-size: 20px;"></YuanIcon>
                </div>
            </template>
            <!-- 顶部导航栏 -->
            <div class="flex justify-between mt-4">
                <!-- {{ showForumList[0].id }} -->
                <div v-if="this.showForumList.length === 1" class="flex items-center">
                        <div class="w-[44px] h-[44px] rounded-md">
                            <img :src="this.showForumList[0].logo" alt="" class="w-full h-full">
                            
                        </div>
                        <div class="font-16 ml-2 xt-text">
                            {{ this.showForumList[0].name }}
                        </div>
                    </div>
                <div class="flex  w-[376px] h-[44px] justify-center xt-bg rounded-lg " v-else>
                    <div v-for="(item, index) in navTopList" :key="index"
                        class="w-[123px] h-[36px]  mt-1 mb-1 text-center leading-9 font-16"
                        :class="[{ action: currentIndex == index }]" style="cursor: pointer;"
                        @click="setCurrentIndex(index,item)">{{
                            item.name
                        }}</div>
                </div>
                <div>
                    <button class="ml-2 border-0 rounded-md xt-bg pointer w-[44px] h-[44px] " @click="refreshPost"
                        style="flex-shrink: 0;">
                        <YuanIcon class="text-lg xt-text" style="vertical-align: sub;font-size: 20px;"
                            icon="fluent:add-16-filled" />
                    </button>
                    <button class="ml-2 border-0 rounded-md xt-bg pointer w-[44px] h-[44px]" @click="goYuan"
                        style="flex-shrink: 0;">
                        <YuanIcon class="text-lg xt-text" style="vertical-align: sub;font-size: 20px;"
                            icon="fluent:chat-16-regular" />
                    </button>
                    <button class="ml-2 border-0 rounded-md xt-bg pointer w-[44px] h-[44px]" @click="goYuan"
                        style="flex-shrink: 0;">
                        <YuanIcon class="text-lg rotate-90 xt-text" style="vertical-align: sub; font-size: 20px;"
                            icon="akar-icons:arrow-clockwise" />
                    </button>
                </div>
            </div>
            <!-- 内容区 -->
            <div v-if="pageToggle">
                <div v-if="isLoading">
                    <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
                </div>
                <div class="content" v-else>
                    <div v-for="(item, index) in copyNum" style="display: flex;" class="">
                        <div class="item">
                            <communItem :key="index" :copyNum="copyNum"  />
                        </div>

                    </div>

                </div>

            </div>
        </Widget>
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
            <div class="xt-bg-2 w-full h-[48px] rounded-xl flex justify-between items-center">
                <div class="ml-2">
                    <a-tag closable v-for="(item, index) in forumList" style="width: 76px;height: 36px;border-radius: 8px;text-align: center;line-height: 36px; background: rgba(80,139,254,0.20); border: none;" class="font-14 xt-text pointer" >{{ item.name }}</a-tag>
                </div>
                <div>
                    <YuanIcon icon="fluent:chevron-left-16-filled" style="font-size: 20px;vertical-align: sub;" class="mr-3 rotate-180 xt-text"></YuanIcon>
                </div>
            </div>
        </a-drawer>
    </div>
</template>
<script>
import Widget from '../../card/Widget.vue';
import { Icon as YuanIcon } from '@iconify/vue'
import communItem from './communItem.vue'
import RadioTab from '../../RadioTab.vue';
import { mapWritableState, mapActions } from 'pinia';
import {yuanCommunityStore} from '../../../store/yuanCommunity.ts'
export default {
    name: '元社区',
    components: {
        Widget,
        YuanIcon,
        communItem,
        RadioTab
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
            navTopList: [
                {
                    name: '影视圈'
                },
                {
                    name: '直播圈',
                },
                {
                    name: '音乐圈'
                }
            ],
            currentIndex: 0,
            isLoading: false,
            pageToggle: true,
            dataType:[{ title: '社区频道', name: '社区频道' }, { title: '我加入的圈子', name: '我加入的圈子' }],
            defaultType:{ title: '我加入的圈子', name: '我加入的圈子' },
        }
    },
    methods: {
        ...mapActions(yuanCommunityStore, [
            'getMyForumList',
            'getCommunityPost',
        ]),
        async setCurrentIndex(index,item) {
            this.currentIndex = index
            await this.communityPost(item.id)
            console.log(this.showForumPost,'this.showForumList');
        },
        refreshPost(){
            console.log(this.showForumPost);
        }
    },
    computed: {
        ...mapWritableState(yuanCommunityStore,['communityPost','myForumList']),
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
        forumList(){
            this.customData.forumList=this.myForumList.joined
            return this.customData.forumList
        },
        showForumList(){
            if(this.customData && this.customData.forumList){
                return this.customData.forumList.slice(0,3)
            }
            return this.myForumList.joined.slice(0,3)
        },
        forumPost(){
            this.customData.forumPost=this.communityPost.list
            return this.customData.forumPost
        },
        // showForumPost(){
        //     return this.forumPost.slice(0,this.copyNum)
        // }
    },
    async mounted() {
        this.isLoading = true
        await this.getMyForumList()
        await this.getCommunityPost(this.showForumList[0].id)
        this.isLoading = false
    },
}
</script>
<style>
.action {
    background: var(--active-bg);
    border-radius: 8px;
    cursor: pointer;
    width: 123px;
    height: 36px;
    border-left: 0px;
    padding: 0px;
    margin-right: 0px;
    text-align: center;
    color: var(--active-text);
    border: none;
}
:deep(.ant-tag-close-icon){
    color: var(--secondary-text);
    margin-left: 8px;
    font-size: 12px;
}
:deep(.ant-drawer-title){
    color: var(--primary-text) !important;
}
</style>