
<template>
    <a-modal v-model:visible="props.showPublishModal" title="写动态" class="publish" @ok="handleOk"> 
        <div class="flex items-center justify-center w-full rounded-lg font-14 xt-text-2 xt-bg-2 h-[45px] -mt-3 mb-2">
            分享你的动态，如需更多发布类型（视频，文章等）请前往<a href="#">元社区</a>
        </div>
        <div class="w-full mt-2 xt-bg box ">
            <div>
                <div class="mt-3 mb-2 xt-bg-2 reply-textarea">
                    <a-textarea v-model:value="replyValue" placeholder="输入" :autoSize="{ minRows: 3, maxRows: 8 }"
                        :bordered="false" />
                    <a-upload v-model:file-list="fileList" action="" list-type="picture-card" @preview="handlePreview"
                        class="ml-2 ">
                        <div v-if="fileList.length < 6">
                            <plus-outlined style="font-size: 20px;" />
                        </div>
                    </a-upload>
                    <a-modal v-model:visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                        <img style="width: 100%" :src="previewImage" />
                    </a-modal>
                </div>
                <div class="h-[56px] flex items-center justify-between">
                    <div class="flex items-center xt-text-2">
                        <a-button type="text" :icon="h(SmileOutlined)" size="small" class="ml-2 xt-text"
                            style="color: var(--secondary-text) !important;">表情</a-button>
                        <a-button type="text" :icon="h(PictureOutlined)" size="small" class="xt-text"
                            style="color: var(--secondary-text) !important;">图片</a-button>
                    </div>

                </div>
            </div>
        </div>
        <div class="flex items-center justify-between h-[56px]">
            <a-button type="text" class=" xt-text xt-bg-2 font-14"
                style="border-radius:10px ; color: var(--secondary-text) !important;">想天工作台/桌面分享 ></a-button>
            <div class="flex items-center">
                <a-button type="text" class=" xt-text xt-bg-2"
                    style="border-radius:10px ; color: var(--secondary-text) !important;">取消</a-button>
                <a-button type="primary" class=" xt-text"
                    style="border-radius:10px ; color: var(--secondary-text) !important;">发布</a-button>
            </div>
        </div>
    </a-modal>
</template>
<script setup lang='ts'>
import { ref, reactive, h } from 'vue'
import { CloseOutlined, SmileOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue';
// const userName = ref('我是皮克斯呀')
const replyValue = ref('')
const props = defineProps({
    replyVisible: Boolean,
    showPublishModal: Boolean,
})
const visible=ref(false)
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

const fileList = ref<UploadProps['fileList']>([
    {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-3',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
]);

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
const handleOk = (e: MouseEvent) => {
    console.log(e);
};

</script>
<style lang='scss' scoped>
.box {
    border-radius: 12px;
}

.font-16 {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    text-align: center;
    font-weight: 400;
}

.font-14 {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
    width: 64px;
    height: 64px;
}

:deep(.ant-upload-list-picture-card-container) {
    width: 64px;
    height: 64px;
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item-thumbnail) {
    font-size: 8px;
}
.publish{
    :deep(.ant-modal-title) {
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: 400;
    color: var(--primary-text) !important;
    }
    :deep(.lg .ant-modal-body svg) {
    font-size: 1rem !important;
    }
}




:deep(.lg .ant-modal-body .ant-btn) {
    margin-right: 5px !important;
}

:deep(.ant-modal-footer) {
    display: none !important;
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