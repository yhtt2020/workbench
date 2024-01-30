<template>
    <xt-container 
        :header="header" 
        :customSize="customSize" 
        :sizeList="sizeList"
        :customIndex="customIndex"
        :defaultData="defaultData"
        :menuList="menuList"
        :customData="customData">
        <div v-if="showForumList.length > 0" class="flex flex-col flex-1 " style="height: calc(100% - 20px);">
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
                        <div class="flex items-center justify-center w-full h-[40px] mt-3">
                            <xt-button :w="84" :h="32"
                                style="
                                backend:var(--primary-bg);
                                color:var(--secondary-text);
                                border-radius: 8px;">查看更多
                            </xt-button>
                        </div>
                    </div>
                </vue-custom-scrollbar>
            </div>
            <Unusual  :title="'暂无数据'" :buttonTitle="'设置'" v-else @back="backSetting"></Unusual>
        </div>
        <Unusual :title="'暂无数据'" :buttonTitle="'设置'" v-else @back="backSetting"></Unusual>
    </xt-container>
    <xt-button 
        :w="40" 
        :h="40"
        type="theme"  
        @click="publishModalVisible" 
        :icon="'fluent:add-16-filled'"
        style="
            position: absolute;
            right: 24px;bottom: 24px;
            color:rgba(255,255,255,0.85) !important;">
    </xt-button>
    <teleport to="body" :disabled="false">
        <PublishModal 
            v-if="showPublishModal" 
            :visible="showPublishModal" 
            @close="showPublishModal = false"
            @refreshDefaultForum="refreshPost"
            :section="forumList"
            :defaultSection="defaultForum">
        </PublishModal>
        <div v-if="showDetailModal">
            <detailModal 
                v-if="toggleDetail" 
                :cardData="cardData" 
                :showDetailModal="showDetailModal"
                @closeDetail="closeDetail" />
            <MinDetailModal 
                v-else 
                :cardData="cardData" 
                :showDetailModal="showDetailModal" 
                @closeDetail="closeDetail" />
        </div>
    </teleport>
    <CommunitySetting 
         v-if="settingVisible" 
         :settingVisible="settingVisible" 
         :forumList="forumList"
         :defaultForum="customData.selectList"
         @forumList="updateForumList"
         @close="settingVisible = false">
    </CommunitySetting>
</template>

<script setup lang='ts'>
import { ref,
     reactive,
     computed,
     toRefs,
     onBeforeMount,
     onMounted,
     onBeforeUnmount,
     watch 
    } from 'vue'
import CommunitySetting from './CommunitySetting.vue'
import detailModal from './DetailModal.vue'
import MinDetailModal from './MinDetailModal.vue';
import { storeToRefs } from 'pinia';
import { useCommunityStore } from '../../../page/chat/commun'
import { yuanCommunityStore } from '../../../store/yuanCommunity.ts'
import PublishModal from './Detail/PublishModal.vue'
import communItem from './communItem.vue';
import Unusual from '../Unusual.vue';

const communityStore = useCommunityStore();
const yuanStore = yuanCommunityStore();
const {communityReply,communityPostDetail} = storeToRefs(communityStore)
const {communityPost,myForumList} = storeToRefs(yuanStore)
// 常量设置
// 设置可见
const settingVisible = ref(false)
const showPublishModal = ref(false)
const showDetailModal = ref(false)
const toggleDetail = ref(false)
const isLoading = ref(false)
const isClick = ref(true)
const showForumPost = ref([])
const cardData = ref({})
const selectList = ref([])
const defaultForum = ref({name:'版本更新',value:'100304'})
const outerSettings = ref({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
})

const header = computed(()=>{
    let obj = {
        title: customData.value.selectList.length ===1 ? customData.value.selectList[0].name : '元社区',
        ifyIcon:'fluent:chat-16-regular',
        rightIcon:[
            {
                showIcon:'',
                disabled:true
            }
        ],
        refresh:{
            tip:'刷新',
            fn:refreshPost
        }
    }
    return obj
})
const customSize = ref('4x4')

