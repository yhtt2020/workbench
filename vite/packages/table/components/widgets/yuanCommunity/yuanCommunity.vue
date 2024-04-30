<template>
    <div>
        <xt-container
            @titleHover="settingVisible = true"
            v-model:customSize="customData.customSize"
            :header="header" 
            :desk="desk" 
            :options="options" 
            :customIndex="customIndex" 
            :envLimit="['guest', 'offline', 'single']"
            :menuList="menuList" 
            ref="cardSlot" 
            :env="env"
            :sizeList="sizeList" 
            :customData="customData"
            @delete="deleteCard">
            <div v-if="showForumList.length > 0" class="flex flex-col flex-1 " style="height: calc(100%);">
            <xt-option-tab 
                v-if="showForumList.length > 1" 
                :list="showForumList" 
                :circle="true" 
                v-model="defaultForum" 
                style="height: 40px;">
            </xt-option-tab>
            <div  v-if="showForumPost.length > 0" class="flex flex-col flex-1 w-full h-0">
                <vue-custom-scrollbar ref="threadListRef"  :settings="outerSettings"
                    style="overflow: hidden;width: 100%;" class="flex-1">
                    <div v-if="isLoading">
                        <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
                    </div>
                    <div class="content" v-else>
                        <div v-for="(item, index) in showForumPost" style="display: flex;" class="">
                            <div class="item" @click="showDetail(item)">
                                <communItem :key="index" :showForumPost="item" />
                            </div>
                        </div>
                        <!-- <div class="flex items-center justify-center w-full h-[40px] mt-3">
                            <xt-button :w="84" :h="32"
                                style="
                                backend:var(--primary-bg);
                                color:var(--secondary-text);
                                border-radius: 8px;">查看更多
                            </xt-button>
                        </div> -->
                    </div>
                </vue-custom-scrollbar>
            </div>
            <Unusual  :title="'暂无数据'" :buttonTitle="'设置'" v-else @back="backSetting"></Unusual>
        </div>
        <Unusual :title="'暂无数据'" :buttonTitle="'设置'" v-else @back="backSetting"></Unusual>
            <!-- <xt-button 
                :w="40" 
                :h="40"
                type="theme"  
                @click="publishModalVisible" 
                :icon="'fluent:add-16-filled'"
                style="position: absolute;right: 24px;bottom: 24px;color:rgba(255,255,255,0.85) !important;">

            </xt-button> -->
        </xt-container>
        <teleport to="body" :disabled="false">
            <PublishModal 
                v-if="showPublishModal" 
                :visible="showPublishModal" 
                @close="showPublishModal = false"
                @refreshDefaultForum="refresh"
                :section="forumList"
                :defaultSection="defaultForum">
            </PublishModal>
            <div v-if="showDetailModal">
                <detailModal v-if="toggleDetail" :cardData="cardData" :showDetailModal="showDetailModal"
                    @closeDetail="closeDetail" />
                <MinDetailModal v-else :cardData="cardData" :showDetailModal="showDetailModal" @closeDetail="closeDetail" />
            </div>
        </teleport>
        <CommunitySetting 
            v-if="settingVisible" 
            :settingVisible="settingVisible" 
            :forumList="forumList"
            :defaultForum="customData.selectList"
            @forumList="updateForumList"
            @close="this.settingVisible = false">
        </CommunitySetting>


    </div>
