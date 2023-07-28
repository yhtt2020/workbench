<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between mb-3">
      <div class="flex items-center w-full pr-3">
        <!-- 被翻译源 -->
        <a-dropdown>
          <template #overlay>
            <div
              class="xt-bg-2 xt-border xt-text flex flex-wrap rounded-xl p-2 xt-shadow"
              style="width: 520px"
            >
              <div
                v-for="item in lang"
                class="p-2 cursor-pointer"
                style="width: 100px"
                :class="{ 'xt-theme-text': fromLang.lang == item.lang }"
                @click="fromLang = item"
              >
                {{ item.name }}
              </div>
            </div>
          </template>
          <XtButton
            class="flex-1"
            btnClass=" flex justify-between px-4"
            iconPosition="postfix"
            icon="xiangxia"
            >{{ fromLang.name }}</XtButton
          >
        </a-dropdown>
        <!-- 交换 -->
        <XtIcon
          icon="paixu"
          type=""
          @click="translateSwitch()"
          style="transform: rotate(90deg);"
        ></XtIcon>
        <!-- 翻译 -->
        <a-dropdown>
          <template #overlay>
            <div
              class="xt-bg-2 xt-border xt-text flex flex-wrap rounded-xl p-2 xt-shadow"
              style="width: 520px"
            >
              <div
                v-for="item in lang.slice(1)"
                class="p-2 cursor-pointer"
                style="width: 100px"
                :class="{ 'xt-theme-text': toLang.lang == item.lang }"
                @click="toLang = item"
              >
                {{ item.name }}
              </div>
            </div>
          </template>
          <XtButton
            class="flex-1"
            btnClass=" flex justify-between px-4"
            iconPosition="postfix"
            icon="xiangxia"
            >{{ toLang.name }}</XtButton
          >
        </a-dropdown>
      </div>
      <div>
        <XtButton type="theme" @click="translate()">翻译</XtButton>
      </div>
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
import { message } from "ant-design-vue";
import { lang } from "./lang";
export default {
  data() {
    return {
      lang,
    };
  },
  beforeRouteLeave(to, from, next) {
    this.inputValue = "";
    this.resultValue = "";
    this.selectLang = this.lang[1];
    next();
  },
  computed: {
    ...mapWritableState(translate, [
      "fromLang",
      "toLang",
      "inputValue",
      "resultValue",
    ]),
  },
  methods: {
    ...mapActions(translate, ["startTranslation"]),
    translateSwitch() {
      if (this.fromLang.lang === "auto") {
        message.warn("自动检测无法切换");
        return;
      }
      [this.toLang, this.fromLang] = [this.fromLang, this.toLang];
    },
    async translate() {
      this.startTranslation();
    },
  },
};
</script>

<style lang="scss" scoped></style>
