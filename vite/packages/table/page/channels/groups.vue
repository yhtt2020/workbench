<template>
    <div>
        <div class="flex justify-between">
            <div class="flex"> 
                <HorizontalPanel :navList="groupsList" v-model:selectType="groupsType"></HorizontalPanel>
                <div>
                    <a-select v-model:value="value" show-search placeholder="全部" style="width: 160px;height: 46px;margin-left: 12px;line-height: 46px;border-radius: 12px;" :bordered="false"
                        :options="options"  @change="handleChange"></a-select>
                </div>
            </div>
            <div>
                <a-input v-model:value="inputValue" placeholder="搜索" style="width: 244px; height: 46px;border-radius: 12px;">
                    <template #suffix>
                        <newIcon icon="fluent:search-20-filled" style="font-size: 20px;"></newIcon>
                    </template>
                </a-input>
            </div>
        </div>
        <div class="mt-4">
            <vue-custom-scrollbar :settings="settingsScroller" >
                <GroupsItem />
            </vue-custom-scrollbar>
            
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import {Icon as newIcon} from '@iconify/vue'
import GroupsItem from './components/GroupsItem.vue'
const groupsList = ref([
    { title: '官方圈子', name: 'official' },
    { title: '用户圈子', name: 'user' }
])
const groupsType = { title: '官方圈子', name: 'official' }
const settingsScroller = reactive({
  useBothWheelAxes: true,
  swipeEasing: true,
  suppressScrollY: false,
  suppressScrollX: true,
  wheelPropagation: true,
});
</script>
<style lang='scss' scoped></style>