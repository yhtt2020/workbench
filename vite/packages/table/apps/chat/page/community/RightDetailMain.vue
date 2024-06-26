<!-- 右侧显示区域页 -->
<template>
  <div style="height: 0; flex: 1" class="relative">
    <!-- 群聊 -->
    <template v-if="currentType === 'group'">
      <CurrentGroupJoin
        v-if="isGroupJoin === 'not'"
        :groupInfo="currentProps"
      />
      <TUIChat v-else />
    </template>

    <!-- 链接 -->
    <template v-else-if="currentType === 'link'">
      <template v-if="currentName?.name === 'Roadmap'">
        <iframe
          :src="currentProps?.url"
          class="m-2"
          style="
            border: none;
            background: none;
            border-radius: 4px;
            width: calc(100% - 10px);
            height: calc(100% - 10px);
          "
        ></iframe>
      </template>

      <template
        v-else-if="
          currentProps?.openMethod === 'currentPage' &&
          currentName?.name === 'Roadmap'
        "
      >
        <iframe
          :src="currentProps?.url"
          class="m-2"
          style="
            border: none;
            background: none;
            border-radius: 4px;
            width: calc(100% - 10px);
            height: calc(100% - 10px);
          "
        ></iframe>
      </template>

      <template
        v-else-if="
          currentName !== 'Roadmap' && currentProps?.openMethod !== 'currentPage'
        "
      >
        <div
          class="flex items-center justify-center"
          style="text-align: center; margin-top: 30%"
        >
          <span class="font-16 font-400" style="color: var(--primary-text)">
            当前频道需要浏览器打开。
          </span>
          <xt-ify-icon icon="fluent:open-20-filled" style="font-size: 24px" />
        </div>
      </template>

      <div
        style="position: absolute; top: -62px; right: 0px"
        v-if="
          currentName?.name !== 'Roadmap' && currentProps?.openMethod !== 'currentPage'
        "
      >
        <xt-button @click="openLink" :w="120" :h="40"> 浏览器打开 </xt-button>
      </div>
    </template>

    <!-- 版块 -->
    <template v-else-if="currentType === 'forum'">
      <Commun :forum-id="currentProps.id" />
    </template>

    <!-- 社群设置 -->
    <template v-else-if="currentType === 'setting'">
      <router-view></router-view>
    </template>
  </div>
</template>

<script setup>
import { computed, toRefs, ref } from "vue";
import browser from "../../../../js/common/browser";
import { checkGroupShip } from "../../../../js/common/sns";

/**导入页面**/
import Commun from "../com/Commun.vue";
import CurrentGroupJoin from "../join/CurrentGroupJoin.vue";
// import SettingIndex from "../setting/SettingIndex.vue";

const props = defineProps({
  currentItem: {
    type: Object,
    default: () => {},
  },
});
const { currentItem } = toRefs(props);

/**根据当前群聊是否已经加入**/
const groupJoinRes = ref("");
const isGroupJoin = computed(() => {
  groupJoin();
  return groupJoinRes.value;
});
const groupJoin = async () => {
  const groupID = currentItem.value?.props?.groupID
    ? currentItem.value?.props?.groupID
    : currentItem.value?.props?.id;
  const res = await checkGroupShip([`${groupID}`]);
  groupJoinRes.value = res[0];
};

/**当前类型为群聊、链接、社区版块、内容、名称等等**/
const currentType = computed(() => {
  return currentItem.value?.type;
});
const currentProps = computed(() => {
  return currentItem.value?.props;
});
const currentName = computed(() => {
  return currentItem.value;
});

/**其他链接通过外部按钮进行打开**/
const openLink = () => {
  // 系统默认浏览器打开
  if (currentItem.value.props?.url) {
    browser.openInSystem(currentItem.value.props.url);
  } else {
    browser.openInSystem(currentItem.value.props);
  }
};
</script>

<style lang="scss" scoped>
</style>