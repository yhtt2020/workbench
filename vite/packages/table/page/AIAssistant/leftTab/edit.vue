<template>
  <div class="mt-4"></div>

  <xt-option-box>
    <xt-option-info title="API 域名" info="填入从你的服务商获取的API域名。" />
    <xt-option-input v-model:input="url" />
    <hr />
    <xt-option-info title="API 密钥" info="填入从你的服务商获取的API密钥。" />
    <xt-option-input v-model:input="key" />
  </xt-option-box>

  <xt-option-box>
    <div class="mb-2">余额</div>
    <div v-if="state" class="text-sm mb-4">{{ money > 0.1 ? money : '余额不足' }}</div>
    <div v-else class="xt-text-2 mb-4">完成配置后即可查看可用余量。</div>
  </xt-option-box>

  <xt-option-box style="padding-bottom: 0 !important">
    <div class="rounded-xl xt-bg-2-t p-4 mb-4">
      <xt-text>注意事项</xt-text>
      <xt-text class="my-2" type="2"
        >以下所有设置面向专业的开发者，如果您不知道这些设置的含义，请不要修改它们。</xt-text
      >
      <div class="link mt-3 cursor-pointer" @click="resetting()">
        重置为默认值
      </div>
    </div>
    <xt-option-select v-model="gpt" :list="gptList" />
    <div class="mb-4"></div>
    <hr />
    <xt-option-info title="temperature" />
    <xt-option-slider
      v-model:slider="temperature"
      :min="0"
      :max="1"
      :step="0.1"
    />
    <hr />
    <xt-option-info title="上下文条数" />
    <xt-option-slider v-model:slider="count" :min="1" :max="10" />
  </xt-option-box>
</template>

<script>
import { aiStore } from "../../../store/ai";
import { mapWritableState } from "pinia";
import { balance } from "../service/api/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["temperature", "count", "key", "url", "gpt"]),
    state() {
      console.log("this.url && this.key :>> ", this.url && this.key);
      if (this.url && this.key) {
        this.getMoney();
        return true;
      }
      return false;
    },
  },
  methods: {
    async getMoney() {
      let { data } = await balance();
      this.money = data.total_available;
    },
    resetting() {
      this.count = "4";
      this.temperature = "1";
      this.gpt = "gpt-3.5-turbo";
    },
  },
  data() {
    return {
      gptList: [
        { value: "gpt-3.5-turbo", name: "gpt-3.5" },
        {
          value: "gpt-4",
          name: "gpt-4",
        },
        { value: "gpt-4-32k", name: "gpt-4 稳定版" },
      ],
      money: 0.05,
    };
  },
};
</script>

<style lang="scss" scoped></style>
