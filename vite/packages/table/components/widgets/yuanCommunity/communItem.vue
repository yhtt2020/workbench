<template>
    <!-- <div class="w-[542px] h-[84px] pl-3  pt-3 pb-2 mb-4 pointer ">
        <div class="flex items-center justify-between w-full h-full" >
            <div class="flex flex-col justify-between h-[84px] mr-3">
                <div class="flex items-center h-[24px]" >
                    <a-avatar :src="detailPost.user.avatar" :size="24" ></a-avatar>
                    <div class="ml-2 text-sm xt-text-2 nickname" style="text-align: left;">
                        {{ detailPost.user.nickname }}
                    </div>
                    <div class="xt-text-2 font-14">
                        {{ detailPost.create_time }}
                    </div>
                </div>

                <div class="mt-1 text-base xt-text content-text" :style="{height:showImg?'54px':'100%'}" style="text-align: left;" :innerHTML="contentText">
                    
                </div>
            </div>
            <div class="right " :style="{ backgroundImage: img ? `url(${img})` : '' }" v-if="showImg">
            </div>
        </div>
    </div> -->
    <div class="flex justify-between pt-2 pb-1 pl-3 pr-3 mb-2 w-[544px] h-full active-item">
        <div class="flex flex-col ">
            <div class="flex items-center" style="position: relative;">
                <a-avatar :src="detailPost.user.avatar" :size="24" ></a-avatar>
                <a-avatar :src="detailPost.user.attestation_icon" :size="12" v-if="detailPost.user.attestation_icon" style="position: absolute;top: 12px;left: 15px;"></a-avatar>
                <div class="ml-2 text-sm xt-text-2 nickname" style="text-align: left;">
                    {{ detailPost.user.nickname }}
                </div>
                <div class="xt-text-2 font-14">
                    {{ detailPost.create_time }}
                </div>
            </div>
            <div class="mt-2 mb-1 text-base xt-text content-text"  style="text-align: left;cursor: pointer;" :innerHTML="contentText"></div>
        </div>
        <div class="flex flex-col justify-end h-full"  v-if="showImg">
            <div class="right" :style="{ backgroundImage: img ? `url(${img})` : '' }"></div>
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
.content-text {
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
}
.active-item{
    &:hover {
        background-color: var(--active-secondary-bg);
        border-radius: 12px;
    }
}
.right {
    border-radius: 10px;
    width: 54px;
    height: 54px;
    // margin: 8px 0px;
    margin-left: 12px;
    background-size: cover;
    cursor: pointer;
    flex-shrink: 0;
    margin-bottom: 4px;
}

.nickname {
    &:after {
        content: '·';
        margin-left: 4px;
        margin-right: 4px;
    }
}

.active-item {
    &:hover {
        background-color: var(--active-secondary-bg);
    }
}
</style>
