<template>
    <div class="flex items-center justify-between w-full">
        <a-avatar src="https://up.apps.vip/avatar/003.png" :size="32" ></a-avatar>
        <!-- <div class="w-full ml-3 "> -->
        <a-input v-model:value="value" placeholder="评论" class=" xt-bg comment-input btn" bordered="false"
            @keyup.enter="addComment" />
        <!-- </div> -->
    </div>
    <div class="clearfix mt-3 ml-11" v-if="imageVis">
        <a-upload v-model:file-list="fileList" list-type="picture-card" @preview="handlePreview">
            <div v-if="fileList.length < 3">
                <plus-outlined style="font-size: 20px;" />
            </div>
        </a-upload>
        <a-modal v-model:visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
            <img style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
    <div class="flex justify-between w-full mt-2 mb-4 font-14 input-btm">
        <div>
            <tippy trigger=" click" placement="bottom" >
                <template #content>
                    <vue-custom-scrollbar :settings="settingsScroller"
                        class="w-full  xt-bg h-[100px] xt-bg-2 rounded-lg " >
                        <img :src="item" alt="" v-for="(item, index) in folderPath" :key="index"
                            class="w-[32px] h-[32px] mr-2 mb-2">
                    </vue-custom-scrollbar>
                </template>
                <button class=" w-[68px] h-[32px]  xt-text-2 ml-9 xt-bg-2"
                    style="color: var(--secondary-text) !important; text-align: center !important; border: none;">
                    <SmileOutlined style="font-size: 16px !important; margin-right: 4px;" /> 表情
                </button>
            </tippy>
            <button class="w-[68px] h-[32px] xt-text-2 xt-bg-2"
                style="color: var(--secondary-text) !important; text-align: center !important; border: none;"
                @click="imageVisible">
                <PictureOutlined style="font-size: 16px !important; margin-right: 4px;" /> 图片
            </button>
        </div>
        <a-button type="primary" class=" reply xt-text" style="color: var(--secondary-text) !important; border-radius: 8px;"
            @click="addComment">回复</a-button>
    </div>
    <!-- <tippy trigger="mouseenter click" placement="bottom">

    </tippy> -->
</template>

<script setup lang='ts'>
import { ref, reactive, h, onMounted } from 'vue'
import { SmileOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useTippy } from 'vue-tippy'
const value = ref('')
const commentList = ref([])
// const emojiVis = ref(false)
const imageVis = ref(false)
const emit = defineEmits(['addComment'])
const addComment = () => {
    if (value.value) {
        commentList.value.push(value.value)
        value.value = ''
    }
    emit('addComment', commentList)
}
const imageVisible = () => {
    imageVis.value = !imageVis.value
}
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
const fluentEmojis= reactive({
	"[Kiss]":"Face Blowing a Kiss.png",
	"[Tears]":"Face with Tears of Joy.png",
	"[Cry]":"Loudly Crying Face.png",
	"[Smiling]":"Smiling Face with Open Hands.png",
	"[Confound]":"Confounded Face.png",
	"[Mask]":"Face with Medical Mask.png",
	"[Zany]":"Zany Face.png",
	"[Vomit]":"Face Vomiting.png",
	"[Kissing]":"Kissing Face.png",
	"[Fearful]":"Fearful Face.png",
	"[Pleading]":"Pleading Face.png",
	"[Scream]":"Face Screaming in Fear.png",
	"[AngryFace]":"Angry Face.png",
	"[Zipper]":"Zipper-Mouth Face.png",
	"[Expressionless]":"Expressionless Face.png",
	"[SpiralEyes]":"Face with Spiral Eyes.png",
	"[Shushing]":"Shushing Face.png",
	"[MoneyMouth]":"Money-Mouth Face.png",
	"[ThumbsUp]":"Thumbs Up Light Skin Tone.png",
	"[ThumbsDown]":"Thumbs Down Light Skin Tone.png",
	"[Victory]":"Victory Hand Light Skin Tone.png",
	"[Ok]":"OK Hand Light Skin Tone.png",
	"[Pingching]":"Pinching Hand Light Skin Tone.png",
	"[Hands]":"Folded Hands Light Skin Tone.png",
	"[Clap]":"Clapping Hands Light Skin Tone.png",
	"[OpenHands]":"Open Hands Light Skin Tone.png",
	"[Waing]":"Waving Hand Light Skin Tone.png",
	"[Writing]":"Writing Hand Light Skin Tone.png",
	"[PigFace]":"Pig Face.png",
	"[Cat]":"Cat with Wry Smile.png",
	"[Blowfish]":"Blowfish.png",
	"[Yen]":"Yen Banknote.png",
	"[Triangular]":"Triangular Flag.png",
	"[Heart]":"Beating Heart.png",
	"[Broken]":"Broken Heart.png",
	"[1st]": "1st Place Medal.png",
	"[2nd]":"2nd Place Medal.png",
	"[3rd]":"3rd Place Medal.png",
	"[Selfie]":"Selfie Light Skin Tone.png",
	"[Teacup]":"Teacup Without Handle.png",
	"[New]":"New Button.png",
	"[Check]":"Check Mark Button.png",
	"[Anger]":"Anger Symbol.png",
	"[Acceptable]":'Japanese Acceptable Button.png',
	"[Hundred]":"Hundred Points.png",
	"[Crab]":"Crab.png",
	"[MoneyBag]":"Money Bag.png",
	"[Zzz]":"Zzz.png",
    "[Bomb]":"Bomb.png",
})
let folderPath = reactive([])
onMounted(() => {
    const emojiList = import.meta.globEager('../../../../../public/emoji/emojistatic/emojistatic/*.png')
    console.log(emojiList);
    const keys = Object.keys(emojiList)
    keys.forEach(item => {
        folderPath.push(item)
    })
})
const fileList = ref<UploadProps['fileList']>([
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

.btn {
    border: none;
}

.comment-input {
    border-radius: 8px;
    height: 40px;
    // width: 300px;
    width: calc(100% - 45px);
}

:deep(.ant-input) {
    &::placeholder {
        font-weight: 400;
        font-size: 16px;
        font-family: PingFangSC-Regular;
    }
}
</style>