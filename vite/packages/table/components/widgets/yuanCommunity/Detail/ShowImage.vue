<template>
    <div style=" " v-if="imageLoadVisible">
        <a-upload v-model:file-list="fileList" action="" class="ml-1 text-base " list-type="picture-card" multiple
            @preview="handlePreview">
            <div v-if="fileList.length < 6">
                <div class="flex items-center justify-center">
                    <xt-new-icon :icon="'fluent:add-16-filled'"></xt-new-icon>
                </div>
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
                    <vue-custom-scrollbar :settings="settingsScroller" class="w-full h-[150px] xt-bg-2 rounded-lg flex  "
                        style="flex-wrap: wrap;">
                        <div v-for="(item, index) in folderPath" class="mb-2 ml-1 mr-1  pointer w-[32px] h-[32px]"
                            @click="addEmoji(item)" :key="index" style="cursor: pointer;">
                            <img :src="item" class="w-[32px] h-[32px]">
                        </div>
                    </vue-custom-scrollbar>
                </template>
                <xt-button type="text" class=" xt-text emojiVis" :w="72" :h="32" :throttleTime="0"
                    :icon="'fluent:emoji-smile-slight-24-regular'">表情
                </xt-button>
            </tippy>
            <a-upload v-model:file-list="fileList" @preview="handlePreview" multiple>
                <xt-button type="text" :w="72" :h="32" :icon="'fluent:image-multiple-16-regular'">图片</xt-button>
            </a-upload>
            <div v-if="defaultType === 'post'">
                <a-upload v-model:file-list="coverList" @preview="handlePreview" maxCount="1"
                    v-show="coverList.length === 0">
                    <xt-button type="text" :w="118" :h="32" :icon="'fluent:image-sparkle-16-regular'">设置封面
                    </xt-button>
                </a-upload>
                <xt-button type="text" :w="118" :h="32" v-show="coverList.length > 0" @click="removeCover"
                    :icon="'akar-icons:trash-can'">移除封面
                </xt-button>
            </div>

        </div>

    </div>
    <div style="font-size: 16px !important;" v-if="coverList.length > 0">
        <a-image :width="200" :src="coverList[0]?.originFileObj.path" />
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, toRefs, computed, onMounted,watch } from 'vue'
import {storeToRefs} from 'pinia'
import fluentEmojis from '../../../../js/chat/fulentEmojis'
import { yuanCommunityStore } from '../../../../store/yuanCommunity'
import { translateImage } from './index'

onMounted(() => {
    // 表情转换
    Object.values(fluentEmojis).forEach((item) => {
        folderPath.push(`${emoji.value}${item}`)
    })
})
const useYuanCommunityStore = yuanCommunityStore()
const {  postContent, dynamicContent } = storeToRefs(useYuanCommunityStore)
const props = defineProps({
    defaultType: {
        type: String,
        default: 'dynamic'
    }
})
const { defaultType } = toRefs(props)
const fileList = ref([])
const coverList = ref([])
const emoji = ref('https://sad.apps.vip/public/static/emoji/emojistatic/')
// 表情保存
let folderPath = reactive([])
// 选中图标
const emojiKey = ref('')
// 添加表情
const addEmoji = (item) => {
    const lastSlashIndex = item.lastIndexOf('/');
    const emojiValue = item.substring(lastSlashIndex + 1);
    emojiKey.value = Object.entries(fluentEmojis).find(([k, v]) => v === (emojiValue))[0]
    addEmojiContent()
}
// 添加图标到内容中
const addEmojiContent = () => {
    if (defaultType.value === 'dynamic') {
        dynamicContent.value.content += `${emojiKey.value}`
    } else if (defaultType.value === 'post') {
        postContent.value.title += `${emojiKey.value}`
    }
}
const removeCover = () => {
    coverList.value = []
    postContent.value.coverList = []
}
// 滚动条设置
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});
const imageLoadVisible = computed(() => {
    return fileList.value?.length > 0
})

// 监听图片
watch(fileList, async () => {
    let imagesList = await translateImage(fileList.value)
    imagesList=imagesList.map((item)=>{
        return `${item}?imageMogr2/crop/340x340/gravity/center`
    })
    if (defaultType.value == 'dynamic') {
        dynamicContent.value.imagesList = JSON.stringify(imagesList)
    } else if (defaultType.value == 'post') {
        postContent.value.imagesList = JSON.stringify(imagesList)
    }
})
watch(coverList, async () => {
    let coversList = await translateImage(coverList.value)
    coversList=coversList.map((item)=>{
        return `${item}?imageMogr2/crop/340x340/gravity/center`
    })
    postContent.value.coverList = coversList.toString()
})

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
</style>