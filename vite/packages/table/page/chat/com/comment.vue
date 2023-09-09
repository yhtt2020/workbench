<template>
    <div class="w-full">
        <div class="flex mt-4 mb-4 ">
            <!-- :icon="h(SearchOutlined)" -->
            <div class="flex items-center" @click="clickLike" :class="{ 'xt-theme-bg': isLike }">
                <a-button type="text" class="mr-3 reply w-[57px] h-[32px] xt-bg "  style="position: relative;">{{ like }}</a-button>
                <img src="../../../../../public/icons/like.png" alt="" class="w-[20px] h-[20px] " style="position: absolute;left:40px;">
            </div>
            <div class="flex items-center">
                <a-button type="text" class="reply w-[57px] h-[32px] xt-bg" style="position: relative;">{{ collection }}</a-button>
                <img src="../../../../../public/icons/collect.png" alt="" class="w-[20px] h-[20px]" style="position: absolute;left:108px;">
            </div>

        </div>
        <div class="flex items-center w-full">
            <a-avatar src="https://up.apps.vip/avatar/003.png" :size="32"></a-avatar>
            <div class="ml-3 ">
                <a-input v-model:value="value" placeholder="评论" class=" xt-bg comment-input btn" bordered="false" @keyup.enter="addComment"/>
            </div>
        </div>
        <div class="flex justify-between mt-2 mb-4 font-14 input-btm">
            <div>
                <a-button type="text" class=" w-[68px] h-[32px]  xt-text-2 ml-8 " :icon="h(SmileOutlined)" style="color: var(--secondary-text) !important; text-align: center !important;">表情</a-button>
                <a-button type="text" :icon="h(PictureOutlined)" class="w-[68px] h-[32px] xt-text-2" style="color: var(--secondary-text) !important; text-align: center !important;">图片</a-button>
            </div>
            <a-button type="primary" class="reply xt-text" style="color: var(--secondary-text) !important; " @click="addComment">回复</a-button>
        </div>
        <div class="mb-4 font-14 xt-text" >
            评论 {{ comment }}
            <!-- {{ commentList }} -->
        </div>
        <MainReplyComment :commentList="item" v-for="(item,index) in commentList" :key="index"></MainReplyComment>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, h,computed } from 'vue'
import { SmileOutlined, PictureOutlined } from '@ant-design/icons-vue'
import MainReplyComment from './MainReplyComment.vue'
const like = ref(12)
const collection = ref(22)
const value = ref('')
// const comment = ref(7)
// 评论列表
const commentList=ref([])
const isLike = ref(false)
const clickLike = () => {
    isLike.value = !isLike.value
}
const addComment = () => {
    if(value.value){
        commentList.value.unshift(value.value)
        value.value=''
    }
}
const comment=computed(()=>{
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

.comment-input {
    border-radius: 8px;
    height: 40px;
    // width: 300px;
    width: calc(100%*1.6 );
}

.reply {
    border-radius: 8px;
}

.input-btm {
    :deep(.ant-button) {
        color: var(--secondary-text) !important;
        text-align: center;
    }
}
</style>