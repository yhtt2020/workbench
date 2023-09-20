<template>
  <!-- -->
  <xt-left-menu :list="test" last="2" end="2">
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
          float: this.a ? "test" : "",
        },
        {
          icon: "message",
          children: [
            {
              icon: "message",
              name: "test1",
            },
            {
              icon: "message",
              name: "test2",
            },
            {
              icon: "message",
              name: "test3",
            },
          ],
        },
        {
          flag: true,
          icon: "tianjia2",
        },
        {
          full: true,
        },
        {
          icon: "message",
          children: [
            {
              icon: "message",
              name: "test",
            },
          ],
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
