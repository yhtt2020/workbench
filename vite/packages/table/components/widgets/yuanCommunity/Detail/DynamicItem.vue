<template>
    <div class="mt-2 xt-bg box "  style="max-width: 1000px; max-height: 600px;border-radius: 10px;">
        <div class="w-full h-full mt-3 mb-2 xt-bg-2 reply-textarea" >
            <div class="w-full h-full text-base xt-bg ">
                <div class="w-full h-full xt-bg-2 " ref="dynamicWidth">
                    <a-textarea v-model:value="postValue" placeholder="请输入" :rows="textWidth" :bordered="false" />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeUnmount, onMounted, computed, watch } from 'vue'
import { yuanCommunityStore } from '../../../../store/yuanCommunity'
import _ from 'lodash-es'
const useYuanCommunityStore = yuanCommunityStore()
const postValue = ref('')
const dynamicWidth = ref(null)
onMounted(() => {
    let textareaElement = window.document.querySelector('textarea')
    textareaElement?.focus()
    // 获取编辑文本
    if (useYuanCommunityStore.dynamicContent.content) {
        postValue.value = useYuanCommunityStore.dynamicContent.content
    } else {
        postValue.value = ''
    }
    // 添加 ResizeObserver 监听外侧 div 的宽度变化
  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(dynamicWidth.value);

  // 初始设置一次宽度
  handleResize();
})
onBeforeUnmount(() => {
  // 移除 ResizeObserver
  const resizeObserver = new ResizeObserver(() => {});
  resizeObserver.disconnect();
});

const handleResize = _.debounce((entries) => {
  const newWidth = entries[0]?.contentRect?.width || 0;
  if(newWidth>600){
    textWidth.value = 22
  }else{
    textWidth.value = 10
  }
}, 500);
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
    border: var(--divider) 1px solid;

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