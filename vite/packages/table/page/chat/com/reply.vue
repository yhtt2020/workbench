<template>
    <div class="w-full mt-2 xt-bg box">
        <div class="p-3">
            <div class="flex justify-between xt-text h-[64px] items-center ">
                <span class="text-center font-16 xt-text">回复 {{ userName }}</span>
                <a-button type="text" :icon="h(CloseOutlined)" class="xt-text " style="border-radius: 8px;"></a-button>
            </div>
            <div class="mt-2 mb-2 ml-3 mr-3 xt-bg-2 reply-textarea">
                <a-textarea v-model:value="replyValue" placeholder="回复" :autoSize="{ minRows: 3, maxRows: 8 }" />
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
import { CloseOutlined, SmileOutlined, PictureOutlined } from '@ant-design/icons-vue'
const userName = ref('我是皮克斯呀')
const replyValue = ref('')
const props = defineProps({
    replyVisible: Boolean
})

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


.reply-textarea {

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