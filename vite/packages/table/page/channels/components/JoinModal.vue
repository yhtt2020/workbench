<template>
    <Modal :maskNoClose="true" class="" :animationName="t - b - close">
        <div class="w-[500px] pl-4 pr-4">
            <div class="flex justify-between w-full h-[64px] items-center ">
                <div class="flex justify-center w-full">
                    <div class="font-16 xt-text">申请加入</div>
                </div>
                <button class="flex items-center border-0 rounded-md xt-bg-2 w-[40px] h-[40px] justify-center pointer"
                    @click="handleOk">
                    <Icon class="text-xl text-center xt-text pointer" icon="akar-icons:cross" />
                </button>

            </div>
            <div class="w-full mt-2 xt-bg box font-16">
                <div style="font-size: 1rem !important;">
                    <div class="mt-3 mb-2 xt-bg-2 reply-textarea">
                        <a-textarea v-model:value="postValue" placeholder="输入" :autoSize="{ minRows: 3, maxRows: 8 }"
                            :bordered="false" />
                    </div>
                </div>
                <div class="flex items-center justify-end h-[56px] ">
                    <div class="flex items-center">
                        <xt-button type="text" class=" xt-text xt-bg-2"
                            style="border-radius:10px ; color: var(--secondary-text) !important;width: 68px; height: 32px;"
                            @click="handleOk">取消</xt-button>
                        <xt-button type="primary" class="ml-2"
                            style="border-radius:10px ; color: var(--secondary-text) !important; width: 68px; height: 32px;background-color: var(--active-bg);"
                            @click="publishPost">提交</xt-button>
                    </div>
                </div>
            </div>
        </div>

    </Modal>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

</script>
<style lang='scss' scoped></style>