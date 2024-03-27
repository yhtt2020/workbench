<template>
    <a-drawer v-model:visible="drawerVisible" placement="left" class="no-drag">
        <div class="app-stats">
            <div @click="enterClipboard" class="cursor-pointer app" v-if="hasEnable">
                <a-row>
                    <a-col :span="5">
                        <icon style="font-size: 48px;vertical-align: text-top" icon="xiangmu"></icon>
                    </a-col>
                    <a-col>
                        <div class="font-bold app-title">
                            剪切板
                        </div>
                        <div class="app-des xt-text-2">
                            剪切板监听中…
                        </div>
                    </a-col>
                </a-row>

            </div>
            <div @click="enterMusic" class="app" v-if="status.music.playing && status.music.title && status.music">
                <a-row>
                    <a-col :span="5">
                        <a-avatar style="margin-right: 0.5em" :size="48" :src="status.music.cover"></a-avatar>
                    </a-col>
                    <a-col>
                        <div class="font-bold app-title">
                            网易云音乐
                        </div>
                        <div class="app-des xt-text-2">
                            {{ status.music.title }} {{ status.music.singer }}
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div class="flex app">
                <div>应用状态</div>
                <QueueWidget :show="true"></QueueWidget>
            </div>
        </div>
    </a-drawer>
</template>

<script setup lang='ts'>
import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router';

import QueueWidget from '../../../apps/queue/topWidget/index.vue'

const props = defineProps({
    status: Object,
    hasEnable: Boolean
})

const router = useRouter()

// 通过父组件注入
const drawerVisible = inject('drawerVisible', false)

const enterClipboard = () => {
    router.push({ name: 'clipboard' })
}
const enterMusic = () => {
    router.push({ name: 'music' })
}

onMounted(() => {
    console.log(drawerVisible.value, 'drawerVisible')
})

</script>
<style lang='scss' scoped>
.app-stats {
    .app {
        background: var(--secondary-bg);
        padding: 20px;
        border-radius: 10px;
        font-size: 16px;
        margin-bottom: 10px;
        cursor: pointer;

        &:hover {
            opacity: 0.9;
        }
    }
}
</style>