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

<template>
  <TUIContact></TUIContact>
</template>

<style scoped lang="scss">

</style>
