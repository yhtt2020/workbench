<template>
<div class="w-full mt-2 xt-bg box font-16">
                <div style="font-size: 1rem !important;">
                    <div class="mt-3 mb-2 xt-bg-2 reply-textarea " style="border: 1px solid var(--divider);">
                        <a-textarea v-model:value="postValue" placeholder=" 请输入"
                            :autoSize="{ minRows: 5, maxRows: 8 }" :bordered="false" v-if="defaultType.value !== 'post'" />
                        <div style="font-size: 16px !important;" v-if="imageLoadVisible">
                            <a-upload v-model:file-list="fileList" action="" class="ml-2 text-base" list-type="picture-card"
                                multiple @preview="handlePreview">
                                <div v-if="fileList.length < 6">
                                    <!-- <plus-outlined style="font-size: 1.2em; " class="xt-text" /> -->
                                    <newIcon icon="fluent:add-16-filled" style="font-size: 24px;vertical-align: sub;"
                                        class="xt-text"></newIcon>
                                </div>
                            </a-upload>
                        </div>
                        <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                            <img style="width: 100%" :src="previewImage" />
                        </a-modal>
                    </div>

                </div>
            </div>
</template>

<script setup lang='ts'>
import {ref,reactive} from 'vue'

</script>
<style lang='scss' scoped>

</style>