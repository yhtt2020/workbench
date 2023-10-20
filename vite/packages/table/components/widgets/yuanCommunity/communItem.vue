<template>
    <div class="w-full h-[96px] pl-3  pt-3 pb-2 mb-2 pointer">
        <div class="flex items-center justify-between">
            <div class="mr-3">
                <!-- {{ showImg }} -->
                <!-- {{ img }} -->
                <div class="mb-2 xt-text-2 font-14" style="text-align: left;" >
                    @{{ detailPost.user.nickname }}
                </div>
                <div class="xt-text font-16 content-text" style="text-align: left;" :innerHTML="contentText">
                    <!-- {{ contentText }} -->
                </div>
            </div>
            <div class="right " :style="{ backgroundImage: img ? `url(${img})` : '' }" v-if="showImg" >
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive ,computed} from 'vue'
import emojiReplace from '../../../js/chat/emoji'
const props=defineProps({
    showForumPost: {
        type: Array,
        default: () => []
    },
})
const detailPost=computed(() => props.showForumPost)
const imageList=computed(() => {
    return detailPost.value.image_170_170
})
const showImg=computed(() => {
    if(imageList.value && imageList.value[0]){
        return true
    }
    return false
})
const img=computed(() => {
    return imageList.value[0].image
})
const contentText=computed(() => {
    return emojiReplace(detailPost.value.summary)
})
</script>
<style lang='scss' scoped>
.font-14 {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 400;
}

.font-16 {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    line-height: 26px;
    font-weight: 400;
}

.content-text {
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
}
.right {
    border-radius: 10px;
    width: 72px;
    height: 72px;
    margin: 8px 0px;
    margin-right: 12px;
    background-size: cover;
    cursor: pointer;
    flex-shrink: 0;
  }
</style>