<template>
    <div class="h-full">
        <div class="flex justify-between">
            <div class="flex">
                <HorizontalPanel :navList="groupsList" v-model:selectType="groupsType" style="height: 40px;">
                </HorizontalPanel>
                <div>
                    <!-- <a-select style="width:160px;  height: 40px; border-radius: 8px;margin-left: 12px;line-height: 40px;"
                     :bordered="false" @change="handleChange" class="flex items-center justify-center">
                        <template #placeholder>
                            <div class=" xt-text font-14">
                                全部
                            </div>
                        </template>
                        <a-select-option :value="item.tag" v-for="(item, index) in options" :key="index"
                            style="color: var(--primary-text);">
                            {{ item.title }}
                        </a-select-option>
                    </a-select> -->
                    <!-- <div class="xt-bg-2 w-[115px] h-[40px] text-center ml-3 leading-10 rounded-lg font-16"
                        style="cursor: pointer">
                        <a-dropdown trigger="click" placement="bottom"
                            overlayStyle="background-color: var(--primary-bg); padding-left:3px ;padding-right:3px; width: 100px;">
                            <span class=" ant-dropdown-link" @click.prevent>
                                {{ options[checkMenuCurrentIndex].title }}
                                <newIcon icon="fluent:chevron-left-16-filled" class="-rotate-90"
                                    style="vertical-align: middle;font-size: 20px;"></newIcon>
                            </span>
                            <template #overlay>
                                <a-menu class="text-center xt-bg-2">
                                    <a-menu-item v-for="(item, index) in options" :key="index" @click="handleChange(index)">
                                        <span class="text-center xt-text">{{ item.title }}</span>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div> -->

                    <a-select  autoClearSearchValue="false" class="ml-3"
                        style="width: 120px;height: 40px;border-radius: 8px;line-height: 46px;margin-left: 12px;font-size: 16px;"
                         :bordered="false" >
                        <a-select-option :value="index" v-for="(item, index) in options"
                            class="absolute z-auto xt-bg xt-text-2 selsect-options" style="font-size: 16px;">
                            {{ item.title }}
                        </a-select-option>
                        <template #placeholder>
                            <div class="xt-text " style="font-size: 16px;">
                                全部
                            </div>
                        </template>
                        <template #suffixIcon>
                            <YuanIcon icon="fluent:chevron-left-16-filled" style="font-size: 20px;vertical-align: sub;"
                                class="mr-3 rotate-180 xt-text"></YuanIcon>
                        </template>
                    </a-select>
                </div>
            </div>
            <div>
                <a-input v-model:value="inputValue" placeholder="搜索"
                    style="width: 244px; height: 40px;border-radius: 12px;border: 1px solid var(--divider);">
                    <template #suffix>
                        <newIcon icon="fluent:search-20-filled" style="font-size: 20px;"></newIcon>
                    </template>
                </a-input>
            </div>
        </div>
        <!-- 圈子列表 -->
        <div style="height: calc(100% - 80px)">
            <vue-custom-scrollbar ref="threadListRef" :key="currentPage" class="w-full thread-list"
                :settings="settingsScroller" style="height: 100%;overflow: hidden;flex-shrink: 0;width: 100%;">
                <div class="flex flex-wrap mt-4">
                    <GroupsItem v-for="(item, index) in groupMsg" :key="index" :circleMsg="item" @goJoin="goJoin" />
                </div>

            </vue-custom-scrollbar>
            <!-- 翻页 -->
            <div class="flex justify-center">
                <a-pagination v-model:current="currentPage" :total="50" show-less-items class="pagination" />
            </div>
        </div>
        <!-- <teleport to="body" :disabled="false"> -->
        <JoinModal v-if="joinVisible" @handleOk="joinVisible = false" />
        <!-- </teleport> -->

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import { Icon as newIcon } from '@iconify/vue'
import GroupsItem from './components/GroupsItem.vue'
import { groupMsg } from './mock'
import JoinModal from './components/JoinModal.vue'
const joinVisible = ref(false)
const groupsList = ref([
    { title: '官方圈子', name: 'official' },
    { title: '用户圈子', name: 'user' }
])
const currentPage = ref(1)
const groupsType = { title: '官方圈子', name: 'official' }
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});
const goJoin = (value) => {
    console.log(value);

    joinVisible.value = value
}
const inputValue = ref('')
const checkMenuCurrentIndex = ref(0)
const options = ref([
    {
        title: '全部',
        tag: 'all'
    },
    {
        title: '热门',
        tag: 'hot'
    },
    {
        title: '精选',
        tag: 'selected'
    },
])
const handleChange = (value) => {
    checkMenuCurrentIndex.value = value
    console.log(value);

}
</script>
<style lang='scss' scoped>
:deep(.ant-input) {
    color: var(--primary-text);

    &::placeholder {
        color: var(--primary-text);
    }
}

:deep(.ant-pagination-item) {
    background: var(--primary-bg);
    border-radius: 8px;
    border: none;
    width: 40px;
    height: 40px;

    & a {
        display: block;
        height: 40px;
        text-align: center;
        margin-top: 4px;
        color: var(--primary-text) !important;
    }
}

:deep(.ant-pagination-item-active a) {
    color: var(--active-bg) !important;
}

:deep(.ant-pagination-prev) {
    background: var(--primary-bg);
    border-radius: 8px;
    border: none;
    width: 40px;
    height: 40px;
}

:deep(.ant-pagination-next) {
    background: var(--primary-bg);
    border-radius: 8px;
    border: none;
    width: 40px;
    height: 40px;
}
:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder){
    color: var(--secondary-text);
    height: 40px;
    line-height: 40px;
}
:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-item){
    color: var(--secondary-text);
    height: 40px;
    line-height: 40px;
}
:deep(.ant-pagination-prev .ant-pagination-item-link) {
    color: var(--primary-text);
    border: none;
}

:deep(.ant-pagination-next .ant-pagination-item-link) {
    color: var(--primary-text);
    border: none;
}
</style>