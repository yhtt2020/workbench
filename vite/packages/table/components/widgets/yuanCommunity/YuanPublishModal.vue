
<template>
    <xt-modal title="" :isFooter="false" zIndex="9" :isHeader="false" :boxIndex="100" :maskIndex="99" :esc="true"
        @close="handleOk">
        <div class="w-full pl-4 pr-4"
            :style="{ height: fullScreen ? `${windowHeight}px` : 'auto', width: fullScreen ? `${windoWidth}px` : '500px', borderRadius: fullScreen ? '0px' : '12px' }">
            <div class="flex justify-between w-full h-[64px] items-center ">
                <div class="flex justify-center w-full ">
                    <div class="flex justify-center ml-12">
                        <a-select autoClearSearchValue="false"
                            style="width: 120px;height: 40px;border-radius: 8px;line-height: 46px;margin-left: 12px;font-size: 16px;background: transparent;"
                            :showArrow="true" :bordered="false" @change="changeItem">
                            <a-select-option :value="index" v-for="(item, index) in publishType"
                                class=" xt-text selsect-options" style="font-size: 16px;text-align: center;">
                                {{ item.title }}
                                <!-- <newIcon icon="fluent:caret-down-12-filled" class="ml-1 xt-text" style="font-size: 20px;" /> -->
                            </a-select-option>
                            <template #placeholder>
                                <div class="ml-3 text-center xt-text" style="font-size: 16px;">
                                    {{ defaultType.title }}
                                </div>
                            </template>
                            <template #suffixIcon>
                                <newIcon icon="fluent:caret-down-12-filled"
                                    style="font-size: 20px;margin-top: -2px;margin-left: -8px;" class=" xt-text"></newIcon>
                            </template>
                        </a-select>
                    </div>
                </div>


                <div class="flex items-center">
                    <xt-button class="border-0 rounded-md xt-bg-2 pointer" @click="handleFullScreen"
                        style="width: 40px;height: 40px; flex-shrink: 0;">
                        <div class="flex items-center justify-center">
                            <newIcon icon="fluent:full-screen-maximize-16-filled" v-if="!fullScreen"
                                class="text-xl text-center xt-text pointer"></newIcon>
                            <newIcon icon="fluent:full-screen-minimize-16-filled" v-else
                                class="text-xl text-center xt-text pointer"></newIcon>
                        </div>

                    </xt-button>
                    <xt-button class="ml-2 border-0 rounded-md xt-bg-2 pointer" @click="handleOk"
                        style="width: 40px;height: 40px;flex-shrink: 0;">
                        <div class="flex items-center justify-center">
                            <newIcon class="text-xl text-center xt-text pointer" icon="akar-icons:cross" />
                        </div>
                    </xt-button>
                </div>


            </div>
            <vue-custom-scrollbar ref="threadListRef" :settings="settingsScroller"
                style="height: calc(100% - 80px) ;overflow: hidden;flex-shrink: 0;max-width: 1000px;margin: 0 auto;">
                <!-- 动态组件 -->
                <component :is="componentId"></component>
                <div class="flex items-center justify-between h-[56px] ">
                    <a-select v-model:value="cascaderValue" :options="options" placeholder="选择版块" :bordered="false"
                        @change="handleChange"
                        style=" font-size: 16px; border-radius: 10px;width: 120px;height: 40px;color: var(--primary-text);"
                        dropdownMenuStyle="{background: 'var(--primary-bg)'}" change-on-select>

                        <template #suffixIcon>
                            <newIcon icon="fluent:chevron-left-16-filled" class="text-base rotate-180 "
                                style="margin-top: -1px;"></newIcon>
                        </template>
                    </a-select>
                    <div class="flex items-center">
                        <xt-button type="text" class=" xt-bg-2" :w="64" :h="40" style="border-radius:10px;"
                            @click="handleOk">取消</xt-button>
                        <xt-button type="primary" class="ml-2" :w="64" :h="40"
                            style="border-radius:10px ; color:rgba(255,255,255,0.85) !important;background-color: var(--active-bg);"
                            @click="publishPost">发布</xt-button>
                    </div>
                </div>
                <!-- </div> -->

            </vue-custom-scrollbar>
        </div>

    </xt-modal>
</template>
<script setup lang='ts'>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { Icon as newIcon } from '@iconify/vue';
import { fileUpload } from '../../../components/card/hooks/imageProcessing'
import { message } from 'ant-design-vue'
import { yuanCommunityStore } from '../../../store/yuanCommunity'
import { useCommunityStore } from '../../../page/chat/commun'
import DynamicItem from './Detail/DynamicItem.vue'
import PostItem from './Detail/PostItem.vue'
const useCommunStore = useCommunityStore()
const useYuanCommunityStore = yuanCommunityStore()
// 下拉框选项
const publishType = ref([
    {
        title: '发动态',
        value: 'dynamic'
    },
    {
        title: '发帖子',
        value: 'post'
    },
    // {
    //     title: '发视频',
    //     value: 'video'
    // }
])
// 默认选项
let defaultType = ref({ 'title': '发动态', 'value': 'dynamic' })
// 视频文件
// const videoList = ref([])
// 封面文件
// const coverList = ref([])
// 是否全屏
const fullScreen = ref(false)
// 正文内容
const postValue = ref('')
const props = defineProps({
    replyVisible: Boolean,
    showPublishModal: Boolean,
    forumId: Number,
    forum: Array
})
const componentId = computed(() => {
    if (defaultType.value.value == 'dynamic') {
        return DynamicItem
    } else if (defaultType.value.value == 'post') {
        return PostItem
    }
})
// 发布帖子
const titleValue = ref('')
// 表情保存
// let folderPath = reactive([])
let windoWidth = ref()
let windowHeight = ref()
// 滚动条设置
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});
// 图片暂存
// const fileList = ref<UploadProps['fileList']>([]);
// 清除封面
// const removeCover = () => {
//     coverList.value = []
// }
// 修改发布框
const changeItem = (index) => {
    defaultType.value = publishType.value[index]
}
// 全屏状态修改
const handleFullScreen = () => {
    fullScreen.value = !fullScreen.value
}
// 添加表情
// const addEmoji = (item) => {
//     const lastSlashIndex = item.lastIndexOf('/');
//     const emojiValue = item.substring(lastSlashIndex + 1);
//     const key = Object.entries(fluentEmojis).find(([k, v]) => v === (emojiValue))[0]
//     postValue.value += `${key}`

