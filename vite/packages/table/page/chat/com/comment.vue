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
        <reply @addComment="getReplyText"/>
        <div class="mb-4 font-14 xt-text">
            评论 7
            <!-- {{ commentList }} -->
        </div>
        <MainReplyComment :commentList="item" v-for="(item, index) in commentList" :key="index"></MainReplyComment>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, h, computed } from 'vue'
import MainReplyComment from './MainReplyComment.vue'
import reply from './reply.vue'
const like = ref(12)
const collection = ref(22)
const value = ref('')
// 评论内容列表
const commentList = ref([])
// 点赞
const isLike = ref(false)
// 
const clickLike = () => {
    isLike.value = !isLike.value
}
const getReplyText=(val)=>{
    // console.log(val);
    commentList.value=val.value
}
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

.reply {
    border-radius: 8px;
}

.input-btm {
    :deep(.ant-button) {
        color: var(--secondary-text) !important;
        text-align: center;
    }
}</style>