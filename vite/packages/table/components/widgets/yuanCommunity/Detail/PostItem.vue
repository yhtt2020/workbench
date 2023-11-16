<template>
    <div class="h-full " style="max-width: 1000px;">
        <!-- 视频和帖子 -->
        <div class="w-full rounded-md xt-bg-2" style="border: 1px solid var(--divider);">
            <a-input v-model:value="titleValue" placeholder="标题" :bordered="false" />
        </div>
        <div class="w-full mt-2 text-base xt-bg box " style="height: 85%;">
            <div style="font-size: 1rem !important;" class="w-full h-full">
                <div class="w-full h-full mt-3 mb-2 xt-bg-2 reply-textarea" style="border: 1px solid var(--divider);">
                    <div class="w-full " :style="{ height: fullScreen ? '100%' : '300px' }" style="overflow: hidden;">
                        <MarkDown></MarkDown>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, computed,watch } from 'vue'
import { yuanCommunityStore } from '../../../../store/yuanCommunity'
import { useCommunityStore } from '../../../../page/chat/commun'
import MarkDown from './MarkDown.vue';
import _ from 'lodash-es'
const useCommunStore = useCommunityStore()
const useYuanCommunityStore = yuanCommunityStore()
// 发布帖子
const titleValue = ref('')

onMounted(() => {
    let inputElement = window.document.querySelector('input')
    inputElement?.focus()
    // 获取标题
    if ( useYuanCommunityStore.postContent.title) {
        titleValue.value = useYuanCommunityStore.postContent.title
    } else {
        titleValue.value = ''
    }
})
const saveTitleText = () => {
    useYuanCommunityStore.postContent.title = titleValue.value
}
watch(titleValue, _.debounce(saveTitleText, 500))
watch(() => useYuanCommunityStore.postContent.title, (val) => {
    if (val) {
        titleValue.value = val
    }
})
</script>
<style lang='scss' scoped>
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
.box {
    border-radius: 12px;
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