<template>
    <div class="w-full h-[96px] pl-3 pr-3 pt-3 pb-2 mb-2">
        <div class="flex items-center justify-between">
            <div class="mr-3">
                <div class="mb-2 xt-text-2 font-14" style="text-align: left;">
                    @{{ name }}
                </div>
                <div class="xt-text font-16 content-text" style="text-align: left;">
                    {{ content }}
                </div>
            </div>
            <div class="right" :style="{ backgroundImage: img ? `url(${img})` : '' }" v-if="showImg" >
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const name = ref('阳光彩虹小白马')
const content = ref('终于通关了一款难度很高的游戏，感觉自己真的很厉害！ #游戏大神# #通关挑战#哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈')
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
    white-space: pre-wrap;
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
  }
</style>