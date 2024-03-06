<template>
    <div v-if="(!simple || settings.enableChat) && !isOffline && bottomToggle[0]"
            class="
                relative flex flex-row 
                items-center justify-between 
                common-panel user 
                s-bg xt-bg xt-text-1 
                h-[80px] mt-0" 
            style="
                border-radius: 18px;
                border: 1px solid var(--divider);" 
            :style="{
                width: settings.enableChat ? '160px' : '80px',
                paddingLeft: settings.enableChat
                    ? '8px !important'
                    : '8px !important',
                paddingRight: settings.enableChat
                    ? '16px !important'
                    : '0px !important',
                borderRadius: navAttribute.navRadius + 'px',
            }">
        <div class="flex items-center justify-between"
            :style="{ marginLeft: settings.enableChat ? '10px' : '0px' }">
            <div @click="openControl($event)">
                <MyAvatar :chat="true" :level="false" :limit="false"></MyAvatar>
            </div>
            <div v-show="settings.enableChat" class="pl-4 pointer">
                <ChatButton :tipPosition="navAttribute.navSize"></ChatButton>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import MyAvatar from '../small/MyAvatar.vue'
import ChatButton from './ChatButton.vue'
import { storeToRefs} from 'pinia'

import { appStore } from '../../store'
import { offlineStore } from '../../js/common/offline'
import {useNavigationStore} from '../desk/navigationBar/navigationStore';

const useAppStore = appStore()
const { settings,simple } = storeToRefs(useAppStore)

const useOfflineStore = offlineStore()
const { isOffline } = storeToRefs(useOfflineStore)

const navigationStore = useNavigationStore()
const { bottomToggle,navAttribute } = storeToRefs(navigationStore)

const emit = defineEmits(['openControl'])

const openControl = (e) => {
    emit('openControl',e)
}

</script>

<style lang='scss' scoped></style>