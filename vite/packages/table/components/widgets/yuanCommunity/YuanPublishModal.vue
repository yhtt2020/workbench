
<template>
    <xt-old-modal title="" :isFooter="false" zIndex="9" :isHeader="false" :boxIndex="100" :maskIndex="99" :esc="true"
        @close="handleOk">
        <div class="w-full pl-4 pr-4"
            :style="{ height: fullScreen ? `${windowHeight}px` : 'auto', width: fullScreen ? `${windoWidth}px` : '500px', borderRadius: fullScreen ? '0px' : '12px' }">
            <!-- header -->
            <div class="flex justify-between w-full h-[54px] items-center ">
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
                <!-- body -->
                <!-- {{ props.forum }} -->
                <!-- <slot name="content" /> -->
                <component :is="componentId"></component>
                <div style=" " v-if="imageLoadVisible">
                    <a-upload v-model:file-list="fileList" action="" class="ml-1 text-base " list-type="picture-card"
                        multiple @preview="handlePreview">
                        <div v-if="fileList.length < 6">
                            <div class="flex items-center justify-center">
                                <newIcon icon="fluent:add-16-filled" style="font-size: 24px;" class="xt-text"></newIcon>
                            </div>
                        </div>
                    </a-upload>
                </div>
                <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                    <img style="width: 100%" :src="previewImage" />
                </a-modal>
                <!-- button -->
                <div class="h-[45px] flex items-center justify-between">
                    <div class="flex items-center justify-center xt-text-2">
                        <tippy trigger=" click" placement="bottom" :interactive="true">
                            <template #content>
                                <vue-custom-scrollbar :settings="settingsScroller"
                                    class="w-full h-[150px] xt-bg-2 rounded-lg flex  " style="flex-wrap: wrap;">
                                    <div v-for="(item, index) in folderPath"
                                        class="mb-2 ml-1 mr-1  pointer w-[32px] h-[32px]" @click="addEmoji(item)"
                                        :key="index" style="cursor: pointer;">
                                        <img :src="item" class="w-[32px] h-[32px]">
                                    </div>
                                </vue-custom-scrollbar>
                            </template>
                            <xt-button type="text" class=" xt-text emojiVis" :w="72" :h="32" :throttleTime="0"
                                style="color: var(--secondary-text) !important;">
                                <div class="flex items-center justify-center">
                                    <newIcon icon="fluent:emoji-smile-slight-24-regular" class="text-xl xt-text-2"
                                        style="margin-right: 4px;" /> 表情
                                </div>

                            </xt-button>
                            <!-- <button>表情</button> -->
                        </tippy>
                        <a-upload v-model:file-list="fileList" @preview="handlePreview" multiple>
                            <xt-button type="text" :w="72" :h="32" class="xt-text"
                                style="color: var(--secondary-text) !important;">
                                <div class="flex items-center justify-center">
                                    <newIcon icon="fluent:image-multiple-16-regular" class="text-xl xt-text-2"
                                        style="margin-right: 4px;" />图片
                                </div>

                            </xt-button>
                            <!-- <button>表情</button> -->
                        </a-upload>
                        <!-- <slot name="more-button" /> -->
                        <div v-if="defaultType.value === 'post'">
                            <a-upload v-model:file-list="coverList" @preview="handlePreview" maxCount="1"
                                v-show="coverList.length === 0">
                                <xt-button type="text" :w="118" :h="32" class="xt-text"
                                    style="color: var(--secondary-text) !important;">
                                    <div class="flex items-center justify-center">
                                        <newIcon icon="fluent:image-sparkle-16-regular" class="text-xl xt-text-2"
                                            style="margin-right: 4px;" />
                                        设置封面
                                    </div>

                                </xt-button>
                                <!-- <button>表情</button> -->
                            </a-upload>
                            <xt-button type="text" :w="118" :h="32" class="xt-text" v-show="coverList.length > 0"
                                @click="removeCover" style="color: var(--secondary-text) !important;">
                                <div class="flex items-center justify-center">
                                    <newIcon icon="akar-icons:trash-can" class="text-xl xt-text-2"
                                        style="margin-right: 4px;" />
                                    移除封面
                                </div>
                            </xt-button>
                        </div>

                    </div>

                </div>
                <!-- extra content -->
                <!-- <slot name="extra-content" /> -->
                <div style="font-size: 16px !important;" v-if="coverList.length > 0">
                    <a-image :width="200" :src="coverList[0]?.originFileObj.path" />
                </div>
                <!-- foot -->
                <div class="flex items-center justify-between h-[56px] ">
                    <a-select v-model:value="cascaderValue" :options="selectOptions" placeholder="选择版块" :bordered="false"
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
            </vue-custom-scrollbar>
        </div>

    </xt-old-modal>
