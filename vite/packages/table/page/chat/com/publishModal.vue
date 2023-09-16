
<template>
    <a-modal v-model:visible="props.showPublishModal" title="写动态" class="w-full rounded-lg publish" @ok="handleOk" bodyStyle="font-size=16px !important;"
        @cancel="handleOk">
        <div class="flex items-center justify-center w-full rounded-lg font-14 xt-text-2 xt-bg-2 h-[54px] -mt-2 mb-2">
            分享你的动态，如需更多发布类型（视频，文章等）请前往<a href="https://s.apps.vip/">元社区</a>
        </div>
        <div class="w-full mt-2 xt-bg box font-16">
            <div style="font-size: 1rem !important;">
                <div class="mt-3 mb-2 xt-bg-2 reply-textarea">
                    <a-textarea v-model:value="replyValue" placeholder="输入" :autoSize="{ minRows: 3, maxRows: 8 }"
                        :bordered="false" />
                    <div style="font-size: 16px !important;">
                        <a-upload v-model:file-list="fileList" action="" class="ml-2 text-base" list-type="picture-card"
                            @preview="handlePreview">
                            <div v-if="fileList.length < 6">
                                <plus-outlined style="font-size: 1em;" />
                            </div>
                        </a-upload>
                    </div>
                    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                </div>
                <div class="h-[56px] flex items-center justify-between">
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
                                    <SmileOutlined style="font-size: 0.6em !important;" />
                                </template> 表情</a-button>
                        </tippy>

                        <a-button type="text" size="small" class="xt-text"
                            style="color: var(--secondary-text) !important;"><template #icon>
                                <PictureOutlined style="font-size: 0.6em !important;" />
                            </template> 图片</a-button>
                    </div>

                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex items-center justify-between h-[56px] ml-2 mr-2">
                <a-button type="text" class=" xt-text xt-bg-2 font-14"
                    style="border-radius:10px ; color: var(--secondary-text) !important;">想天工作台/桌面分享 ></a-button>
                <div class="flex items-center">
                    <a-button type="text" class=" xt-text xt-bg-2"
                        style="border-radius:10px ; color: var(--secondary-text) !important;"
                        @click="handleOk">取消</a-button>
                    <a-button type="primary" class=" xt-text"
                        style="border-radius:10px ; color: var(--secondary-text) !important;">发布</a-button>
                </div>
            </div>
        </template>
    </a-modal>
</template>
<script setup lang='ts'>
import { ref, reactive, h, onMounted } from 'vue'
import { CloseOutlined, SmileOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue';
// const userName = ref('我是皮克斯呀')
const replyValue = ref('')
const props = defineProps({
    replyVisible: Boolean,
    showPublishModal: Boolean,
})
// 添加表情
const addEmoji = ( item) => {
    const lastSlashIndex = item.lastIndexOf('/');
    const emoiiValue = item.substring(lastSlashIndex + 1);
    console.log(emoiiValue);
    
    const key = Object.entries(fluentEmojis).find(([k, v]) => v === (emoiiValue))[0]
    replyValue.value +=`${key}`

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
const fluentEmojis = reactive({
    "[Kiss]": "Face Blowing a Kiss.png",
    "[Tears]": "Face with Tears of Joy.png",
    "[Cry]": "Loudly Crying Face.png",
    "[Smiling]": "Smiling Face with Open Hands.png",
    "[Confound]": "Confounded Face.png",
    "[Mask]": "Face with Medical Mask.png",
    "[Zany]": "Zany Face.png",
    "[Vomit]": "Face Vomiting.png",
    "[Kissing]": "Kissing Face.png",
    "[Fearful]": "Fearful Face.png",
    "[Pleading]": "Pleading Face.png",
    "[Scream]": "Face Screaming in Fear.png",
    "[AngryFace]": "Angry Face.png",
    "[Zipper]": "Zipper-Mouth Face.png",
    "[Expressionless]": "Expressionless Face.png",
    "[SpiralEyes]": "Face with Spiral Eyes.png",
    "[Shushing]": "Shushing Face.png",
    "[MoneyMouth]": "Money-Mouth Face.png",
    "[ThumbsUp]": "Thumbs Up Light Skin Tone.png",
    "[ThumbsDown]": "Thumbs Down Light Skin Tone.png",
    "[Victory]": "Victory Hand Light Skin Tone.png",
    "[Ok]": "OK Hand Light Skin Tone.png",
    "[Pingching]": "Pinching Hand Light Skin Tone.png",
    "[Hands]": "Folded Hands Light Skin Tone.png",
    "[Clap]": "Clapping Hands Light Skin Tone.png",
    "[OpenHands]": "Open Hands Light Skin Tone.png",
    "[Waing]": "Waving Hand Light Skin Tone.png",
    "[Writing]": "Writing Hand Light Skin Tone.png",
    "[PigFace]": "Pig Face.png",
    "[Cat]": "Cat with Wry Smile.png",
    "[Blowfish]": "Blowfish.png",
    "[Yen]": "Yen Banknote.png",
    "[Triangular]": "Triangular Flag.png",
    "[Heart]": "Beating Heart.png",
    "[Broken]": "Broken Heart.png",
    "[1st]": "1st Place Medal.png",
    "[2nd]": "2nd Place Medal.png",
    "[3rd]": "3rd Place Medal.png",
    "[Selfie]": "Selfie Light Skin Tone.png",
    "[Teacup]": "Teacup Without Handle.png",
    "[New]": "New Button.png",
    "[Check]": "Check Mark Button.png",
    "[Anger]": "Anger Symbol.png",
    "[Acceptable]": 'Japanese Acceptable Button.png',
    "[Hundred]": "Hundred Points.png",
    "[Crab]": "Crab.png",
    "[MoneyBag]": "Money Bag.png",
    "[Zzz]": "Zzz.png",
    "[Bomb]": "Bomb.png",
})
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
let folderPath = reactive([])
onMounted(() => {
    Object.values(fluentEmojis).forEach((item) => {
        folderPath.push(`https://sad.apps.vip/public/static/emoji/emojistatic/${item}`)
    })

})
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});
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
    visible.value = false
    emit('handleOk', visible)
};

</script>
<style lang='scss' scoped>
// :deep(.lg .ant-modal-body .ant-btn){
//     font-size: 16px !important;
//     margin-right: 5px !important;
// }
// :deep(.lg .ant-modal-body svg) {
//     font-size: 1rem;
// }

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
:deep(#vcDialogTitle0){
    text-align: center !important;
    // color: red;
}
:deep(.ant-upload.ant-upload-select-picture-card) {
    width: 64px;
    height: 64px;
}

:deep(.ant-upload-list-picture-card-container) {
    width: 64px;
    height: 64px;
}

:deep(.ant-input) {
    &::placeholder {
        font-weight: 400;
        font-size: 16px;
        font-family: PingFangSC-Regular;
    }
}
:deep(.ant-upload-list-picture-card .ant-upload-list-item-actions){
    width: 85%;
    font-size: 16px !important;
   
}
:deep(.ant-upload-list-picture-card .ant-upload-list-item-actions .action-eye svg){
    // width: 85%;
   font-size: 1rem !important;
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