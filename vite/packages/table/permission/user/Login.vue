<template>
  <!-- 蒙版 -->
  <Transition name="fade">
    <div
      v-if="loginVisible"
      class="w-full h-full fixed top-0 left-0 xt-mask"
      :style="{
        'z-index': 99999,
      }"
    ></div>
  </Transition>
  <div
    class="overflow-hidden fixed -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2 no-drag"
    style="
      height: 745px;
      border-radius: 18px;
      overflow: hidden;
      z-index: 999999999999999999999999;
      background: #fff;
    "
    v-if="loginVisible"
  >
    <iframe
      ref="iframe"
      id="myFrame"
      @load="newLogin"
      boxClass=""
      src="https://s.apps.vip/login?response_type=code&client_id=10001&state=1"
      width="700"
      height="745"
    ></iframe>
    <div class="absolute" style="top: 20px; right: 20px; z-index: 99999">
      <xt-button @click="loginClose" w="48" style="background: #337fff">
        <xt-ify-icon icon="fluent:dismiss-16-regular" style="color: #fff" />
      </xt-button>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import cache from "../../components/card/hooks/cache";
import { useUserPermit } from "./useUserPermit";
import XtButton from "../../ui/libs/Button/index.vue";
import XtIfyIcon from "../../ui/new/IfyIcon/index";
import { usePermissionStore } from "../store";
import { storeToRefs } from "pinia";
const permissionStore = usePermissionStore();
const { token } = storeToRefs(permissionStore);
const loginVisible = ref(true);
const router = useRouter();
const { proxy } = getCurrentInstance();
import { useGlobalStore } from "../../apps/global/store";

const globalStore = useGlobalStore();
const props = defineProps({
  close: {},
  cb: {},
});

onMounted(() => {
  window.addEventListener(
    "message",
    async (event) => {
      let currentToken = event?.data?.data?.token;
      // 拿到token
      if (currentToken) {
        console.log("token :>> ", currentToken);
        cache.set("ttUserToken", currentToken);
        token.value = currentToken;
        await useUserPermit();
        loginVisible.value = false;
        props.cb && props.cb();
        globalStore.loginVisible = false;
        props.close && props.close();
      }
    },
    false
  );
});
const emits = defineEmits(["close"]);

const loginClose = () => {
  loginVisible.value = false;
  globalStore.loginVisible = false;
  props?.close && props.close();

  emits("close");
};
</script>

<style lang="scss" scoped>
iframe {
  border: none;
}
</style>
