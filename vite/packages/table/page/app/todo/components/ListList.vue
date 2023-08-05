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
        <span class="pointer" @click="removeList(list.nanoid)">
          <a-menu theme="dark" class="del-btn">
            <a-menu-item class="xt-text">删除</a-menu-item>
          </a-menu>
        </span>
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
.del-btn{
  width: 120px;
  height:60px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--secondary-bg) !important;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
  font-size: 16px;
}
.del-btn:hover{
  opacity: 0.8;
}
</style>
