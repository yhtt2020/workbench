<template>
  <a-tree
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
    :tree-data="treeData"
  >
    <template #title="{ title, key }">
      <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
const treeData = [{
  title: '常用收藏',
  key: '0-0',
  children: [{
    title: '产品经理',
    key: '0-0-0',
    disabled: true,
    children: [{
      title: '产品设计',
      key: '0-0-0-0',
      disableCheckbox: true,
    }, {
      title: '产品战略',
      key: '0-0-0-1',
    }],
  }, {
    title: '运营素材',
    key: '0-0-1',
    children: [{
      key: '0-0-1-0',
      title: '常用头像',
    }],
  }],
}];
export default defineComponent({
  name:'TreeList',
  setup() {
    const expandedKeys = ref(['0-0-0', '0-0-1']);
    const selectedKeys = ref(['0-0-0', '0-0-1']);
    watch(expandedKeys, () => {
      console.log('expandedKeys', expandedKeys);
    });
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys);
    });
    return {
      treeData,
      expandedKeys,
      selectedKeys,
    };
  },

});
</script>
