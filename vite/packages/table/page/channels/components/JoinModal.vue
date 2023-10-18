<template>
    <Modal :maskNoClose="true" class="" :animationName="t-b-close">
        <div class="w-[500px] pl-4 pr-4">
            <div class="flex justify-between w-full h-[64px] items-center ">
                <div class="flex justify-center w-full">
                    <div class="font-16 xt-text">申请加入</div>
                </div>
                <button class="flex items-center border-0 rounded-md xt-bg-2 w-[40px] h-[40px] justify-center pointer"
                    @click="handleOk">
                    <Icon class="text-xl text-center xt-text pointer" icon="akar-icons:cross" />
                </button>

            </div>
            <div class="w-full mt-2 xt-bg box font-16">
                <div style="font-size: 1rem !important;">
                    <div class="mt-3 mb-2 xt-bg-2 reply-textarea">
                        <a-textarea v-model:value="postValue" placeholder="申请理由" :autoSize="{ minRows: 5, maxRows: 8 }"
                            :bordered="false" />
                    </div>
                </div>
                <div class="flex items-center justify-end h-[56px] ">
                    <div class="flex items-center">
                        <xt-button type="text" class=" xt-text xt-bg-2"
                            style="border-radius:10px ; color: var(--secondary-text) !important;width: 68px; height: 32px;"
                            @click="handleOk">取消</xt-button>
                        <xt-button type="primary" class="ml-2"
                            style="border-radius:10px ; color: var(--secondary-text) !important; width: 68px; height: 32px;background-color: var(--active-bg);"
                            @click="publishPost">提交</xt-button>
                    </div>
                </div>
            </div>
        </div>

    </Modal>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, computed } from 'vue'
import browser from '../../../js/common/browser';
import Modal from '../../../components/Modal.vue'
import { Icon } from '@iconify/vue';
import { message } from 'ant-design-vue'
const goYuan = () => {
    browser.openInUserSelect(`https://s.apps.vip/forum?id=${props.forumId}`)
}
// const userName = ref('我是皮克斯呀')
const postValue = ref('')
const props = defineProps({
    replyVisible: Boolean,
    showPublishModal: Boolean,
    forumId: Number
})
const visible = ref(false)
const emit = defineEmits(['handleOk'])
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
onMounted(() => {
    let textareaElement = window.document.querySelector('textarea')
    // console.log(textareaElement);

    textareaElement?.focus()
    // console.log(navigator.plugins);


})
const handleOk = () => {
    // console.log(e);
    visible.value = false
    emit('handleOk', visible)
};
// 发布帖子
const titleValue = ref('')
const publishPost = async () => {
    if (postValue.value ) {
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
            
            message.success('发布成功')
            titleValue.value = ''
            postValue.value = ''
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