// }
// 图片添加是否可见
// const imageLoadVisible = computed(() => {
//     return fileList.value?.length > 0
// })
const emit = defineEmits(['handleOk'])
onMounted(() => {
    // 表情转换
    // Object.values(fluentEmojis).forEach((item) => {
    //     folderPath.push(`${emoji.value}${item}`)
    // })
    windoWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    useYuanCommunityStore.getMyForumList()
})

// 选择发帖板块
const communCate = computed(() => useYuanCommunityStore.myForumList.joined)
const options = ref([]);
communCate.value.forEach((item) => {
    options.value.push({
        value: item.id,
        label: item.name
    })
})
let cascaderValue = ref([])
// 修改发帖板块
const handleChange = (value) => {
    cascaderValue.value = value
}

const translateImage=(fileList)=>{
    return Promise.all(fileList.map(async (file)=>{
        return await fileUpload(file.originFileObj);
    }))
}
const handleOk = () => {
    emit('handleOk', false)
};
const postContent=computed(()=>{
    return useYuanCommunityStore.postContent
})
const dynamicContent=computed(()=>{
    return useYuanCommunityStore.dynamicContent
})
const publishPost = async () => {
    if (postValue.value || fileList.value.length > 0 || useYuanCommunityStore.saveContent) {
        const imageUrlList = await translateImage(fileList.value)
        let coverImage
        if (coverList.value.length > 0) {
            const coverUrlList = await translateImage(coverList.value)
            coverImage = await JSON.stringify(coverUrlList);

        }
        let forumId = cascaderValue.value
        let content = computed(() => {
            switch (defaultType.value.value) {
                case 'dynamic':
                    return dynamicContent.value.content
                    break;
                case 'post':
                    return postContent.value.content
                    break;
            }
        })
        let title = computed(() => {
            if (!postContent.value.title || postContent.value.title.length < 5) {
                return postContent.value.content.slice(0, 5)
            }
            return titleValue.value
        })
        const imageList = await JSON.stringify(imageUrlList);
        setTimeout(async () => {
            if (defaultType.value.value == 'dynamic') {
                let is_weibo = 1
                await useCommunStore.getCommunityPublishPost(forumId, imageList, content.value, title.value, is_weibo)
            } else if (defaultType.value.value == 'post') {
                console.log(forumId, imageList, content.value, title.value, coverImage);
                await useCommunStore.getPublishPost(forumId, imageList, content.value, title.value, coverImage)
            }
            message.success('发布成功')
            handleOk()
        });

    }
}


</script>
<style lang='scss' scoped>
:deep(.ant-upload-list-text-container) {
    display: none;
}

.box {
    border-radius: 12px;
}

.font-16 {

    font-size: 16px;
    // text-align: center;
    font-weight: 400;
}


:deep(.ant-upload-list-picture-card .ant-upload-list-item-thumbnail) {
    font-size: 8px;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
    width: 64px;
    height: 64px;
}

:deep(.ant-upload-list-picture-card-container) {
    width: 64px;
    height: 64px;
}

:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-item) {
    padding-right: 0px;
}

:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder) {
    color: var(--secondary-text);
    height: 40px;
    line-height: 40px;
    text-align: center;
}

:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-item) {
    color: var(--secondary-text);
    height: 40px;
    line-height: 40px;
    text-align: center;
}

:deep(.ant-select-arrow) {
    color: var(--secondary-text);
    font-size: 16px;
}

// :deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-item, .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder) {
//     // &::placeholder {
//     font-weight: 400;
//     font-size: 16px;

//     color: var(--secondary-text);
//     // }
// }

// :deep(.ant-select-open) {
//     background: var(--primary-bg) !important;
//     color: var(--primary-text) !important;
// }

// :deep(.ant-select-focused) {
//     background: var(--primary-bg) !important;
//     color: var(--primary-text) !important;
// }

// :deep(.ant-select-focused .ant-select-open) {
//     background: var(--primary-bg) !important;
//     color: var(--primary-text) !important;
// }

:deep(.ant-input) {
    color: var(--secondary-text);
    margin-left: 8px;

    &::placeholder {
        font-weight: 400;
        font-size: 16px;

        color: var(--secondary-text);
        // padding-left: 8px;
    }
}

:deep(.tippy-box) {
    width: 51%;
    margin-left: 35%;
}


.reply-textarea {
    border-radius: 10px;

    textarea {
        border-radius: 10px;

        &:deep(.ant-input) {
            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
}</style>
