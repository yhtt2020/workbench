<template>
    <div class="w-full mt-2 xt-bg box font-16">
        <div style="font-size: 1rem !important;">
            <div class="mt-3 mb-2 xt-bg-2 reply-textarea " style="border: 1px solid var(--divider);">
                <!-- 动态和视频 -->
                <a-textarea v-model:value="postValue" placeholder=" 请输入"
                    :autoSize="{ minRows: 5, maxRows: 8 }" :bordered="false"  />
                <!-- 动态和帖子 -->
                <div style="font-size: 16px !important;" v-if="imageLoadVisible">
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
            <a-upload v-model:file-list="fileList" @preview="handlePreview" multiple>
                <a-button type="text" size="small" class="xt-text"
                    style="color: var(--secondary-text) !important;"><template #icon>
                        <newIcon icon="fluent:image-multiple-16-regular" class="text-xl xt-text-2"
                            style="vertical-align: sub;margin-right: 4px;" />
                    </template> 图片</a-button>
            </a-upload>

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
const useCommunStore = useCommunityStore()
const useYuanCommunityStore = yuanCommunityStore()
const emoji = ref('https://sad.apps.vip/public/static/emoji/emojistatic/')
const removeCover = () => {
    coverList.value = []
}
const handleMenuItemClick = (index) => {
    defaultType.value = publishType.value[index]
}
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
function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
let folderPath = reactive([])

onMounted(() => {
    Object.values(fluentEmojis).forEach((item) => {
        folderPath.push(`${emoji.value}${item}`)
    })
    let textareaElement = window.document.querySelector('textarea')
    // console.log(textareaElement);

    textareaElement?.focus()
    // console.log(navigator.plugins);
    // useYuanCommunityStore.getMyForumList()


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