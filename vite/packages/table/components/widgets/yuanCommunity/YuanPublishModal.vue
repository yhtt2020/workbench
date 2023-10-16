
<template>
    <Modal :maskNoClose="true" class="" :animationName="t-b-close">
        <div class="w-[500px] pl-4 pr-4">
            <div class="flex justify-between w-full h-[64px] items-center ">
                <div class="flex justify-center w-full">
                    <div class="font-16 xt-text">写动态</div>
                </div>
                <button class="flex items-center border-0 rounded-md xt-bg-2 w-[40px] h-[40px] justify-center pointer"
                    @click="handleOk">
                    <Icon class="text-xl text-center xt-text pointer" icon="akar-icons:cross" />
                </button>

            </div>
            <div class="flex items-center justify-center w-full rounded-lg font-14 xt-text-2 xt-bg-2 h-[54px]  mb-2">
                分享你的动态，如需更多发布类型（视频，文章等）请前往<a href="" @click.prevent="goYuan">元社区</a>
            </div>
            <div class="w-full mt-2 xt-bg box font-16">
                <div style="font-size: 1rem !important;">
                    <div class="mt-3 mb-2 xt-bg-2 reply-textarea">
                        <a-textarea v-model:value="postValue" placeholder="输入" :autoSize="{ minRows: 3, maxRows: 8 }"
                            :bordered="false"  />
                        <div style="font-size: 16px !important;" v-if="imageLoadVisible">
                            <a-upload v-model:file-list="fileList" action="" class="ml-2 text-base" list-type="picture-card"
                                multiple @preview="handlePreview">
                                <div v-if="fileList.length < 6">
                                    <plus-outlined style="font-size: 1.2em; " class="xt-text" />
                                </div>
                            </a-upload>
                        </div>
                        <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                            <img style="width: 100%" :src="previewImage" />
                        </a-modal>
                    </div>
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
                                <a-button type="text" size="small" class="ml-2 xt-text emojiVis"
                                    style="color: var(--secondary-text) !important;"><template #icon>
                                        <SmileOutlined style="" />
                                    </template> 表情</a-button>
                            </tippy>

                            <a-button type="text" size="small" class="xt-text" @click="imageLoadVisible = !imageLoadVisible"
                                style="color: var(--secondary-text) !important;"><template #icon>
                                    <PictureOutlined style="" />
                                </template> 图片</a-button>
                        </div>

                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between h-[56px] ">
                <!-- <a-button type="text" class=" xt-text xt-bg-2 font-14"
                    style="border-radius:10px ; color: var(--secondary-text) !important;">想天工作台/桌面分享 ></a-button> -->
                <a-select v-model:value="cascaderValue" :options="options" :placeholder="holderName" :loadData="loadData" :bordered="false" @change="handleChange"
                    style=" font-size: 14px; border-radius: 10px;" change-on-select>
                    <template #suffixIcon>
                        <Icon icon="fluent:chevron-left-16-filled" class="text-base rotate-180"></Icon>
                    </template>
                </a-select>
                <div class="flex items-center">
                    <xt-button type="text" class=" xt-text xt-bg-2"
                        style="border-radius:10px ; color: var(--secondary-text) !important;width: 68px; height: 32px;"
                        @click="handleOk">取消</xt-button>
                    <xt-button type="primary" class="ml-2"
                        style="border-radius:10px ; color: var(--secondary-text) !important; width: 68px; height: 32px;background-color: var(--active-bg);"
                        @click="publishPost">发布</xt-button>
                </div>
            </div>
        </div>

    </Modal>
</template>
<script setup lang='ts'>
import { ref, reactive, onMounted, computed } from 'vue'
import { SmileOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue';
import browser from '../../../js/common/browser';
import Modal from '../../../components/Modal.vue'
import { Icon } from '@iconify/vue';
import { fileUpload } from '../../../components/card/hooks/imageProcessing'
import type { CascaderProps } from 'ant-design-vue';
import { message } from 'ant-design-vue'
import fluentEmojis from '../../../js/chat/fulentEmojis'
import { yuanCommunityStore } from '../../../store/yuanCommunity'
import {useCommunityStore} from '../../../page/chat/commun'
const useCommunStore = useCommunityStore()
const useYuanCommunityStore = yuanCommunityStore()
const imageLoadVisible = ref(true)
const browserUrl=ref('https://s.apps.vip/forum?id=')
const emoji=ref('https://sad.apps.vip/public/static/emoji/emojistatic/')
const goYuan = () => {
    browser.openInUserSelect(`${browserUrl.value}${props.forumId}`)
}
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
const holderName=computed(() => {
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
            await useCommunStore.getCommunityPublishPost(forumId, imageList, content, title.value,cascaderValue)
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
.box {
    border-radius: 12px;
}

.font-16 {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    // text-align: center;
    font-weight: 400;
}

.font-14 {
    font-family: PingFangSC-Regular;
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
:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder){
    color: var(--secondary-text);
}
:deep(.ant-select-arrow){
    color: var(--secondary-text);
    font-size: 16px;
}
:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-item, .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder) {
    // &::placeholder {
    font-weight: 400;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: var(--secondary-text);
    // }
}
:deep( .ant-select-open){
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;
}
:deep( .ant-select-focused){
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;
}
:deep( .ant-select-focused .ant-select-open){
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;
}
:deep(.ant-input) {
    color: var(--secondary-text);
    &::placeholder {
        font-weight: 400;
        font-size: 16px;
        font-family: PingFangSC-Regular;
        color: var(--secondary-text);
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