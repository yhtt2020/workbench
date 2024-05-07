<!-- 社群设置中成员管理列表页面 -->
<template>
  <template v-for="memberItem in 40">
    <div class="px-4 py-2 flex w-full justify-between rounded-xl member-item">
      <div class="flex items-center">
        <div class="flex w-8 h-8 mr-4 items-center justify-center">
          <a-avatar
            shape="circle"
            :size="32"
            src="https://up.apps.vip/avatar/013.png"
          />
        </div>
        <div class="flex flex-col">
          <span class="xt-font font-16 font-400 xt-text">Edith Turner</span>
          <span class="xt-font font-14 font-400 xt-text-2">陌生人</span>
        </div>
      </div>

      <!-- <div style="display: none" class="right-dropdown">
        <xt-dropdown
          newIcon="fluent:more-horizontal-16-filled"
          :placement="'bottomRight'"
          :w="40"
          :h="40"
        >
          <div
            style="width: 184px; margin-bottom: 8px"
            class="rounded-lg flex items-center h-11 drop-item xt-text-2 xt-bg-2 px-4 py-3 pointer"
            @click="item.callBack"
          >
            <xt-ify-icon :icon="item.newIcon" size="20" class="xt-text mr-3" />
            <div
              class="font-16 xt-font flex items-center justify-center"
              :style="
                item.type === 'delete'
                  ? { color: 'var(--error)' }
                  : { color: 'var(--primary-text)' }
              "
            >
              {{ item.title }}
            </div>
          </div>
        </xt-dropdown>
      </div> -->
    </div>
  </template>
</template>

<script setup>
import { ref, reactive, computed, toRefs } from "vue";

/**ref数据**/
const currentData = ref({
  dropID: "",
});
/**下拉菜单列表**/
const memberDropList = ref([
  {
    title: "发消息",
    newIcon: "ant-design:message-outlined",
    callBack: () => {
      // console.log('查看id',data.dropID);
    },
  },
  {
    title: "移出社群",
    newIcon: "fluent:delete-16-filled",
    type: "delete",
    callBack: () => {
      // console.log('查看id',data.dropID);
    },
  },
]);

/**事件**/
const callbackParams = (args) => {
  // console.log('查看args',args);
  data.dropID = args;
};
</script>

<style lang="scss" scoped>
.member-item {
  &:hover {
    background: var(--active-secondary-bg);
    .right-dropdown {
      display: block !important;
    }
  }
}
</style>
