
<template>
    <Modal :maskNoClose="true" class="">
        <div class="w-full pl-4 pr-4"
            :style="{ height: fullScreen ? `${windowHeight}px` : 'auto', width: fullScreen ? `${windoWidth}px` : '500px' }">
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
                    <xt-button class="flex items-center justify-center border-0 rounded-md xt-bg-2 pointer"
                        @click="handleFullScreen" style="width: 40px;height: 40px; flex-shrink: 0;">
                        <newIcon icon="fluent:full-screen-maximize-16-filled" v-if="!fullScreen"
                            class="mt-1 text-xl text-center xt-text pointer"></newIcon>
                        <newIcon icon="fluent:full-screen-minimize-16-filled" v-else
                            class="mt-1 text-xl text-center xt-text pointer"></newIcon>
                    </xt-button>
                    <xt-button class="flex items-center justify-center ml-2 border-0 rounded-md xt-bg-2 pointer"
                        @click="handleOk" style="width: 40px;height: 40px;flex-shrink: 0;">
                        <newIcon class="mt-1 text-xl text-center xt-text pointer" icon="akar-icons:cross" />
                    </xt-button>
                </div>


            </div>
            <vue-custom-scrollbar ref="threadListRef" :settings="outerSettings"
                style="height: calc(100% - 80px) ;overflow: hidden;flex-shrink: 0;max-width: 1000px;margin: 0 auto;">
                <!-- <div class="" style="max-width: 1000px !important;"> -->
                <div class="w-full mb-2 rounded-md xt-bg-2 h-[200px] " style="border: 1px solid var(--divider);"
                    v-if="defaultType.value == 'video'">
                    <a-upload-dragger v-model:fileList="videoList" name="file" :multiple="true" @change="handleChange"
                        @drop="handleDrop">
                        <div class="flex flex-col items-center justify-center w-full h-full">
                            <newIcon icon="fluent:add-16-filled" class="mb-3 xt-text" style="font-size: 20px;">
                            </newIcon>
                            <p class="text-sm ant-upload-text">推荐视频比例：16：9，建议最大不超过<span class="ml-1 mr-1">500</span>MB
                            </p>
                        </div>
                    </a-upload-dragger>
                </div>
                <div class="w-full rounded-md xt-bg-2" style="border: 1px solid var(--divider);"
                    v-if="defaultType.value !== 'dynamic'">
                    <a-input v-model:value="titleValue" placeholder="标题" :bordered="false" />
                </div>
                <div class="w-full mt-2 text-base h-3/4 xt-bg box ">
                    <div style="font-size: 1rem !important;" class="w-full h-full">
                        <div class="w-full h-full mt-3 mb-2 xt-bg-2 reply-textarea"
                            style="border: 1px solid var(--divider);">
                            <a-textarea v-model:value="postValue"
                                :placeholder="defaultType.value === 'video' ? '简介' : '请输入'" :autoSize="dynamicSize"
                                :bordered="false" v-if="defaultType.value !== 'post'" />
                            <div class="w-full " :style="{ height: fullScreen ? '100%' : '300px' }"
                                v-else-if="defaultType.value == 'post'" style="overflow: hidden;">
                                <markdown></markdown>
                            </div>

                        </div>

                    </div>

                </div>
                <div style="font-size: 16px !important; " v-if="imageLoadVisible">
                    <a-upload v-model:file-list="fileList" action="" class="ml-2 text-base" list-type="picture-card"
                        multiple @preview="handlePreview">
                        <div v-if="fileList.length < 6">
                            <!-- <plus-outlined style="font-size: 1.2em; " class="xt-text" /> -->
                            <newIcon icon="fluent:add-16-filled" style="font-size: 24px;vertical-align: sub;"
                                class="xt-text"></newIcon>
                        </div>
                    </a-upload>
                </div>
                <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                    <img style="width: 100%" :src="previewImage" />
                </a-modal>
                <div class="h-[45px] flex items-center justify-between">
                    <div class="flex items-center justify-center xt-text-2">
                        <tippy trigger=" click" placement="bottom" :interactive="true">
                            <template #content>
                                <!-- <div class="w-full"> -->
                                <vue-custom-scrollbar :settings="settingsScroller"
                                    class="w-full h-[150px] xt-bg-2 rounded-lg flex  " style="flex-wrap: wrap;">
                                    <div v-for="(item, index) in folderPath"
                                        class="mb-2 ml-1 mr-1  pointer w-[32px] h-[32px]" @click="addEmoji(item)"
                                        :key="index" style="cursor: pointer;">
                                        <img :src="item" class="w-[32px] h-[32px]">
                                    </div>
                                </vue-custom-scrollbar>
                                <!-- </div> -->
                            </template>

                            <xt-button type="text" class=" xt-text emojiVis" :w="72" :h="32"
                                style="color: var(--secondary-text) !important;">
                                <!-- <SmileOutlined style="" /> -->
                                <newIcon icon="fluent:emoji-smile-slight-24-regular" class="text-xl xt-text-2"
                                    style="vertical-align: sub;margin-right: 4px;" />
                                表情
                            </xt-button>
                        </tippy>
                        <a-upload v-model:file-list="fileList" @preview="handlePreview" multiple>
                            <xt-button type="text" :w="72" :h="32" class="xt-text" v-if="defaultType.value !== 'video'"
                                style="color: var(--secondary-text) !important;">
                                <newIcon icon="fluent:image-multiple-16-regular" class="text-xl xt-text-2"
                                    style="vertical-align: sub;margin-right: 4px;" />
                                图片
                            </xt-button>
                        </a-upload>
                        <div v-if="defaultType.value == 'post'">
                            <a-upload v-model:file-list="coverList" @preview="handlePreview" maxCount="1"
                                v-show="coverList.length === 0">
                                <xt-button type="text" :w="118" :h="32" class="xt-text"
                                    style="color: var(--secondary-text) !important;">
                                    <newIcon icon="fluent:image-sparkle-16-regular" class="text-xl xt-text-2"
                                        style="vertical-align: sub;margin-right: 4px;" />
                                    设置封面
                                </xt-button>
                            </a-upload>
                            <xt-button type="text" :w="118" :h="32" class="xt-text" v-show="coverList.length > 0"
                                @click="removeCover" style="color: var(--secondary-text) !important;">
                                <newIcon icon="akar-icons:trash-can" class="text-xl xt-text-2"
                                    style="vertical-align: sub;margin-right: 4px;" />
                                移除封面
                            </xt-button>
                        </div>

                    </div>

                </div>
                <div style="font-size: 16px !important;" v-if="coverList.length > 0">
                    <!-- <a-upload v-model:file-list="coverList" action="" class="ml-2 text-base" list-type="picture-card"
                        @preview="handlePreview">
                    </a-upload> -->
                    <a-image :width="200"  :src="coverList[0]?.originFileObj.path" />
                </div>
                <div class="flex items-center justify-between h-[56px] ">
                    <!-- <a-button type="text" class=" xt-text xt-bg-2 font-14"
                    style="border-radius:10px ; color: var(--secondary-text) !important;">想天工作台/桌面分享 ></a-button> -->
                    <a-select v-model:value="cascaderValue" :options="options" placeholder="选择板块" :bordered="false"
                        @change="handleChange"
                        style=" font-size: 16px; border-radius: 10px;width: 120px;height: 40px;color: var(--primary-text);"
                        dropdownMenuStyle="{background: 'var(--primary-bg)'}" change-on-select>

                        <template #suffixIcon>
                            <newIcon icon="fluent:chevron-left-16-filled" class="text-base rotate-180 "
                                style="margin-top: -1px;"></newIcon>
                        </template>
                    </a-select>
                    <div class="flex items-center">
                        <xt-button type="text" class=" xt-text xt-bg-2"
                            style="border-radius:10px ; color: var(--secondary-text) !important;width: 64px; height: 40px;"
                            @click="handleOk">取消</xt-button>
                        <xt-button type="primary" class="ml-2"
                            style="border-radius:10px ; color: var(--secondary-text) !important; width: 64px; height: 40px;background-color: var(--active-bg);"
                            @click="publishPost">发布</xt-button>
                    </div>
                </div>
                <!-- </div> -->

            </vue-custom-scrollbar>
        </div>

    </Modal>
