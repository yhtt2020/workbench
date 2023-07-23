<template>
  <XtTab
    style="height: 52px"
    boxClass="p-1 xt-bg-2"
    v-model:data="selectTab"
    v-model:list="tabList"
    name="title"
  ></XtTab>
</template>

<script>

export default {
  data() {
    return {
      selectTab: "config",
      tabList: [
        {
          title: "配置",
          value: "config",
        },
        {
          title: "样式",
          value: "style",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
