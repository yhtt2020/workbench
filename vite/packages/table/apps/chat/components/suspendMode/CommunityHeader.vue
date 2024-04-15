<template>
  <div class="p-3 flex items-center" v-if="headerIcon !== ''">
    <div
      class="flex items-center justify-center px-2.5 py-2.5 rounded-md h-10"
      style="background: rgba(80, 139, 254, 0.2)"
    >
      <div class="flex items-center justify-center mr-2.5">
        <xt-ify-icon :icon="headerIcon" size="20" />
      </div>
      <div
        class="font-16 font-400 xt-text xt-font flex items-center justify-center"
      >
        {{ headerTitle }}
      </div>
    </div>
  </div>
  <a-divider style="height: 1px; margin: 0 0 12px 0" v-if="headerIcon !== ''" />
</template>

<script setup>
import _ from "lodash-es";
import { ref, toRefs, computed } from "vue";

const props = defineProps({
  headerContent: {
    type: String,
    default: () => {},
  },
});
const { headerContent } = toRefs(props);

const data = ref({
  icon: [
    { type: "forum", icon: "fluent-emoji-flat:placard" },
    { type: "group", icon: "fluent-emoji-flat:thought-balloon" },
    { type: "link", icon: "fluent-emoji-flat:globe-with-meridians" },
    { type: "communitySet", icon: "fluent:settings-16-regular" },
    { type: "desk", icon: "" },
  ],
});

// 头部图标
const headerIcon = computed(() => {
  if (Object.keys(headerContent.value).length !== 0) {
    const type = headerContent.value.type;
    const findItem = _.find(data.value.icon, function (item) {
      return type === item.type;
    });
    // console.log('查看',findItem);
    return findItem.icon;
  } else {
    return "";
  }
});

// 图标标题
const headerTitle = computed(() => {
  if (Object.keys(headerContent.value).length !== 0) {
    const groupName =
      headerContent.value.type !== "communitySet"
        ? headerContent.value.name
        : "社群设置";
    // console.log('查看2',groupName);
    return groupName;
  } else {
    return;
  }
});
</script>

<style lang="scss" scoped>
</style>