</template>
<script setup lang='ts'>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { Icon as newIcon } from '@iconify/vue';
import { message } from 'ant-design-vue'
import { yuanCommunityStore } from '../../../store/yuanCommunity'
import { useCommunityStore } from '../../../page/chat/commun'
import DynamicItem from './Detail/DynamicItem.vue'
import PostItem from './Detail/PostItem.vue'
import { translateImage, translateOnlyImage } from './Detail/index'
import fluentEmojis from '../../../js/chat/fulentEmojis'
const emoji = ref('https://sad.apps.vip/public/static/emoji/emojistatic/')
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
const coverList = ref([])
// 是否全屏
const fullScreen = ref(false)
const props = defineProps({
    options: {
        type: () => Object,
    },
})
const componentId = computed(() => {
    if (defaultType.value.value == 'dynamic') {
        return DynamicItem
    } else if (defaultType.value.value == 'post') {
        return PostItem
    }
})
// 表情保存
let folderPath = reactive([])
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
const fileList = ref([]);
// 清除封面
const removeCover = () => {
    coverList.value = []
    useYuanCommunityStore.postContent.coverList = []
}
// 修改发布框
const changeItem = (index) => {
    defaultType.value = publishType.value[index]
}
// 全屏状态修改
const handleFullScreen = () => {
    fullScreen.value = !fullScreen.value
}
// 选中图标
const emojiKey = ref('')
// 添加表情
const addEmoji = (item) => {
    const lastSlashIndex = item.lastIndexOf('/');
    const emojiValue = item.substring(lastSlashIndex + 1);
    emojiKey.value = Object.entries(fluentEmojis).find(([k, v]) => v === (emojiValue))[0]
    // useYuanCommunityStore.dynamicContent.content += `${emojiKey.value}`
    addEmojiContent()
}
// 添加图标到内容中
const addEmojiContent = () => {
    if (defaultType.value.value === 'dynamic') {
        useYuanCommunityStore.dynamicContent.content += `${emojiKey.value}`
    } else if (defaultType.value.value === 'post') {
        useYuanCommunityStore.postContent.title += `${emojiKey.value}`
    }
}
// 图片添加是否可见
const imageLoadVisible = computed(() => {
    return fileList.value?.length > 0
})
const emit = defineEmits(['handleOk'])
onMounted(async () => {
    // 表情转换
    Object.values(fluentEmojis).forEach((item) => {
        folderPath.push(`${emoji.value}${item}`)
    })
    windoWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    await useYuanCommunityStore.getMyForumList()
    communCate.value.forEach((item) => {
        selectOptions.value.push({
            value: item.id,
            label: item.name
        })
    })
    let res = selectOptions.value.find((item) => {
        return item.label === useYuanCommunityStore.defaultSection.value.name
    })
    cascaderValue.value=res.value
})

// 选择发帖板块
const communCate = computed(() => useYuanCommunityStore.myForumList.joined)
const selectOptions = ref([]);
let cascaderValue = ref([])
// 修改发帖板块
const handleChange = (value) => {
    cascaderValue.value = value
}
const handleOk = () => {
    emit('handleOk', false)
};
const postContent = computed(() => {
    return useYuanCommunityStore.postContent
})
const dynamicContent = computed(() => {
    return useYuanCommunityStore.dynamicContent
})
// 监听图片
watch(fileList, async () => {
    let imagesList = await translateImage(fileList.value)
    if (defaultType.value.value == 'dynamic') {
        useYuanCommunityStore.dynamicContent.imagesList = JSON.stringify(imagesList)
    } else if (defaultType.value.value == 'post') {
        useYuanCommunityStore.postContent.imagesList = JSON.stringify(imagesList)
    }
})
watch(coverList, async () => {
    let coversList = await translateImage(coverList.value)
    useYuanCommunityStore.postContent.coverList = coversList.toString()
})
const publishPost = async () => {
    try {
        if (dynamicContent.value.content || dynamicContent.value.imagesList.length > 0 && defaultType.value.value == 'dynamic') {
            let dynamic = dynamicContent.value
            setTimeout(async () => {
                await useCommunStore.getCommunityPublishPost(cascaderValue.value, dynamic.imagesList, dynamic.content)
            });
        } else if (postContent.value.content || postContent.value.imagesList.length > 0 && defaultType.value.value == 'post') {
            let post = postContent.value
            const title = post.title.length > 5 ? post.title : post.content.slice(0, 5)
            setTimeout(async () => {
                // console.log(cascaderValue.value, post.imagesList, post.content, title, post.coverList, 'post-publish')
                await useCommunStore.getPublishPost(cascaderValue.value, post.imagesList, post.content, title, post.coverList)
            });
        }
        setTimeout(() => {
          message.success('发布成功')
          handleOk()
          clearAllContent()  
        });
        
        
    } catch (error) {
        message.error('发布失败')
    }

}
const clearAllContent = () => {
    if (defaultType.value.value === 'dynamic') {
        useYuanCommunityStore.dynamicContent = {
            content: '',
            imagesList: []
        }
    } else if (defaultType.value.value === 'post') {
        useYuanCommunityStore.postContent = {
            content: '',
            imagesList: [],
            title: '',
            coverList: []
        }
    }
}

// antd图片预览
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')
const handleCancel = () => {
    previewVisible.value = false
    previewTitle.value = ''
};
function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

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
    // margin-left: 35%;
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
}
</style>
