<template>
    <div>
        <div class="flex items-center justify-between pl-4">
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
                :switch="true"
            />
        </xt-option-box>
        <xt-option-box>
            <xt-option-info 
                title="软件下载安装路径（开发中）"
                info="选择软件类型的应用下载安装的文件路径"
            />
            <template #extra>
                <div>
                    <xt-button w="100" h="32" radius="8" icon="fluent:settings-16-regular" />
                </div>
            </template>
        </xt-option-box>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import Exit from '../../component/exit.vue'

</script>
<style lang='scss' scoped></style>