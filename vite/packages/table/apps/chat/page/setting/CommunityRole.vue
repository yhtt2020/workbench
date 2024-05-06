<!-- 社群设置中角色权限管理页面 -->
<template>
  <div class="flex items-center justify-between mb-4" style="width: 452px">
    <span class="xt-font font-16 xt-text">角色权限(6)</span>
    <xt-button w="114" h="40" :radius="10" class="xt-bt-t-2" @click="addRole">
      <div class="flex items-center justify-center">
        <xt-ify-icon icon="fluent:add-16-regular" class="mr-2" size="20" />
        <span>添加角色</span>
      </div>
    </xt-button>
  </div>

  <div style="width: 452px" class="xt-bg-t-2 rounded-lg p-4 mb-3 flex flex-col">
    <span class="xt-font font-16 xt-text">角色权限说明</span>
    <span class="xt-text-2 font-14 xt-font">
      角色列表中，角色按照等级从高到低排序，可以通过拖拽来改变顺序。用户将使用其拥有的角色中最高等级的颜色。
    </span>
  </div>

  <div class="flex-1" style="height: calc(100vh-200px)">
    <xt-scrollbar :y="true" style="height: calc(100vh-150px)">
      <template v-for="item in roleList">
        <div
          style="width: 452px"
          class="flex justify-between items-center mb-3 xt-bg-t-2 rounded-lg px-4 py-3"
        >
          <span :style="{ color: `${item.color}` }" class="xt-font font-16">
            {{ item.name }}
          </span>
          <span class="xt-font xt-text-3 font-14">
            {{
              item.type === "custom"
                ? "自定义"
                : item.type === "built"
                ? "内置"
                : ""
            }}
          </span>
        </div>
      </template>
    </xt-scrollbar>
  </div>
</template>

<script setup>
import { ref } from "vue";

/**静态社群角色**/
const roleList = ref([
  {
    type: "built",
    name: "管理员",
    role: "Admin",
    color: "#508BFE",
  },
  {
    type: "custom",
    name: "组长",
    role: "TeamLeader",
    color: "#1ABC9C",
  },
  {
    type: "custom",
    name: "队长",
    role: "Captain",
    color: "#9B59B6",
  },
  {
    type: "custom",
    name: "团长",
    role: "Colonel",
    color: "#DC483A",
  },
  {
    type: "custom",
    name: "部长",
    role: "Minister",
    color: "#F1C40F",
  },
  {
    type: "custom",
    name: "酋长",
    role: "Chief",
    color: "#95A6A6",
  },
]);

/**添加角色事件**/
const addRole = () => {};
</script>

<style lang="scss" scoped>
</style>

