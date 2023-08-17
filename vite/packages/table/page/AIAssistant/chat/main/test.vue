<template>
  <xt-view type="popup" title="标题" v-model:visible="viewVisible" spacing="4">
    <div style="width: 400px; height: 400px">默认内容</div>
  </xt-view>
  <xt-button @click="viewVisible = !viewVisible">viewVisible</xt-button>
</template>
<script>
export default {
  data() {
    return {
      viewVisible: true,
    };
  },
};
</script>
