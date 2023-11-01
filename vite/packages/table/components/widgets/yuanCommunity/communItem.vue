<template>
    <div class="w-[542px] h-[84px] pl-3  pt-3 pb-2 mb-4 pointer ">
        <div class="flex justify-between w-full h-full" >
            <div class="h-[84px] mr-3 flex flex-col justify-between">
                <div class="flex items-center h-[24px]" >
                    <a-avatar :src="detailPost.user.avatar" :size="24" ></a-avatar>
                    <div class="ml-2 xt-text-2 font-14 nickname" style="text-align: left;">
                        {{ detailPost.user.nickname }}
                    </div>
                    <div class="xt-text-2 font-14">
                        {{ detailPost.create_time }}
                    </div>
                </div>

                <div class="mt-1 xt-text font-16 content-text" style="text-align: left;" :innerHTML="contentText">
                    <!-- {{ contentText }} -->
                </div>
            </div>
            <div class="right " :style="{ backgroundImage: img ? `url(${img})` : '' }" v-if="showImg">
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed } from 'vue'
import emojiReplace from '../../../js/chat/emoji'
const props = defineProps({
    showForumPost: {
        type: Array,
        default: () => []
    },
})
const detailPost = computed(() => props.showForumPost)
const imageList = computed(() => {
    return detailPost.value.image_170_170
})
const showImg = computed(() => {
    if (imageList.value && imageList.value[0]) {
        return true
    }
    return false
})
const img = computed(() => {
    return imageList.value[0].image
})
const contentText = computed(() => {
    return emojiReplace(detailPost.value.summary)
})
</script>
<style lang='scss' scoped>
.font-14 {

    font-size: 14px;
    font-weight: 400;
}

.font-16 {

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
.nickname{
    &:after{
        content: '·';
        margin-left: 4px;
        margin-right: 4px;
    }
}
.active-item{
    &:hover {
        background-color: var(--active-secondary-bg);
    }
}
</style>
