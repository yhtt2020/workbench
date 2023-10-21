
<template>
    <Modal :maskNoClose="true" class="" :animationName="t-b-close">
        <div class="w-[500px] pl-4 pr-4">
            <div class="flex justify-between w-full h-[64px] items-center ">
                <div class="flex justify-center w-full">
                    <div class="ml-8 font-16 xt-text">写动态</div>
                </div>
                <xt-button class="flex items-center justify-center border-0 rounded-md xt-bg-2 pointer"
                    @click="handleOk" style="width: 40px;height: 40px;">
                    <newIcon class="mt-1 text-xl text-center xt-text pointer" icon="akar-icons:cross" />
                </xt-button>

            </div>
            <div class="flex items-center justify-start w-full rounded-lg font-14 xt-text-2 xt-bg-2 h-[54px] pl-4 ">
                分享你的动态，如需更多发布类型（视频，文章等）请前往<a href="" @click.prevent="goYuan" class="ml-1">元社区</a>
            </div>
            <div class="w-full mt-2 xt-bg box font-16">
                <div style="font-size: 1rem !important;">
                    <div class="mt-3 mb-2 xt-bg-2 reply-textarea">
                        <a-textarea v-model:value="postValue" placeholder="输入" :autoSize="{ minRows: 5, maxRows: 8 }"
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
                                        <!-- <SmileOutlined style="" /> -->
                                        <newIcon icon="fluent:emoji-smile-slight-24-regular" class="text-xl xt-text-2" style="vertical-align: sub;margin-right: 4px;"/>
                                    </template> 表情</a-button>
                            </tippy>

                            <a-upload v-model:file-list="fileList"  @preview="handlePreview" multiple>
                            <a-button type="text" size="small" class="xt-text" 
                                style="color: var(--secondary-text) !important;"><template #icon>
                                    <newIcon icon="fluent:image-sparkle-16-regular" class="text-xl xt-text-2" style="vertical-align: sub;margin-right: 4px;"/>
                                </template> 图片</a-button>
                            </a-upload>
                        </div>

                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between h-[56px] ">
                <!-- <a-button type="text" class=" xt-text xt-bg-2 font-14"
                    style="border-radius:10px ; color: var(--secondary-text) !important;">想天工作台/桌面分享 ></a-button> -->
                    <a-select v-model:value="cascaderValue" :options="options" :placeholder="holderName?.name" :loadData="loadData" :bordered="false" @change="handleChange"
                    style=" font-size: 16px; border-radius: 10px;width: 120px;height: 40px;" change-on-select>
                    <template #suffixIcon>
                        <Icon icon="fluent:chevron-left-16-filled" class="text-base rotate-180"></Icon>
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
import { SmileOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue';
import browser from '../../../js/common/browser';
import Modal from '../../../components/Modal.vue'
import { Icon as newIcon } from '@iconify/vue';
import { fileUpload } from '../../../components/card/hooks/imageProcessing'
import { useCommunityStore } from '../commun'
import type { CascaderProps } from 'ant-design-vue';
import fulentEmojis from '../../../js/chat/fulentEmojis'
import { message } from 'ant-design-vue'
const useCommunStore = useCommunityStore()
// const imageLoadVisible = ref(true)
const goYuan = () => {
    browser.openInUserSelect(`https://s.apps.vip/forum?id=${props.forumId}`)
}
const imageLoadVisible=computed(()=>{
    return fileList.value?.length>0
})
// const userName = ref('我是皮克斯呀')
const postValue = ref('')
const props = defineProps({
    replyVisible: Boolean,
    showPublishModal: Boolean,
    forumId: Number
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
// const fluentEmojis = reactive({
//     "[Kiss]": "Face Blowing a Kiss.png",
//     "[Tears]": "Face with Tears of Joy.png",
//     "[Cry]": "Loudly Crying Face.png",
//     "[Smiling]": "Smiling Face with Open Hands.png",
//     "[Confound]": "Confounded Face.png",
//     "[Mask]": "Face with Medical Mask.png",
//     "[Zany]": "Zany Face.png",
//     "[Vomit]": "Face Vomiting.png",
//     "[Kissing]": "Kissing Face.png",
//     "[Fearful]": "Fearful Face.png",
//     "[Pleading]": "Pleading Face.png",
//     "[Scream]": "Face Screaming in Fear.png",
//     "[AngryFace]": "Angry Face.png",
//     "[Zipper]": "Zipper-Mouth Face.png",
//     "[Expressionless]": "Expressionless Face.png",
//     "[SpiralEyes]": "Face with Spiral Eyes.png",
//     "[Shushing]": "Shushing Face.png",
//     "[MoneyMouth]": "Money-Mouth Face.png",
//     "[ThumbsUp]": "Thumbs Up Light Skin Tone.png",
//     "[ThumbsDown]": "Thumbs Down Light Skin Tone.png",
//     "[Victory]": "Victory Hand Light Skin Tone.png",
//     "[Ok]": "OK Hand Light Skin Tone.png",
//     "[Pingching]": "Pinching Hand Light Skin Tone.png",
//     "[Hands]": "Folded Hands Light Skin Tone.png",
//     "[Clap]": "Clapping Hands Light Skin Tone.png",
//     "[OpenHands]": "Open Hands Light Skin Tone.png",
//     "[Waing]": "Waving Hand Light Skin Tone.png",
//     "[Writing]": "Writing Hand Light Skin Tone.png",
//     "[PigFace]": "Pig Face.png",
//     "[Cat]": "Cat with Wry Smile.png",
//     "[Blowfish]": "Blowfish.png",
//     "[Yen]": "Yen Banknote.png",
//     "[Triangular]": "Triangular Flag.png",
//     "[Heart]": "Beating Heart.png",
//     "[Broken]": "Broken Heart.png",
//     "[1st]": "1st Place Medal.png",
//     "[2nd]": "2nd Place Medal.png",
//     "[3rd]": "3rd Place Medal.png",
//     "[Selfie]": "Selfie Light Skin Tone.png",
//     "[Teacup]": "Teacup Without Handle.png",
//     "[New]": "New Button.png",
//     "[Check]": "Check Mark Button.png",
//     "[Anger]": "Anger Symbol.png",
//     "[Acceptable]": 'Japanese Acceptable Button.png',
//     "[Hundred]": "Hundred Points.png",
//     "[Crab]": "Crab.png",
//     "[MoneyBag]": "Money Bag.png",
//     "[Zzz]": "Zzz.png",
//     "[Bomb]": "Bomb.png",
// })
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
let folderPath = reactive([])
onMounted(() => {
    Object.values(fulentEmojis).forEach((item) => {
        folderPath.push(`https://sad.apps.vip/public/static/emoji/emojistatic/${item}`)
    })
    let textareaElement = window.document.querySelector('textarea')
    // console.log(textareaElement);

    textareaElement?.focus()
    useCommunStore.getCommunityInfo(props.forumId)
    useCommunStore.getCommunityCate(props.forumId)
    console.log(useCommunStore.communityInfo.forum?.name);
    // console.log(navigator.plugins);


})
const communCate = computed(() => useCommunStore.communityCate)
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
    return useCommunStore.communityInfo.forum
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
            await useCommunStore.getCommunityPost(forumId)
        });

    }
}
</script>
<style lang='scss' scoped>
:deep(.ant-upload-list-text-container){
    display: none;
}
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
    height: 40px;
    line-height: 40px;
}
:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-item){
    color: var(--secondary-text);
    height: 40px;
    line-height: 40px;
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
    // padding-left: 8px;
    margin-left: 4px;
    &::placeholder {
        font-weight: 400;
        font-size: 16px;
        font-family: PingFangSC-Regular;
        color: var(--secondary-text);
        // padding-left: 4px;
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