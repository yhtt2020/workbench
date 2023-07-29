<template>
  <div>
    <XtButton @click="convertQRCode()">123</XtButton>
    <div id="qrcode"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
    };
  },
  methods: {
    convertQRCode() {},
  },
};
</script>

<style lang="scss" scoped></style>
