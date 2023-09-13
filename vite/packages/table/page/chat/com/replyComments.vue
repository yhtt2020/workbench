<template>
    <div class="flex items-center justify-between w-full mt-4">
        <a-avatar src="https://up.apps.vip/avatar/003.png" :size="32"></a-avatar>
        <!-- <div class="w-full ml-3 "> -->
        <a-input v-model:value="value" :placeholder="holderUser" class=" xt-bg comment-input btn" bordered="false"
            @keyup.enter="addComment" />
        <!-- </div> -->
    </div>
    <div class="clearfix mt-3 ml-11" v-if="imageVis">
        <a-upload v-model:file-list="fileList" action=""
            list-type="picture-card" @preview="handlePreview">
            <div v-if="fileList.length < 3">
                <plus-outlined style="font-size: 20px;" />
            </div>
        </a-upload>
        <a-modal v-model:visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
            <img style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
    <div class="flex justify-between mt-2 mb-4 font-14 input-btm">
        <div>
            <button  class=" w-[68px] h-[32px]  xt-text-2 ml-10 xt-bg-2" 
                style="color: var(--secondary-text) !important; text-align: center !important; border: none;"
                @click="emojiVisible"><SmileOutlined style="font-size: 16px !important; margin-right: 4px;"/> 表情</button>
            <button  class="w-[68px] h-[32px] xt-text-2 xt-bg-2"
                style="color: var(--secondary-text) !important; text-align: center !important; border: none;"
                @click="imageVisible"><PictureOutlined style="font-size: 16px !important; margin-right: 4px;"/> 图片</button>
        </div>
        <a-button type="primary" class=" reply xt-text" style="color: var(--secondary-text) !important; border-radius: 8px;"
            @click="addComment">回复</a-button>
    </div>
    <div class="" v-if="emojiVis">
        <vue-custom-scrollbar :settings="settingsScroller" class="w-2/3 p-1  xt-bg h-[100px] xt-bg-2 rounded-lg ml-11">
            <img :src="item" alt="" v-for="(item, index) in folderPath" :key="index" class="w-[32px] h-[32px] mr-2 mb-2">
        </vue-custom-scrollbar>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, h ,onMounted ,computed} from 'vue'
import { SmileOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons-vue'
const value = ref('')
const commentList = ref([])
const emojiVis = ref(false)
const imageVis = ref(false)
const props=defineProps({
    userName:String
})
const holderUser=computed(()=>{
    return `回复 ${props.userName}`
})
const emit=defineEmits(['addComment'])
const addComment = () => {
    if (value.value) {
        commentList.value.push(value.value)
        value.value = ''
    }
    emit('addComment',commentList)
}
// 控制表情和图片的显示与隐藏
const emojiVisible = () => {
    emojiVis.value = !emojiVis.value
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
let folderPath=reactive([])
onMounted(()=>{
    const emojiList=import.meta.globEager('../../../../../public/emoji/emojistatic/emojistatic/*.png')
    const keys=Object.keys(emojiList)
    keys.forEach(item=>{
        folderPath.push(item)
    })
})
const fileList = ref<UploadProps['fileList']>([
    {
        uid: '-1',
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
:deep(.ant-input){
    &::placeholder{
        font-weight: 400;
        font-size: 16px;
        font-family: PingFangSC-Regular;
    }
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
</style>