import { defineStore } from "pinia";
// @ts-ignore
export const currencyExchange = defineStore("currencyExchange", {
  state: () => ({
    currencyRateList: {},
    fromCurrency: "",
    toCurrency: "",
    selectFromCurrency: {
      name: "人民币",
      id: "CNY",
    },
    selectToCurrency: {
      name: "美元",
      id: "USD",
    },
  }),
  getters: {
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
        this.currencyRateList[this.selectToCurrency.id] &&
        this.currencyRateList[this.selectToCurrency.id][
          this.selectFromCurrency.id
        ]
      );
    },
  },
  actions: {
    fromCurrencyRate() {
      this.toCurrency = this.fromCurrency * this.fromRate;
    },
    toCurrencyRate() {
      this.fromCurrency = this.toCurrency * this.toRate;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: [""],
        storage: localStorage,
      },
    ],
  },
});
