import { rejects } from "assert";

const userAgent = window.navigator.userAgent;
const isXT = userAgent.indexOf("想天工作台") > -1;
let model: any = "";
if (isXT) {
  const { storageModel } = window.$models;
  model = storageModel;
} else {
  model = localStorage;
}

function getSign(): string {
  let href = window.location.href;
  if (href.startsWith("tsbapp://./")) {
    return "table.com";
  } else if (href.startsWith("http://localhost:1600")) {
    return "table.com";
  } else {
    let url = new URL(href);
    return url.hostname;
  }
}

const dbStorage: Storage = {
  async setItem(key: string, value: string) {
    await model.setItem(key, value, getSign());
  },
  async getItem(key: string): string | null | Promise<string> {
    let value = await model.getItem(key, getSign());
    if (!value) {
      try {
        value = localStorage.getItem(key);
      } catch (e) {
        console.warn("本地也没存储");
      }
    }
    if (!window.loadedStore) {
      window.loadedStore = {};
    }
    window.loadedStore[key] = true;
    return value;
  },
};

export default dbStorage;
