<template><div>222</div></template>

<script setup>
import QRCode from "qrcode";

QRCode.toDataURL('https://www.free-api.com/?page=6')
  .then((url) => {
    console.log(url);
  })
  .catch((err) => {
    console.error(err);
  });
</script>

<style lang="scss" scoped></style>
