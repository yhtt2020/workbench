<template>
    <div>
        <a-row>
            <a-col :span="12" class="pr-3 ">
                <div class="flex justify-between mb-4">
                    <div class="title-font ">图标名称</div>
                    <a-switch v-model:checked="iconSettings.iconName"/>
                </div>
                <a-input placeholder="请输入"  style="height: 40px;border-radius: 10px"/>
                <div>
                    <div class="mt-4 mb-4 title-font ">链接 / 快捷方式</div>
                    <div class="flex justify-between">
                        <xt-button w="186" h="40">链接</xt-button>
                        <xt-button w="186" h="40">快捷方式</xt-button>
                    </div>
                </div>
                <div class="mt-2 ">
                    <div class="mb-4 title-font">图标</div>
                    <div class="flex items-center justify-start">
                        <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card"
                            class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload"
                            @change="handleChange">
                            <div >
                                <plus-outlined ></plus-outlined>
                            </div>
                        </a-upload>
                        <div class="text-sm xt-text-2">
                            推荐尺寸：256 x 256 px，最大不超过 2 MB
                        </div>
                    </div>
                </div>
                <div>
                    <div class="mt-4 mb-4 title-font">预览</div>
                    <div class="flex items-center justify-center rounded-md xt-bg-2" style="width: 383px;height: 200px;">
                        <div class="xt-bg rounded-xl" style="width: 109px;height: 96px;">
                            <img  :src="imageUrl" alt="avatar" />
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <xt-button w="96" h="40" style="background-color: var(--active-bg);">确认添加</xt-button>
                </div>
            </a-col>
            <!-- <div style="height: 100%;width: 1px;"></div> -->
            <a-col :span="12" class="pl-3 pr-3">
                <div class="mb-4 title-font">图标尺寸</div>
                <RadioTab :navList="iconSize" v-model:selectType="defaultSize"/>
                <div class="flex justify-between mt-4 mb-8">
                    <div class="title-font">图标圆角：{{sliderValue}}px</div>
                    <a-switch v-model:checked="iconSettings.iconRounded"/>
                </div>
                <a-slider v-model:value="sliderValue" :tooltip-visible="true" />
                <div class="mt-8">
                    <div class="mb-4 title-font">图标形状</div>
                    <RadioTab :navList="iconShape" v-model:selectType="defaultShape" />
                </div>
                <div class="mt-4">
                    <div class="mb-4 title-font">图标状态</div>
                    <RadioTab :navList="iconStatus" v-model:selectType="defaultStatus"/>
                </div>
                <div class="flex justify-between mt-4">
                    <div class="title-font">背景色</div>
                    <a-switch v-model:checked="iconSettings.iconBackground"/>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang='ts'>
import {useNavigationStore} from '../navigationStore'
import { ref, reactive,computed } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent } from 'vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import RadioTab from '../../../RadioTab.vue';
import {iconSize,iconShape,iconStatus} from '../index'
const navigationStore=useNavigationStore()
const defaultSize=ref({
        title:'1*1',
        value:'mini'
})
const defaultShape=ref({
    title:'正方形',
    value:'square'
})
const defaultStatus=ref({
    title:'覆盖',
    value:'cover'
})
const sliderValue=ref(0)
const iconSettings=computed(()=>{
    return navigationStore.iconSetting
})
const fileList = ref([]);
const imageUrl = ref<string>('');
const beforeUpload = (file: UploadProps['fileList'][number]) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
</script>
<style lang='scss' scoped>
.title-font{
    font-size: 16px;
    color: var(--primary-text);
    font-weight: 400;
}
:deep(.avatar-uploader > .ant-upload){
    width: 64px;
    height: 64px;
    border-radius: 6px;
}
</style>