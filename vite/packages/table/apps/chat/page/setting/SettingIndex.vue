<!-- 社群设置页面主入口 -->
<template>
  <div class="w-full h-full px-4 pt-4">
    <xt-select-nav
      :navList="settingNavList"
      lw="128"
      v-model:selectItem="classItem"
      :enableRoute="true"
    >
      <template #rightContent>
        <div class="w-full px-4">
          <router-view />
        </div>
      </template>
    </xt-select-nav>
  </div>
</template>

<script setup>
import { ref } from "vue";

/**当前设置导航列表**/
const settingNavList = ref([
  {
    name: "community",
    cname: "社群设置",
    route: {
      name: "CommunitySetting",
    },
  },
  {
    name: "member",
    cname: "成员管理",
    route: {
      name: "CommunityMember",
    },
  },
  {
    name: "role",
    cname: "角色权限",
    route: {
      name: "RoleAuthority",
    },
  },
  {
    name: "more",
    cname: "更多设置",
    route: {
      name: "MoreSetting",
    },
  },
]);

/**当前选中状态**/
const classItem = ref({
  name: "community",
  cname: "社群设置",
  route: {
    name: "CommunitySetting",
  },
});
</script>

<style lang="scss" scoped>
</style>
