<template>
  <div class="h-full flex flex-col">
    <a-dropdown>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1">
            <UserOutlined />
            1st menu item
          </a-menu-item>
          <a-menu-item key="2">
            <UserOutlined />
            2nd menu item
          </a-menu-item>
          <a-menu-item key="3">
            <UserOutlined />
            3rd item
          </a-menu-item>
        </a-menu>
      </template>
      <a-button>
        Button
        <DownOutlined />
      </a-button>
    </a-dropdown>
    <div class="mb-2">
      <XtButton type="theme" @click="translate()">翻译</XtButton>
    </div>
    <div class="flex flex-grow justify-between">
      <XtTextarea
        class="h-full"
        style="width: 49%"
        placeholder="请输入"
        v-model:data="inputValue"
      ></XtTextarea>
      <XtTextarea
        class="h-full"
        style="width: 49%"
        v-model:data="resultValue"
      ></XtTextarea>
    </div>
  </div>
</template>

<script>
import { translate } from "../../../store/translate";
import { mapWritableState, mapActions } from "pinia";
export default {
  computed: {
    ...mapWritableState(translate, ["inputValue", "resultValue"]),
  },
  methods: {
    ...mapActions(translate, ["startTranslation"]),
    async translate() {
      this.startTranslation();
    },
  },
};
</script>

<style lang="scss" scoped></style>
