<template>
    <!-- 视频 -->
    <div class="w-full mb-2 rounded-md xt-bg-2 h-[200px]" style="border: 1px solid var(--divider);">
        <a-upload-dragger v-model:fileList="videoList" name="file" :multiple="true" @change="handleChange"
            @drop="handleDrop">
            <div class="flex flex-col items-center justify-center w-full h-full">
                <newIcon icon="fluent:add-16-filled" class="mb-3 xt-text" style="font-size: 20px;"></newIcon>
                <p class="text-sm ant-upload-text">推荐视频比例：16：9，建议最大不超过<span class="ml-1 mr-1">500</span>MB</p>
            </div>
        </a-upload-dragger>
    </div>
    <!-- 视频和帖子 -->
    <div class="w-full rounded-md xt-bg-2" style="border: 1px solid var(--divider);">
        <a-input v-model:value="titleContent" placeholder="标题" :bordered="false" />
    </div>
    <div class="w-full mt-2 xt-bg box font-16">
        <div style="font-size: 1rem !important;">
            <div class="mt-3 mb-2 xt-bg-2 reply-textarea " style="border: 1px solid var(--divider);">
                <!-- 动态和视频 -->
                <a-textarea v-model:value="postValue" placeholder="简介" :autoSize="{ minRows: 5, maxRows: 8 }"
                    :bordered="false"  />
            </div>

        </div>
    </div>
    <div class="h-[45px] flex items-center justify-between ">
        <div class="flex items-center justify-center xt-text-2">
            <tippy trigger=" click" placement="bottom" :interactive="true">
                <template #content>
                    <!-- <div class="w-full"> -->
                    <vue-custom-scrollbar :settings="settingsScroller" class="w-full h-[150px] xt-bg-2 rounded-lg flex  "
                        style="flex-wrap: wrap;">
                        <div v-for="(item, index) in folderPath" class="mb-2 ml-1 mr-1  pointer w-[32px] h-[32px]"
                            @click="addEmoji(item)" :key="index" style="cursor: pointer;">
                            <img :src="item" class="w-[32px] h-[32px]">
                        </div>
                    </vue-custom-scrollbar>
                    <!-- </div> -->
                </template>

                <a-button type="text" size="small" class=" xt-text emojiVis"
                    style="color: var(--secondary-text) !important;"><template #icon>
                        <!-- <SmileOutlined style="" /> -->
                        <newIcon icon="fluent:emoji-smile-slight-24-regular" class="text-xl xt-text-2"
                            style="vertical-align: sub;margin-right: 4px;" />
                    </template> 表情</a-button>
            </tippy>

        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, computed } from 'vue'
import type { UploadProps } from 'ant-design-vue';
import browser from '../../../../js/common/browser';
import Modal from '../../../../components/Modal.vue'
import { Icon as newIcon } from '@iconify/vue';
import { fileUpload } from '../../../../components/card/hooks/imageProcessing'
import type { CascaderProps } from 'ant-design-vue';
import { message } from 'ant-design-vue'
import fluentEmojis from '../../../../js/chat/fulentEmojis'
import { yuanCommunityStore } from '../../../../store/yuanCommunity'
import { useCommunityStore } from '../../../../page/chat/commun'
import MarkDown from './MarkDown.vue';
const useCommunStore = useCommunityStore()
const useYuanCommunityStore = yuanCommunityStore()
// const imageLoadVisible = ref(true)
const browserUrl = ref('https://s.apps.vip/forum?id=')
const emoji = ref('https://sad.apps.vip/public/static/emoji/emojistatic/')
const goYuan = () => {
    browser.openInUserSelect(`${browserUrl.value}${props.forumId}`)
}
const titleContent = ref('')
const publishType = ref([
    {
        title: '发动态',
        value: 'dynamic'
    },
    {
        title: '发帖子',
        value: 'post'
    },
    {
        title: '发视频',
        value: 'video'
    }
])
const removeCover = () => {
    coverList.value = []
}
let defaultType = ref({ 'title': '发动态', 'value': 'dynamic' })
const handleMenuItemClick = (index) => {
    defaultType.value = publishType.value[index]
}
// 视频文件
const videoList = ref([])
// 封面文件
const coverList = ref([])
// 是否全屏
const fullScreen = ref(false)
const handleFullScreen = () => {
    //   const full = document.querySelector('.content');
    fullScreen.value = !fullScreen.value;
};
// const userName = ref('我是皮克斯呀')
const postValue = ref('')
const props = defineProps({
    replyVisible: Boolean,
    showPublishModal: Boolean,
    forumId: Number,
    forumIndex: Number
})
// 添加表情
const addEmoji = (item) => {
    const lastSlashIndex = item.lastIndexOf('/');
    const emoiiValue = item.substring(lastSlashIndex + 1);
    // console.log(emoiiValue);

    const key = Object.entries(fluentEmojis).find(([k, v]) => v === (emoiiValue))[0]
    postValue.value += `${key}`

}
const imageLoadVisible = computed(() => {
    return fileList.value?.length > 0
})
const visible = ref(false)
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

// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
let folderPath = reactive([])

onMounted(() => {
    Object.values(fluentEmojis).forEach((item) => {
        folderPath.push(`${emoji.value}${item}`)
    })
    let textareaElement = window.document.querySelector('textarea')
    // console.log(textareaElement);

    textareaElement?.focus()
    // console.log(navigator.plugins);
    useYuanCommunityStore.getMyForumList()


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
const loadData: CascaderProps['loadData'] = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    arr.value.forEach((item) => {
        targetOption.children?.push(item)
    })
    options.value = [...options.value];
};
const handleChange = (value) => {
    cascaderValue.value = value
    console.log(cascaderValue.value);
}
const holderName = computed(() => {
    return useYuanCommunityStore.myForumList.joined[props.forumIndex].name
})
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});
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
// 发布帖子
const titleValue = ref('')
const publishPost = async () => {
    if (postValue.value || fileList.value.length > 0) {
        const imageUrlList = await Promise.all(fileList.value.map(async (item) => {
            const url = await fileUpload(item.originFileObj);
            return url;
        }));
        // let image = JSON.stringify(imageUrlList.value)
        let forumId = props.forumId
        let content = postValue.value
        let title = computed(() => {
            if (!titleValue.value || titleValue.value.length < 5) {
                return postValue.value.slice(0, 5)
            }
            return titleValue.value
        })
        // console.log(title.value, 'title.value');


        setTimeout(async () => {
            // console.log(forumId, content, title.value, image, 'titleValue.value');
            const imageList = JSON.stringify(imageUrlList);
            await useCommunStore.getCommunityPublishPost(forumId, imageList, content, title.value, cascaderValue)
            message.success('发布成功')
            titleValue.value = ''
            postValue.value = ''
            fileList.value = []
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

.font-14 {

    font-size: 14px;
    line-height: 20px;
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