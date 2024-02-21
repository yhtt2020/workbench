<template>
  <div>
    <XtView
      :title="false"
      type="popup"
      :showFull="false"
      v-model="loginVisible"
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
    </XtView>
    <xt-modal v-model="loginVisible" v-if="loginVisible" :mask="false"
      >123</xt-modal
    >
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import cache from "../../components/card/hooks/cache";
import { useUserPermit } from "../../permission/useUserPermit";
const loginVisible = ref(true);
const router = useRouter();
const { proxy } = getCurrentInstance();
// if (proxy.$useEuv()) {
//     webLogin.value = true;
//    }

onMounted(() => {
  window.addEventListener(
    "message",
    async (event) => {
      let token = event?.data?.data?.token;
      // 拿到token
      if (token) {
        console.log("token :>> ", token);
        cache.set("ttUserToken", token);
        router.replace({ name: "home" });
      }
    },
    false
  );
});
</script>

<style lang="scss" scoped></style>
