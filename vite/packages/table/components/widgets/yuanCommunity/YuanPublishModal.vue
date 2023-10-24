
<template>
    <Modal :maskNoClose="true" class="" animationName="t-b-close">
        <div class="w-[500px] pl-4 pr-4 content">
            <div class="flex justify-between w-full h-[64px] items-center ">
                <a-dropdown trigger="click" placement="bottom"
                    overlayStyle="background-color: var(--primary-bg); padding-left:3px ;padding-right:3px; width: 100px;">
                    <div class="flex items-center justify-center w-full">
                        <div class="ml-20 font-16 xt-text">{{ defaultType.title }}</div>
                        <newIcon icon="fluent:caret-down-12-filled" class="ml-1 xt-text" style="font-size: 20px;" />
                    </div>
                    <template #overlay>
                        <a-menu class="text-center xt-bg"
                            style="display: flex;justify-content: center;flex-direction: column;align-items: center;">
                            <a-menu-item v-for="(item, index) in publishType" :key="index"
                                @click="handleMenuItemClick(index)">
                                <span class="ml-12 text-center xt-text">{{ item.title }}</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>

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
            <div class="w-full mb-2 rounded-md xt-bg-2 h-[200px]" style="border: 1px solid var(--divider);"
                v-if="defaultType.value == 'video'">
                <a-upload-dragger v-model:fileList="videoList" name="file" :multiple="true" @change="handleChange"
                    @drop="handleDrop">
                    <div class="flex flex-col items-center justify-center w-full h-full">
                        <newIcon icon="fluent:add-16-filled" class="mb-3 xt-text" style="font-size: 20px;"></newIcon>
                        <p class="text-sm ant-upload-text">推荐视频比例：16：9，建议最大不超过<span class="ml-1 mr-1">500</span>MB</p>
                    </div>
                </a-upload-dragger>
            </div>
            <div class="w-full rounded-md xt-bg-2" style="border: 1px solid var(--divider);"
                v-if="defaultType.value !== 'dynamic'">
                <a-input v-model:value="titleContent" placeholder="标题" :bordered="false" />
            </div>
            <div class="w-full mt-2 xt-bg box font-16">
                <div style="font-size: 1rem !important;">
                    <div class="mt-3 mb-2 xt-bg-2 reply-textarea " style="border: 1px solid var(--divider);">
                        <a-textarea v-model:value="postValue" :placeholder="defaultType.value === 'video' ? '简介' : '请输入'"
                            :autoSize="{ minRows: 5, maxRows: 8 }" :bordered="false" v-if="defaultType.value !== 'post'" />
                        <div class="w-full h-[300px]" v-else-if="defaultType.value == 'post'">
                                <MarkDown></MarkDown>
                        </div>
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
            <div class="h-[45px] flex items-center justify-between mt-10">
                <div class="flex items-center justify-center xt-text-2">
                    <tippy trigger=" click" placement="bottom" :interactive="true">
                        <template #content>
                            <!-- <div class="w-full"> -->
                            <vue-custom-scrollbar :settings="settingsScroller"
                                class="w-full h-[150px] xt-bg-2 rounded-lg flex  " style="flex-wrap: wrap;">
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
                        <a-button type="text" size="small" class="xt-text" v-if="defaultType.value !== 'video'"
                            style="color: var(--secondary-text) !important;"><template #icon>
                                <newIcon icon="fluent:image-multiple-16-regular" class="text-xl xt-text-2"
                                    style="vertical-align: sub;margin-right: 4px;" />
                            </template> 图片</a-button>
                    </a-upload>
                    <div v-if="defaultType.value == 'post'">
                        <a-upload v-model:file-list="coverList" @preview="handlePreview" maxCount="1"
                            v-show="coverList.length === 0">
                            <a-button type="text" size="small" class="xt-text"
                                style="color: var(--secondary-text) !important;"><template #icon>
                                    <newIcon icon="fluent:image-sparkle-16-regular" class="text-xl xt-text-2"
                                        style="vertical-align: sub;margin-right: 4px;" />
                                </template> 设置封面</a-button>


                        </a-upload>
                        <a-button type="text" size="small" class="xt-text" v-show="coverList.length > 0"
                            @click="removeCover" style="color: var(--secondary-text) !important;"><template #icon>
                                <newIcon icon="akar-icons:trash-can" class="text-xl xt-text-2"
                                    style="vertical-align: sub;margin-right: 4px;" />
                            </template> 移除封面</a-button>
                    </div>

                </div>

            </div>
            <div style="font-size: 16px !important;" v-if="coverList.length > 0">
                <a-upload v-model:file-list="coverList" action="" class="ml-2 text-base" list-type="picture-card"
                    @preview="handlePreview">
                </a-upload>
                <!-- <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                    <img style="width: 100%" :src="previewImage" />
                </a-modal> -->
            </div>
            <div class="flex items-center justify-between h-[56px] ">
                <!-- <a-button type="text" class=" xt-text xt-bg-2 font-14"
                    style="border-radius:10px ; color: var(--secondary-text) !important;">想天工作台/桌面分享 ></a-button> -->
                <a-select v-model:value="cascaderValue" :options="options" :placeholder="holderName" :bordered="false"
                    @change="handleChange"
                    style=" font-size: 16px; border-radius: 10px;width: 120px;background: var(--secondary-bg);height: 40px;"
                    change-on-select>
                    <template #suffixIcon>
                        <newIcon icon="fluent:chevron-left-16-filled" class="rotate-180 xt-text-2" style="font-size: 20px;vertical-align: super;margin-top: -3px;"></newIcon>
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
        </div>

    </Modal>
</template>
<script setup lang='ts'>
import { ref, reactive, onMounted, computed } from 'vue'
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
import MarkDown from './Detail/MarkDown.vue';
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
:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-item){
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
