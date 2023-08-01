<template>
  <div class="mx-auto text-base" style="width: 80%">
    <div>
      1 {{ selectFromCurrency.name }} = {{ fromRate }}
      {{ selectToCurrency.name }}
    </div>
    <div class="my-3">
      1 {{ selectToCurrency.name }} = {{ toRate }} {{ selectFromCurrency.name }}
    </div>

    <div class="flex items-center h-12">
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
              <XtBaseIcon icon="xiangxia" class="m"> </XtBaseIcon>
            </div>
          </a-dropdown>
        </template>
      </XtInput>
      <XtIcon :copy="fromCurrency" icon="fuzhi" size="28" type=""></XtIcon>
    </div>
    <div class="flex justify-center" style="width: 100%">
      <XtIcon icon="paixu" type="" size="28" @click="swap()"></XtIcon>
    </div>
    <div class="flex items-center h-12">
      <XtInput
        class="xt-border rounded-lg"
        v-model:data="toCurrency"
        @keyup="toCurrencyRate()"
      >
        <template #addonBefore>
          <a-dropdown placement="top">
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
              <XtBaseIcon icon="xiangxia" class="m"> </XtBaseIcon>
            </div>
          </a-dropdown>
        </template>
      </XtInput>
      <XtIcon :copy="toCurrency" icon="fuzhi" size="28" type=""></XtIcon>
    </div>

    <div class="xt-text-2 mt-2">{{ getDate() }} 数据仅供参考</div>
  </div>

  <!-- <div>货币id https://coinyep.com/zh/currencies</div>
  <div>货币接口 https://60s.viki.moe/ex-rates?c=USD</div> -->
</template>

<script>
import dayjs from "dayjs";
import { currencyExchange } from "../../../store/currencyExchange";
import { mapWritableState, mapActions } from "pinia";
import axios from "axios";
import { currencies } from "./currencies";

export default {
  data() {
    return {
      currencies,
      flag: false,
    };
  },
  async mounted() {
    this.$cache.set("text", "hello", "today");
    this.getCurrency(this.selectFromCurrency.id);
    this.getCurrency(this.selectToCurrency.id);
  },
  watch: {
    async selectFromCurrency(newV) {
      if (this.flag) return;
      await this.getCurrency(newV.id);
      this.toCurrencyRate();
    },
    async selectToCurrency(newV) {
      if (this.flag) return;
      await this.getCurrency(newV.id);
      
      this.fromCurrencyRate();
    },
  },
  computed: {
    ...mapWritableState(currencyExchange, [
      "currencyRateList",
      "fromCurrency",
      "toCurrency",
      "selectFromCurrency",
      "selectToCurrency",
      "fromRate",
      "toRate",
    ]),
  },
  methods: {
    ...mapActions(currencyExchange, ["fromCurrencyRate", "toCurrencyRate"]),
    getDate() {
      return dayjs().format("YYYY-MM-DD");
    },
    swap() {
      this.flag = true;
      [this.fromCurrency, this.toCurrency] = [
        this.toCurrency,
        this.fromCurrency,
      ];
      [this.selectFromCurrency, this.selectToCurrency] = [
        this.selectToCurrency,
        this.selectFromCurrency,
      ];
      setTimeout(() => {
        this.flag = false;
      }, 1000);
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
  },
};
</script>

<style lang="scss" scoped></style>
