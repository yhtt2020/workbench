<template>
  <div class="message-tip">
    <span v-if="hasCreateGroup(message?.text)">{{ `${message?.message.nick}创建群聊` }}</span>
    <span v-else>{{ message?.text }}</span>
  </div>
</template>

<script>
import { defineComponent, watchEffect, reactive, toRefs } from 'vue';

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const data = reactive({
      message: {},
    });

    watchEffect(() => {
      data.message = props.data;
    });

    const hasCreateGroup = (text) =>{
      return text.includes('创建')
    }

    return {
      ...toRefs(data),hasCreateGroup
    };
  },
});
</script>
<style lang="scss" scoped>
@import url('../../../styles/common.scss');
@import url('../../../styles/icon.scss');
.message-tip {
  margin: 0 auto;
  color: var(--secondary-text);
  font-size: 12px;
  width: -webkit-fill-available;
  overflow-wrap: anywhere;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  text-align: center;
}
</style>
