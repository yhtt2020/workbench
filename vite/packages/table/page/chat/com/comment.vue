<template>
    <div class="w-full">
        <div class="flex mt-4 mb-4 ">
            <!-- :icon="h(SearchOutlined)" -->
            <div class="flex items-center " @click="clickLike" style="cursor: pointer;">
                <button class="mr-3 reply w-[57px] h-[32px]  pl-5 xt-bg"
                    style="position: relative;border: none;cursor: pointer;">{{ like }}</button>
                <img src="../../../../../public/icons/like.png" alt="" class="w-[20px] h-[20px] "
                    style="position: absolute;left:45px;">
            </div>
            <div class="flex items-center" style="cursor: pointer;">
                <button class="reply w-[57px] h-[32px] xt-bg pl-6"
                    style="position: relative;border: none;cursor: pointer;">{{ collection }}</button>
                <img src="../../../../../public/icons/collect.png" alt="" class="w-[20px] h-[20px]"
                    style="position: absolute;left:112px;">
            </div>

        </div>
        <div class="flex items-center justify-between w-full">
            <a-avatar src="https://up.apps.vip/avatar/003.png" :size="32"></a-avatar>
            <!-- <div class="w-full ml-3 "> -->
            <a-input v-model:value="value" placeholder="评论" class=" xt-bg comment-input btn" bordered="false"
                @keyup.enter="addComment" />
            <!-- </div> -->
        </div>
        <div class="flex justify-between mt-2 mb-4 font-14 input-btm">
            <div>
                <a-button type="text" class=" w-[68px] h-[32px]  xt-text-2 ml-8 " :icon="h(SmileOutlined)"
                    style="color: var(--secondary-text) !important; text-align: center !important;"
                    @click="emojiVisible">表情</a-button>
                <a-button type="text" :icon="h(PictureOutlined)" class="w-[68px] h-[32px] xt-text-2"
                    style="color: var(--secondary-text) !important; text-align: center !important;"
                    @click="imageVisible">图片</a-button>
            </div>
            <a-button type="primary" class="reply xt-text" style="color: var(--secondary-text) !important; "
                @click="addComment">回复</a-button>
        </div>
        <replyImages v-if="replyImageVisible" />
        <replyEmoji v-if="replyEmojiVisible" />
        <div class="mb-4 font-14 xt-text">
            评论 {{ comment }}
            <!-- {{ commentList }} -->
        </div>
        <MainReplyComment :commentList="item" v-for="(item, index) in commentList" :key="index"></MainReplyComment>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, h, computed } from 'vue'
import { SmileOutlined, PictureOutlined } from '@ant-design/icons-vue'
import MainReplyComment from './MainReplyComment.vue'
import replyEmoji from './replyEmoji.vue';
import replyImages from './replyImages.vue';
const like = ref(12)
const collection = ref(22)
const value = ref('')
// const comment = ref(7)
const replyImageVisible = ref(false)
const replyEmojiVisible = ref(false)
const emojiVisible = () => {
    if (replyImageVisible.value === true) {
        replyImageVisible.value = false
    }
    replyEmojiVisible.value = !replyEmojiVisible.value
}
const imageVisible = () => {
    if (replyEmojiVisible.value === true) {
        replyEmojiVisible.value = false
    }
    replyImageVisible.value = !replyImageVisible.value
}
// 评论内容列表
const commentList = ref([])
// 点赞
const isLike = ref(false)
// 
const clickLike = () => {
    isLike.value = !isLike.value
}
const addComment = () => {
    if (value.value) {
        commentList.value.push(value.value)
        value.value = ''
    }
}
const comment = computed(() => {
    return commentList.value.length
})
</script>
<style lang='scss' scoped>
.font-14 {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 400;
}

.btn {
    border: none;
}

:deep(.ant-input) {
    &::placeholder {
        color: var(--secondary-text) !important;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        font-weight: 400;
        // margin-left: 3px;
    }
}

.comment-input {
    border-radius: 8px;
    height: 40px;
    // width: 300px;
    width: calc(100% - 45px);
}

.reply {
    border-radius: 8px;
}

.input-btm {
    :deep(.ant-button) {
        color: var(--secondary-text) !important;
        text-align: center;
    }
}</style>