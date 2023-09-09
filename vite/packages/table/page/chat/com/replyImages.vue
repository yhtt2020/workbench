<template>
    <div class="w-full mt-2 xt-bg box">
        <div class="p-3">
            <div class="flex justify-between xt-text h-[64px] items-center ">
                <span class="text-center font-16 xt-text">回复 {{ userName }}</span>
                <a-button type="text" :icon="h(CloseOutlined)" class="xt-text " style="border-radius: 8px;"></a-button>
            </div>
            <div class="mt-2 mb-2 ml-3 mr-3 xt-bg-2 reply-textarea">
                <a-textarea v-model:value="replyValue" placeholder="回复" :autoSize="{ minRows: 3, maxRows: 8 }"
                    :bordered="false" />
                <a-upload v-model:file-list="fileList" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    list-type="picture-card" @preview="handlePreview" class="ml-2 ">
                    <div v-if="fileList.length < 6">
                        <plus-outlined style="font-size: 20px;" />
                    </div>
                </a-upload>
            </div>
            <div class="h-[56px] flex items-center justify-between">
                <div class="flex items-center xt-text-2">
                    <a-button type="text" :icon="h(SmileOutlined)" size="small" class="ml-2 xt-text"
                        style="color: var(--secondary-text) !important;">表情</a-button>
                    <a-button type="text" :icon="h(PictureOutlined)" size="small" class="xt-text"
                        style="color: var(--secondary-text) !important;">图片</a-button>
                </div>
                <div class="flex">
                    <a-button type="text" class=" xt-text xt-bg-2"
                        style="border-radius:10px ; color: var(--secondary-text) !important;">取消</a-button>
                    <a-button type="primary" class="ml-2 mr-2 xt-text"
                        style="border-radius:10px ; color: var(--secondary-text) !important;">回复</a-button>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, h } from 'vue'
import { CloseOutlined, SmileOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue';
const userName = ref('我是皮克斯呀')
const replyValue = ref('')
const props = defineProps({
    replyVisible: Boolean
})
function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const fileList = reactive([
    
    {
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
])
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
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
.box {
    border-radius: 8px 8px 0px 0px;
}

.font-16 {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    text-align: center;
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