<template>
  <div>
    <div class="flex flex-col xt-bg-2 rounded-xl p-3">
      <xt-title m="mb">OpenAI API 密钥配置</xt-title>
      <div v-if="state" class="text-sm">余额 {{ money }}</div>
      <div v-else class="xt-text-2">完成配置后即可查看可用余量。</div>
    </div>
    <xt-title spacing="5">API 域名</xt-title>
    <xt-input style="height: 48px" v-model="url" class="xt-b"></xt-input>
    <xt-title spacing="5">API 密钥</xt-title>
    <xt-input style="height: 48px" v-model="key" class="xt-b"></xt-input>
    <xt-title spacing="5">注意事项</xt-title>
    <div class="flex flex-col xt-bg-2 rounded-xl p-3">
      <div>
        以下所有设置面向专业的开发者，如果您不知道这些设置的含义，请不要修改它们，否则可能会导致请求错误。在修改前，请确认您的账户可以访问被选择的模型（不管您是什么账户类型，其中一些模型都需要额外申请，否则会导致请求出现
        404 错误）；同时，请确认 token
        数量没有超过被选择模型的限制，否则上下文超出限制后将会直接报错。请确保您知道自己在做什么。点击下方按钮重置为默认值。
      </div>
      <div class="link mt-3 cursor-pointer" @click="resetting()">重置为默认值</div>
    </div>
    <xt-title spacing="5">GTP模型</xt-title>
    <xt-select v-model="gpt" :list="gptList"> </xt-select>
    <xt-title spacing="5">严谨与想象（Temperature）</xt-title>
    <div class="flex">
      <a-slider
        class="flex-1"
        v-model:value="temperature"
        :min="0"
        :max="1"
        :step="0.1"
        tooltipPlacement="left"
        :tooltipOpen="true"
      />
      <a-input-number
        v-model:value="temperature"
        :min="0"
        :max="2"
      ></a-input-number>
    </div>
    <xt-title spacing="5">上下文的条数</xt-title>
    <div class="flex">
      <a-slider v-model:value="count" :min="1" :max="10" class="flex-1" />
      <a-input-number v-model:value="count" :min="1" :max="10"></a-input-number>
    </div>
  </div>
</template>

<script>
import { aiStore } from "../../../store/ai";
import { mapWritableState } from "pinia";
import { balance } from "../service/api/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["temperature", "count", "key", "url", "gpt"]),
    state() {
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
      money: "",
    };
  },
};
</script>

<style lang="scss" scoped></style>