</template>
<script setup lang='ts'>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { UploadProps } from 'ant-design-vue';
import browser from '../../../js/common/browser';
import Modal from '../../../components/Modal.vue'
import { Icon as newIcon } from '@iconify/vue';
import { fileUpload } from '../../../components/card/hooks/imageProcessing'
import type { CascaderProps } from 'ant-design-vue';
import { message } from 'ant-design-vue'
import fluentEmojis from '../../../js/chat/fulentEmojis'
import { yuanCommunityStore } from '../../../store/yuanCommunity'
import { useCommunityStore } from '../../../page/chat/commun'
import markdown from './Detail/MarkDown.vue';
import _ from 'lodash-es'
const useCommunStore = useCommunityStore()
const useYuanCommunityStore = yuanCommunityStore()
const emoji = ref('https://sad.apps.vip/public/static/emoji/emojistatic/')
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
// 清除封面
const removeCover = () => {
    coverList.value = []
}
// 默认选项
let defaultType = ref({ 'title': '发动态', 'value': 'dynamic' })
// 修改发布框
const changeItem = (index) => {
    defaultType.value = publishType.value[index]

}
const outerSettings = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
})
// 视频文件
const videoList = ref([])
// 封面文件
const coverList = ref([])
// 是否全屏
const fullScreen = ref(false)
// 全屏状态修改
const handleFullScreen = () => {

    fullScreen.value = !fullScreen.value
}
const dynamicSize = computed(() => {
    if (fullScreen.value) {
        return { minRows: 20, maxRows: 30 }
    } else {
        return { minRows: 5, maxRows: 8 }
    }
})
// const userName = ref('我是皮克斯呀')
// 正文内容
const postValue = ref('')
// 
const props = defineProps({
    replyVisible: Boolean,
    showPublishModal: Boolean,
    forumId: Number,
    forum: Array
})
// 添加表情
const addEmoji = (item) => {
    const lastSlashIndex = item.lastIndexOf('/');
    const emoiiValue = item.substring(lastSlashIndex + 1);
    // console.log(emoiiValue);

    const key = Object.entries(fluentEmojis).find(([k, v]) => v === (emoiiValue))[0]
    postValue.value += `${key}`

}
// 图片添加是否可见
const imageLoadVisible = computed(() => {
    return fileList.value?.length > 0
})
// 关闭发布框的状态判断
const visible = ref(false)
// 图片转base64
function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const emit = defineEmits(['handleOk'])
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
// 发布帖子
const titleValue = ref('')
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
// 表情保存
let folderPath = reactive([])
let windoWidth = ref()
let windowHeight = ref()
onMounted(() => {
    // 表情转换
    Object.values(fluentEmojis).forEach((item) => {
        folderPath.push(`${emoji.value}${item}`)
    })
    // 聚焦第一个文本框
    // let inputElement = window.document.querySelector('input')
    let textareaElement = window.document.querySelector('textarea')
    // console.log(textareaElement);
    // if(inputElement){
    //     inputElement?.focus()
    // }else{
    textareaElement?.focus()
    windoWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    // }
    // 获取编辑文本
    if (defaultType.value.value == 'dynamic' && useYuanCommunityStore.saveDynamic) {
        postValue.value = useYuanCommunityStore.saveDynamic
    } else {
        postValue.value = ''
    }
    // 获取标题
    if (defaultType.value.value == 'post' && useYuanCommunityStore.saveTitle) {
        titleValue.value = useYuanCommunityStore.saveTitle
    } else {
        titleValue.value = ''

    }
    // console.log(postValue.value,'postValue.value');

    // console.log(navigator.plugins);
    useYuanCommunityStore.getMyForumList()

    // console.log(useYuanCommunityStore.saveContent, 'useYuanCommunityStore.saveContent');
})