const sizeList = ref([
    {
        name: '4x4',
        value: '4x4',
    },
    {
        name: '4x6',
        value: '4x6',
    }
])

const defaultData = {
    defaultForum:{
        name:'版本更新',
        value:'100304',
    }
    
}

const customIndex = ref(0)

// 菜单列表
const menuList = ref([
    {
        newIcon:'fluent:settings-16-regular',
        title:'设置小组件',
        fn:()=>{
            settingVisible.value = true;
        }
    }
])

const props = defineProps({
    customData: {},
})

const { customData } = toRefs(props)


// 刷新帖子
const refreshPost = async()=>{
    isLoading.value = true
    let value = ''
    defaultForum.value.value ? value = defaultForum.value.value : value = defaultForum.value
    await yuanStore.getCommunityPost(value)
    showForumPost.value = yuanStore.communityPost
    isLoading.value = false
    isClick.value = false
    
}

// 空状态时，打开设置界面
const backSetting = ()=>{
    settingVisible.value = true
}

// 打开详情页
const showDetail = (item)=>{
    showDetailModal.value = true
    cardData.value = item
    isClick.value = false
}

// 关闭详情页，并清空相关数据
const closeDetail = (value)=>{
    showDetailModal.value = value
    communityPostDetail.value = []
    communityReply.value = []
}

// 更新选择的版块
const updateForumList = (data)=>{
    customData.value.selectList = data
    console.log(customData.value.selectList,data,'customData')
}

const publishModalVisible = ()=>{
    showPublishModal.value = true
}

onBeforeUnmount(()=>{
    window.removeEventListener("resize", handleResize)
    localStorage.setItem('communityContent', JSON.stringify(showForumPost.value));
})

onBeforeMount(()=>{
    yuanStore.getMyForumList().then(()=>{
        customData.value.forumList = myForumList.value
    })
    // 判断是否刷新加载内容
    if(customData.value && customData.defaultForum){
        defaultForum.value = customData.value.defaultForum
    }else if(customData.value && customData.selectList){
        defaultForum.value = customData.value.selectList[0]
    }else{
        selectList.value.push(defaultForum.value)
        customData.value.selectList = selectList.value
    }
})

onMounted(()=>{
    memoryPost()
    window.addEventListener("resize", handleResize)
})

// 判断当前设备的宽度，切换数据的展示方式
const handleResize = ()=>{
    if(window.innerWidth > 1200){
        toggleDetail.value = true
    }
}

// 记忆数据，当跳转桌面时，先获取到卸载前的数据，再重新获取
const memoryPost = ()=>{
    const cachePost = JSON.parse(localStorage.getItem('communityContent'))
    if(cachePost){
        showForumPost.value = cachePost
        setTimeout(() => {
            if(isClick.value){
                isLoading.value = true
                refreshPost().then(()=>{
                    isLoading.value = false
                })
            }
        }, 10000);
    }
}

// 获取全部添加的板块
const forumList = computed(()=>{
    if(customData.value && customData.forumList){
        return customData.value.forumList
    }
    return myForumList.value
})

// 显示的版块
const showForumList = computed(()=>{
    if(customData.value && customData.value.selectList){
        return customData.value.selectList?.slice(0,5)
    }
    return selectList.value.slice(0,5)
})

// 监听版块变化时，获取对应的数据
watch(()=>defaultForum.value,(newV,oldV)=>{
    customData.value.defaultForum = newV
    let target = ''
    if(customData.value.defaultForum.index){
        target = customData.value.defaultForum.value.id
    }else if (customData.value.defaultForum.value){
        target = customData.value.defaultForum.value
    }else {
        target = customData.value.defaultForum
    }
    console.log(target,'target')
    yuanStore.getCommunityPost(target).then(()=>{
        console.log(communityPost.value,'communityPost.value')
        showForumPost.value = communityPost.value 
    })
})
</script>
<style lang='scss' scoped></style>