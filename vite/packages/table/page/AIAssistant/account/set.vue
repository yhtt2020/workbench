<template>
  <div
    class="flex justify-between xt-bg items-center rounded-xl p-5"
    style="width: 572px; height: 83px"
  >
    <div class="flex-col">
      <div>OpenAI</div>
      <div class="xt-text-2">完成配置后即可查看可用余量。</div>
    </div>
    <div>
      <xt-button w="71" h="48" @click="setVisible = true">设置</xt-button>
    </div>
  </div>
  <xt-drawer v-model="setVisible" placement="right">
    <template #title>
      <XtTitle type="header"
        >设置
        <template #right>
          <XtButton @click="save()" text="保 存" type="theme" w="80"></XtButton>
        </template>
      </XtTitle>
    </template>
    <div class="flex flex-col">
      <xt-title m="mb">API 域名</xt-title>
      <xt-input style="height: 48px" v-model="currentUrl"></xt-input>
      <xt-title>API 密钥</xt-title>
      <xt-input style="height: 48px" v-model="currentKey"></xt-input>
    </div>
  </xt-drawer>
  <div v-if="state">余额 {{ money }}</div>
</template>

<script>
import { aiStore } from "../../../store/ai";
import { mapWritableState } from "pinia";
import { message } from "ant-design-vue";
import { balance } from "../service/api/ai";

export default {
  data() {
    return {
      setVisible: false,
      currentUrl: "",
      currentKey: "",
      money: "",
    };
  },
  mounted() {
    this.currentUrl = this.url;
    this.currentKey = this.key;
  },
  computed: {
    ...mapWritableState(aiStore, ["key", "url"]),
    state() {
      if (this.url && this.key) {
        this.getMoney();
        return true;
      }
      return false;
    },
  },
  methods: {
    save() {
      this.url = this.currentUrl;
      this.key = this.currentKey;
      message.success("保存成功");
      this.setVisible = false;
    },
    async getMoney() {
      let { total_available } = await balance();
      this.money = total_available;
    },
  },
};
</script>

<style lang="scss" scoped></style>
