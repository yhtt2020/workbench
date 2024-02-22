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
    class="overflow-hidden fixed -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2"
    style="
      height: 745px;
      border-radius: 18px;
      overflow: hidden;
      z-index: 999999999999999999999999;
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
  </div>
  <div
    v-if="loginVisible"
    class="overflow-hidden fixed -translate-x-1/2 left-1/2 cursor-pointer no-drag"
    style="bottom: 30px; z-index: 999999999999999999999999"
    @click="loginClose"
  >
    <xt-button type="theme"> 返回</xt-button>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import cache from "../../components/card/hooks/cache";
import { useUserPermit } from "./useUserPermit";
import XtButton from "../../ui/libs/Button/index.vue";
const loginVisible = ref(true);
const router = useRouter();
const { proxy } = getCurrentInstance();

const props = defineProps({
  close: {},
  cb: {},
});

onMounted(() => {
  console.log("props.close :>> ", props.close);
  console.log("111 login 触发了 :>> ", 111);
  window.addEventListener(
    "message",
    async (event) => {
      let token = event?.data?.data?.token;
      // 拿到token
      if (token) {
        console.log("token :>> ", token);
        cache.set("ttUserToken", token);
        useUserPermit();
        // router.push({ name: "home" })
        loginVisible.value = false;

        cache.set("isGuest", false);

        props.cb && props.cb();
        props.close && props.close();

      }
    },
    false
  );
});
const emits = defineEmits(["close"]);

const loginClose = () => {
  loginVisible.value = false;
  props.close.value && props.close();

  emits("close");
};
</script>

<style lang="scss" scoped>
iframe {
  border: none;
}
</style>
