<template>
    <div>
        <div class="flex items-center justify-between pl-4 mb-4">
            <div class="flex items-center">
                <xt-ify-icon icon="fluent:settings-16-regular" class="mr-2" />
                设置
            </div>
            <Exit />
        </div>
        <xt-option-box>
            <xt-option-info 
                title="显示最近使用（开发中）"
                info="在应用开始菜单中显示最近使用数据。"
                :isSwitch="true"
                v-model:switch="recentUsed"
            />
        </xt-option-box>
        <xt-option-box>
            <xt-option-info 
                title="软件下载安装路径（开发中）"
                info="选择软件类型的应用下载安装的文件路径"
                icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="() => {}"
            >
                <template #extra>
                    <xt-button 
                        @click="localAppClick" 
                        class="pb-3 mb-3 xt-bg-t-2" 
                        block 
                        h="40"
                    >请选择
                    </xt-button>
                    <input style="display: none" ref="fileRef" type="file" multiple />
                </template>
            </xt-option-info>
        </xt-option-box>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia';

import { useAppCenterStore } from '../../store';

import Exit from '../../component/exit.vue'

const appCenterStore = useAppCenterStore()
const { recentUsed } = storeToRefs(appCenterStore)

</script>
<style lang='scss' scoped></style>