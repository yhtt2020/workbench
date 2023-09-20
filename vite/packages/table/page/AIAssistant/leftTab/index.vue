<template>
  <!-- -->
  <xt-left-menu :list="test" last="1" end="1">
    <template #test> 123 </template>
    <template #test1> test1 </template>
    <div>
      <xt-button @click="a = !a"></xt-button>
      {{ test }}
    </div>
  </xt-left-menu>
</template>

<script>
export default {
  computed: {
    test() {
      return [
        {
          icon: "message",
          float: this.a ? "test" : '',
        },
        {
          icon: "message",
          float: this.a ? "test1" : false,
        },
      ];
    },
  },
  data() {
    return {
      a: true,
    };
  },
};
</script>
<style lang="scss" scoped></style>
