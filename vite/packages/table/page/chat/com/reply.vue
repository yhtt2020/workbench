<template>
    <div class="flex items-center justify-between w-full">
        <!-- {{ userUid}} -->
        <a-avatar :src="userInfo.avatar" :size="32" class="pointer" @click.stop="showCard(userUid, Info)"></a-avatar>
        <!-- <div class="w-full ml-3 "> -->
        <!-- <a-input v-model:value="value" placeholder="评论" class=" xt-bg comment-input btn" bordered="false"
            style="cursor: default;" @keyup.enter="addComment" /> -->
        <a-textarea @keyup.enter="addComment" v-model:value="value" placeholder="评论" :auto-size="{minRows:1,maxRows:5}" class=" xt-bg comment-input btn" bordered="false"/>
        <!-- </div> -->
    </div>
    <div class="clearfix mt-3 ml-11" v-if="imageVis">
        <a-upload v-model:file-list="fileList" list-type="picture-card" @preview="handlePreview" multiple>
            <div v-if="fileList.length < 3">
                <plus-outlined style="font-size: 20px;color: var(--secondary-text);" />
            </div>
        </a-upload>
        <a-modal v-model:visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
            <img style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
    <div class="flex justify-between w-full mt-2 mb-4 font-14 input-btm">
        <div class="flex w-full">
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
                <xt-button class="rounded-lg xt-text-2 ml-9 active-btn"
                    style="color: var(--secondary-text) !important; text-align: center !important; border: none;width: 68px; height: 32px;">
                    <!-- <SmileOutlined style="font-size: 16px !important; margin-right: 4px;" /> 表情 -->
                    <replyIcon icon="fluent:emoji-smile-slight-24-regular"
                        style="font-size: 20px; margin-right: 4px;vertical-align: sub;"></replyIcon>表情
                </xt-button>
            </tippy>
            <a-upload v-model:file-list="fileList"  @preview="handlePreview" multiple>
                <xt-button class="ml-1 rounded-lg xt-text-2 active-btn"
                    style="color: var(--secondary-text) !important; text-align: center !important; border: none;width: 68px; height: 32px;">
                    <replyIcon icon="fluent:image-sparkle-16-regular"
                        style="font-size: 20px !important; margin-right: 4px;vertical-align: sub;"></replyIcon>图片
                </xt-button>
            </a-upload>
        </div>
        <xt-button type="primary" class=" reply" :radius="8" :w="68" :h="32"
            style="color:rgba(255,255,255,0.85) !important; background: var(--active-bg) !important;"
            @click="addComment">回复</xt-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, onMounted } from 'vue'
import { SmileOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { appStore } from '../../../../table/store'
import { fileUpload } from '../../../components/card/hooks/imageProcessing'
import { useCommunityStore } from '../commun'
import { Icon as replyIcon } from '@iconify/vue'
import fluentEmojis from '../../../js/chat/fulentEmojis'
const useCommunStore = useCommunityStore()
const userStore = appStore()
const value = ref('')
const commentList = ref([])
// const emojiVis = ref(false)
// const imageVis = ref(false)
// 添加表情
const addEmoji = (item) => {
    const lastSlashIndex = item.lastIndexOf('/');
    const emoiiValue = item.substring(lastSlashIndex + 1);
    const key = Object.entries(fluentEmojis).find(([k, v]) => v === (emoiiValue))[0]
    value.value += `${key}`

}

const emit = defineEmits(['addComment'])
const addComment = async () => {
    if (value.value || fileList.value.length > 0) {
        const imageUrlList = await Promise.all(fileList.value.map(async (item) => {
            const url = await fileUpload(item.originFileObj);
            return url;
        }));

        let authorid = useCommunStore.communityPostDetail.author_uid;
        let content = value.value;
        let threadId = useCommunStore.communityPostDetail.pay_set.tid || useCommunStore.communityPostDetail.id;

        setTimeout(async () => {
            const imageList = JSON.stringify(imageUrlList);
            await useCommunStore.getCommunitythreadReply(authorid, content, threadId, imageList);
            await useCommunStore.getCommunityPostDetail(threadId);
            await useCommunStore.getCommunityPostReply(threadId);

            value.value = '';
            fileList.value = [];
        });
    }

    emit('addComment', commentList);
}
const fileList = ref<UploadProps['fileList']>([
]);
// const imageVisible = () => {
//     // if(fileList.value?.length>0){
//     //     imageVis.value=true
//     // }
//     imageVis.value = true
//     console.log(fileList.value?.length, 'fileList');

// }
const imageVis=computed(()=>{
    return fileList.value?.length>0
})


import type { UploadProps } from 'ant-design-vue';

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
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
let folderPath = reactive([])
onMounted(() => {
    Object.values(fluentEmojis).forEach((item) => {
        folderPath.push(`https://sad.apps.vip/public/static/emoji/emojistatic/${item}`)
    })

})


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
const userInfo = computed(() => {
    return userStore.userInfo
})
let userUid = userInfo.value.uid
let Info = {
    uid: userInfo.uid,
    nickname: userInfo.nickname,
    avatar: userInfo.avatar
}
const showCard = (userUid, Info) => {
    userStore.showUserCard(userUid, Info)

}
onMounted(async () => {
    await userStore.getUserInfo()

})
</script>
<style lang='scss' scoped>
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

:deep(.tippy-box) {
    width: 51%;
    margin-left: 10%;
}
:deep(.ant-upload-list-text-container){
    display: none;
}
.btn {
    border: 1px solid var(--divider);
}

.comment-input {
    border-radius: 8px;
    // height: 40px !important;
    line-height: 30px;
    // width: 300px;
    width: calc(100% - 45px);
    // cursor: cursor;
    &::-webkit-scrollbar{
        display: none;
    }
    
}

.active-btn {
    background-color: transparent;

    &:hover {
        background-color: var(--secondary-bg);
    }
}

:deep(.ant-input) {
    color: var(--secondary-text) !important;

    &::placeholder {
        font-weight: 400;
        font-size: 16px;
        color: var(--disable-text) !important;
    }
}</style>
