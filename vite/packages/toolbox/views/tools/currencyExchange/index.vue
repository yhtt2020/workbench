<template>
  <div class="mx-auto text-base" style="width: 80%">
    <div>
      1 {{ selectFromCurrency.name }} = {{ fromRate }}
      {{ selectToCurrency.name }}
    </div>
    <div class="my-3">
      1 {{ selectToCurrency.name }} = {{ toRate }} {{ selectFromCurrency.name }}
    </div>

    <div class="flex items-center">
      <XtInput
        class="xt-border rounded-lg"
        v-model:data="fromCurrency"
        @keyup="fromCurrencyRate()"
      >
        <template #addonBefore>
          <!-- 下拉区 -->
          <a-dropdown>
            <template #overlay>
              <div
                class="xt-bg-2 xt-border xt-text flex flex-wrap rounded-xl p-2 xt-shadow"
                style="width: 520px"
              >
                <div
                  v-for="item in currencies"
                  class="p-2 cursor-pointer xt-base-btn text-sm"
                  style="width: 120px"
                  :class="{ 'xt-theme-text': selectFromCurrency.id == item.id }"
                  @click="selectFromCurrency = item"
                >
                  {{ item.name }}
                  {{ item.id }}
                </div>
              </div>
            </template>
            <!-- 展示区 -->
            <div
              class="h-full flex items-center xt-text justify-between px-4"
              style="
                width: 170px;
                background: var(--secondary-text);
                border-radius: 8px 0 0 8px;
              "
            >
              <div class="flex items-center">
                <img
                  :src="`https://coinyep.com/img/png/${selectFromCurrency.id}.png`"
                  alt=""
                  style="width: 26px; height: 18px"
                />
                <div class="mx-2">{{ selectFromCurrency.name }}</div>
                <div>{{ selectFromCurrency.id }}</div>
              </div>
              <Icon icon="xiangxia" class="m"> </Icon>
            </div>
          </a-dropdown>
        </template>
      </XtInput>
      <XtIcon
        @click="copyToClipboard(fromCurrency)"
        icon="fuzhi"
        size="28"
        type=""
      ></XtIcon>
    </div>
    <div class="my-3 flex justify-center" style="width: 100%">
      <icon icon="paixu" style="font-size: 28px"></icon>
    </div>
    <div class="flex items-center">
      <XtInput
        class="xt-border rounded-lg"
        v-model:data="toCurrency"
        @keyup="toCurrencyRate()"
      >
        <template #addonBefore>
          <a-dropdown>
            <template #overlay>
              <div
                class="xt-bg-2 xt-border xt-text flex flex-wrap rounded-xl p-2 xt-shadow"
                style="width: 520px"
              >
                <div
                  v-for="item in currencies"
                  class="p-2 cursor-pointer xt-base-btn text-sm"
                  style="width: 120px"
                  :class="{ 'xt-theme-text': selectToCurrency.id == item.id }"
                  @click="selectToCurrency = item"
                >
                  {{ item.name }}
                  {{ item.id }}
                </div>
              </div>
            </template>
            <div
              class="h-full flex items-center xt-text justify-between px-4"
              style="
                width: 170px;
                background: var(--secondary-text);
                border-radius: 8px 0 0 8px;
              "
            >
              <div class="flex items-center">
                <img
                  :src="`https://coinyep.com/img/png/${selectToCurrency.id}.png`"
                  alt=""
                  style="width: 26px; height: 18px"
                />
                <div class="mx-2">{{ selectToCurrency.name }}</div>
                <div>{{ selectToCurrency.id }}</div>
              </div>
              <Icon icon="xiangxia" class="m"> </Icon>
            </div>
          </a-dropdown>
        </template>
      </XtInput>
      <XtIcon
        @click="copyToClipboard(toCurrency)"
        icon="fuzhi"
        size="28"
        type=""
      ></XtIcon>
    </div>
  </div>

  <!-- <div>货币id https://coinyep.com/zh/currencies</div>
  <div>货币接口 https://60s.viki.moe/ex-rates?c=USD</div> -->
</template>

<script>
import { currencyExchange } from "../../../store/currencyExchange";
import { mapWritableState } from "pinia";
import axios from "axios";
import { currencies } from "./currencies";
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      currencies,
      selectFromCurrency: {
        name: "人民币",
        id: "CNY",
      },
      selectToCurrency: {
        name: "美元",
        id: "USD",
      },
      fromCurrency: "",
      toCurrency: "",
      fromCurrencyRateList: "",
      toCurrencyRateList: "",
    };
  },
  async mounted() {
    this.$cache.set("text", "hello", "today");
    this.getCurrency(this.selectFromCurrency.id);
    this.getCurrency(this.selectToCurrency.id);
  },
  watch: {
    async selectFromCurrency(newV) {
      await this.getCurrency(newV.id);
      this.fromCurrencyRate();
    },
    async selectToCurrency(newV) {
      await this.getCurrency(newV.id);
      this.toCurrencyRate();
    },
  },
  computed: {
    ...mapWritableState(currencyExchange, ["currencyRateList"]),

    fromRate() {
      return (
        this.currencyRateList[this.selectFromCurrency.id] &&
        this.currencyRateList[this.selectFromCurrency.id][
          this.selectToCurrency.id
        ]
      );
    },
    toRate() {
      return (
        this.currencyRateList[this.selectFromCurrency.id] &&
        this.currencyRateList[this.selectToCurrency.id][
          this.selectFromCurrency.id
        ]
      );
    },
  },
  methods: {
    fromCurrencyRate() {
      this.toCurrency = this.fromCurrency * this.fromRate;
    },
    toCurrencyRate() {
      this.fromCurrency = this.toCurrency * this.toRate;
    },

    async getCurrency(id) {
      let currencyState = this.$cache.get("currencyState");
      if (!currencyState) {
        this.currencyRateList = [];
        this.$cache.set("currencyState", true, "today");
      }
      if (!this.currencyRateList[id]) {
        let toUrl = `https://60s.viki.moe/ex-rates?c=` + id;
        let toRes = await axios.get(toUrl);
        this.toCurrencyRateList = toRes.data.data;
        this.currencyRateList[id] = { ...toRes.data.data };
      }
    },
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          message.success("已成功复制到剪切板");
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