</template>
<script>
import Widget from '../../card/Widget.vue';
import { Icon as YuanIcon } from '@iconify/vue'
import communItem from './CommunItem.vue'
import RadioTab from '../../RadioTab.vue';
import { mapWritableState, mapActions } from 'pinia';
import { useCommunityStore } from '../../../apps/chat/store/commun'
import { yuanCommunityStore } from '../../../store/yuanCommunity'
import Unusual from '../Unusual.vue'
import detailModal from './DetailModal.vue'
import MinDetailModal from './MinDetailModal.vue';
import CommunitySetting from './CommunitySetting.vue';
import PublishModal from './Detail/PublishModal.vue';
export default {
    name: '元社区',
    components: {
        Widget,
        YuanIcon,
        communItem,
        RadioTab,
        detailModal,
        MinDetailModal,
        Unusual,
        CommunitySetting,
        PublishModal
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
        },
        openWay: {
            type: String,
            default: "desk"
        }
    },
    emits: ['delete'],
    data() {
        return {
            sizeList: [
                {
                    value: '4x4',
                    name: '4x4'
                },
                {
                    value: '4x6',
                    name: '4x6'
                },

            ],
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
            selectForumList: [],
            browserUrl: 'https://s.apps.vip/post/',
            showPublishModal: false,
            selectList: [],
            defaultForum:  { name: '版本更新', value: 100304 } ,
            outerSettings: {
                useBothWheelAxes: true,
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: true,
            },
            showDetailModal: false,
            cardData: null,
            toggleDetail: true,
            selectValue: [],
            env: {
                web: false,
                mobile: false,
                client: false,
                single: true,
            },
            showForumPost: [],
            isClick:true,
        }
    },
    methods: {
        ...mapActions(yuanCommunityStore, [
            'getMyForumList',
            'getCommunityPost',
        ]),
        deleteCard() {
            this.$emit('delete')
        },
        // 刷新圈子
        async refreshPost() {
            this.isLoading = true
            // console.log(this.defaultForum,'defaultForum')
            let value = 0
            this.defaultForum.value ? value = this.defaultForum.value : value = this.defaultForum
            // console.log(value,'value')
            await this.getCommunityPost(value)
            this.showForumPost = this.communityPost
            this.isLoading = false
            this.isClick = false
        },
        // 发文后刷新页面
        async refresh(value) {
            this.isLoading = true
            this.defaultForum = value
            await this.getCommunityPost(value)
            this.showForumPost = this.communityPost
            this.isLoading = false
        },
        // 查看内容详情
        showDetail(item) {
            // browser.openInUserSelect(`${this.browserUrl}${item.id}`)
            this.showDetailModal = true
            this.cardData = item
            this.isClick = false
            // console.log(this.cardData);
        },
        closeDetail(value) {
            this.communityPostDetail = []
            this.communityReply = []
            this.showDetailModal = value
        },
        // 显示发布页是否可见
        publishModalVisible() {
            this.showPublishModal = !this.showPublishModal
        },
        // 回调
        modalVisible(val) {
            this.showPublishModal = val
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
        },
        updateForumList(list){
            this.customData.selectList = list
        },
        // 记忆帖子，当切换页面时记忆帖子，如果没有操作10S后更新帖子列表
        memoryPost(){
            const cachePost = JSON.parse(localStorage.getItem('communityContent'))
            // console.log(cachePost,'cachePost');
            if(cachePost){
                this.showForumPost = cachePost
                setTimeout(() => {
                    if(this.isClick){
                        this.isLoading = true
                        this.refreshPost().then(()=>{
                            this.isLoading = false
                        })
                    }
                }, 10000);
                // 当获取到帖子内容后，清除缓存
                localStorage.removeItem('communityContent')
            }else{
                this.showForumPost = this.communityPost
            }
        }
    },
    computed: {
        ...mapWritableState(yuanCommunityStore, ['communityPost', 'myForumList', 'forumsList', 'defaultSection']),
        ...mapWritableState(useCommunityStore, ['communityReply', 'communityPostDetail']),
        // 判断尺寸大小
        showSize() {
            if (this.customData.customSize) {
                let arr = this.customData.customSize.split('x')
                return {
                  width: arr[0],
                  height: arr[1]
                }
            }else{
              return {
                width: 4,
                height: 4
              }
            }
        },
        options(){
            return {
                customDel: this.openWay === 'nav' ? true : false,
                title:'元社区'
            }
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
        header(){
            return {
                title: this.options.title,
                ifyIcon:'fluent:chat-16-regular',
                refresh:{
                    fn:this.refreshPost,
                    tip:"刷新",
                    state:this.isLoading ? true : false
                },
                titleHoverName:'点击切换',
                titleHover:true,
                rightIcon:[
                    {
                        tip:"发布",
                        ifyIcon:'fluent:add-16-regular',
                        fn:this.publishModalVisible,
                    }
                ]
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
        } else if (this.customData && this.customData.selectList) {
            this.defaultForum = this.customData.selectList[0]
        } else {
            this.selectList.push(this.defaultForum)
            this.customData.selectList = this.selectList
            this.defaultForum = this.customData.selectList[0]
        }
    },
    async mounted() {
        // this.isLoading = true
        // 判断组件名称
        if (this.customData.selectList && this.customData.selectList.length === 1) {
            this.options.title = this.customData.selectList[0].name
        }
        // this.isLoading = false
        window.addEventListener("resize", this.handleResize)
        // this.showForumPost = this.communityPost
        this.memoryPost()
        if(this.customData.customSize === undefined){
            this.customData.customSize = '4x4'
        }
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.handleResize)
    },
    watch: {
        customSize(newVal,oldVal) {
            this.customData.customSize = newVal
        },
        showForumList(newValue) {
            // this.isLoading = true
            if (this.showForumList.length > 0) {
                this.getCommunityPost(this.showForumList[0].value)
            }
            // setTimeout(() => {
            //     this.isLoading = false
            // });

        },
        defaultForum(newValue) {
            this.customData.defaultForum = newValue
            this.defaultSection = this.customData.defaultForum
            // this.isLoading=true
            let target = ''
            if(this.customData.defaultForum.index){
                target = this.customData.defaultForum.value.id
            }else if (this.customData.defaultForum.value){
                target = this.customData.defaultForum.value
            }else{
                target = this.customData.defaultForum
            }
            this.getCommunityPost(target).then(() => {
                this.showForumPost = this.communityPost;
                // this.isLoading=false
            })
            // this.isClick = false

        },
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
                    this.options.title = newValue[0].name
                } else if (newValue.length > 1 || newValue.length < 1) {
                    this.options.title = '元社区'
                }
            }
        },
        settingVisible() {
            // 加载已选择的模块
            this.isClick = false
            if (this.customData && this.customData.selectList && this.settingVisible == true) {
                this.selectValue = this.customData.selectList.map((item) => {
                    return item.index
                })
            }
        }
    },
    unmounted() {
        // console.log('222222222222<<<<<<<<<<<<<',this.showForumPost)
        localStorage.setItem('communityContent', JSON.stringify(this.showForumPost));
    },
}
</script>
<style lang="scss"></style>../../../page/chat/commun.ts./YuanCommunity.vue/index.ts
