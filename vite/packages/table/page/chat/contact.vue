<!-- 联系人页面 -->
<template>
  <div style="margin-top: -12px;height:100%;width: 100%;display: flex;flex-direction: column">
    <TUIContact style="height: 100%" :display-online-status="false"></TUIContact>
  </div>

</template>


<script lang="ts">
import {defineComponent} from 'vue'
import TUIContact from "../../TUIKit/TUIComponents/container/TUIContact/index.vue";
import TUIProfile from "../../TUIKit/TUIComponents/container/TUIProfile/index.vue";

export default defineComponent({
  name: "contact",
  components: {
    TUIProfile,
    TUIContact
    // TUIProfile,
    // TUIContact
  }
})
</script>

<style scoped lang="scss">

</style>