// 选择发帖板块
const communCate = computed(() => useYuanCommunityStore.myForumList.joined)
let arr = ref([])
communCate.value.forEach((item) => {
    arr.value.push({
        value: item.id,
        label: item.name
    })
})
let cascaderValue = ref([])
const options = ref<CascaderProps['options']>([]);
arr.value.forEach((item) => {
    options.value.push(item)
})
// 修改发帖板块
const handleChange = (value) => {
    // console.log(value, 'value');
    cascaderValue.value = value
    // console.log(cascaderValue.value,'cascaderValue.value');
    // console.log(arr.value);

}
// 暂存动态文本
const savaDynamic = () => {
    useYuanCommunityStore.saveDynamic = postValue.value
}
// 监听文本
watch(postValue, _.debounce(savaDynamic, 500))
// const holder = computed(() => {
//     return props.forum.name
// })
const saveTitleText = () => {
    useYuanCommunityStore.saveTitle = titleValue.value
}
watch(titleValue, _.debounce(saveTitleText, 500))
// 滚动条设置
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});
// 图片暂存
const fileList = ref<UploadProps['fileList']>([]);

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};
const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const handleOk = () => {
    // console.log(e);
    visible.value = false
    emit('handleOk', visible)
};

const publishPost = async () => {
    if (postValue.value || fileList.value.length > 0 || useYuanCommunityStore.saveContent) {
        const imageUrlList = await Promise.all(fileList.value.map(async (item) => {
            const url = await fileUpload(item.originFileObj);
            return url;
        }));
        let coverImage
        if (coverList.value.length > 0) {
            const coverUrlList = await Promise.all(coverList.value.map(async (item) => {
            const url = await fileUpload(item.originFileObj);
            return url;
        }));
            coverImage = await JSON.stringify(coverUrlList);

        }
        let forumId = cascaderValue.value
        let content = computed(() => {
            switch (defaultType.value.value) {
                case 'dynamic':
                    return postValue.value
                    break;
                case 'post':
                    return useYuanCommunityStore.saveContent
                    break;

                default:
                    return postValue.value
                    break;
            }
        })
        let title = computed(() => {
            if (!titleValue.value || titleValue.value.length < 5) {
                return postValue.value.slice(0, 5)
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
        setTimeout(() => {
            titleValue.value = ''
            useYuanCommunityStore.saveDynamic = ''
            useYuanCommunityStore.saveContent = ''
            postValue.value = ''
            fileList.value = []
            coverList.value = []   
        },1000);

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

:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-item, .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder) {
    // &::placeholder {
    font-weight: 400;
    font-size: 16px;

    color: var(--secondary-text);
    // }
}

:deep(.ant-select-open) {
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;
}

:deep(.ant-select-focused) {
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;
}

:deep(.ant-select-focused .ant-select-open) {
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;
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
}
</style>
