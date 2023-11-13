<template>
    <div class="mt-2 xt-bg box " style="max-width: 1000px; max-height: 600px;">
        <div class="w-full h-full mt-3 mb-2 xt-bg-2 reply-textarea" style="border: 1px solid var(--divider);">
            <div class="w-full h-full text-base xt-bg box">
                <div class="w-full h-full xt-bg-2 reply-textarea">
                    <a-textarea v-model:value="postValue" placeholder="请输入" :rows="textWidth" :bordered="false" />
                </div>
            </div>

        </div>

        <!-- </div> -->
        
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { yuanCommunityStore } from '../../../../store/yuanCommunity'
import { useCommunityStore } from '../../../../page/chat/commun'
import _ from 'lodash-es'
const useCommunStore = useCommunityStore()
const useYuanCommunityStore = yuanCommunityStore()
const postValue = ref('')
onMounted(() => {
    let textareaElement = window.document.querySelector('textarea')
    textareaElement?.focus()
    // 获取编辑文本
    if (useYuanCommunityStore.dynamicContent.content) {
        postValue.value = useYuanCommunityStore.dynamicContent.content
    } else {
        postValue.value = ''
    }

})
// 文本默认长度
let textWidth = ref(10)
// 暂存动态文本
const savaDynamic = () => {
    useYuanCommunityStore.dynamicContent.content = postValue.value
}
// 监听文本
watch(postValue, _.debounce(savaDynamic, 500))
watch(() => useYuanCommunityStore.dynamicContent.content, (val) => {
    if (val) {
        postValue.value = val
    }
})
</script>
<style lang='scss' scoped>
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