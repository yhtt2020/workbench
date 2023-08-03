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
  <ul class="nav-items">
    <a-dropdown :trigger="['contextmenu']" v-for="list in data">
      <li
        :title="list.title"
        :class="{ active: list === activeList }"
        @click="setActiveList(list)"
      >
        <div class="nav-wrapper">
          <div style="display: flex">
            <div style="min-width: 20px">
              <ordered-list-outlined />
            </div>
            <div
              style="
                flex: auto;
                text-wrap: normal;
                word-break: break-all;
                width: 0;
              "
            >
              <div
                :class="{ completed: list.completed }"
                style="
                  word-break: break-all;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                "
              >
                <span>{{ list.title }} </span>
                <span style="float: right">{{
                  list.count > 0 ? list.count : ""
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </li>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="removeList(list.nanoid)">删除</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </ul>
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
