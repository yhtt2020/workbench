<script lang="ts">
import { IListInfo } from "../interfaces";
import dayjs from "dayjs";
import { mapActions, mapState } from "pinia";
import { listStore } from "../stores/list";
import { OrderedListOutlined } from "@ant-design/icons-vue";
export default {
  name: "ListList",
  props: {
    data: [] as IListInfo[],
  },
  components: {
    OrderedListOutlined,
  },
  data() {
    return {
      ellipsis: {
        rows: 1,
      },
    };
  },
  computed: {
    ...mapState(listStore, ["activeList"]),
  },
  methods: {
    ...mapActions(listStore, {
      removeList: "remove",
      setActiveList: "setActiveList",
    }),
  },
};
</script>

<template>
  <div class="nav-items">
    <a-dropdown :trigger="['contextmenu']" v-for="list in data">
      <div class="item"
        :title="list.title"
        :class="{ active: list === activeList }"
        @click="setActiveList(list)"
      >
        <div class="nav-wrapper">
          <div class="flex items-center">
            <Icon icon="detail" style="color:var(--secondary-text);font-size:20px"></Icon>
            <div
              style="
                flex: auto;
                text-wrap: normal;
                word-break: break-all;
                width: 0;
                margin-left:10px;
              "
            >
              <div
                :class="{ completed: list.completed }"
                class="flex justify-between"
              >
                <span class="truncate" style="">{{ list.title }} </span>
                <span>{{
                  list.count > 0 ? list.count : ""
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="removeList(list.nanoid)">删除</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>
<style scoped lang="scss">
.nav-items {
  font-size: 12px;

  .nav-wrapper {
    padding-bottom: 2px;
    padding-top: 2px;
    padding-left: 3px;
    padding-right: 3px;
  }
}
</style>
