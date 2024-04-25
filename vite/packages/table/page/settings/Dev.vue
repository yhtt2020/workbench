<template>
  <xt-scrollbar :y="true" class="w-full h-full">
    <xt-option-box>
      <xt-option-info
        title="开发者模式"
        info="开发者模式仅用于开发者调试工作台使用。开启后，可能导致软件不稳定，请谨慎操作。"
        isSwitch
        v-model:switch="settings.enableDev"
      />
    </xt-option-box>
    <template v-if="settings.enableDev">
      <div class="line">
        <xt-button @click="openDevTool" :w="140" :h="40" type="theme"
          >打开开发者工具</xt-button
        >
      </div>
      <div class="line">
        <xt-button @click="openAppCenter" :w="140" :h="40" type="theme"
          >打开新版应用中心</xt-button
        >
      </div>
      <div class="line">
        <xt-button @click="exit" :w="140" :h="40" type="theme"
          >退出登录</xt-button
        >
      </div>
      <div class="line">
        <xt-button @click="getMemory">获取内存情况</xt-button>
      </div>
      <div>
        <table
          class="border-collapse table-auto w-full text-sm rounded-lg overflow-hidden"
        >
          <thead class="bg-white dark:bg-slate-800">
            <tr
              class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
              style="border-bottom: 1px solid #ccc"
            >
              <th>进程id</th>
              <th>类型</th>
              <th>优先级</th>
              <th>沙盒</th>
              <th>创建时间</th>
              <th>cpu</th>
              <th>内存</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800">
            <tr v-for="item in metrics" style="border-bottom: 1px solid #ccc">
              <td
                class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
              >
                {{ item.pid }}
              </td>
              <td
                class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
              >
                {{ item.type }}
              </td>
              <td
                class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
              >
                {{ item.integrityLevel }}
              </td>
              <td
                class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
              >
                {{ item.sandboxed }}
              </td>
              <td
                class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
              >
                {{ item.creationTime }}
              </td>
              <td
                class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
              >
                {{ (item.cpu.percentCPUUsage * 100).toFixed(2) }}%
              </td>
              <td
                class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
              >
                活动：<strong>{{
                  prettyDisplayBytes(item.memory.workingSetSize)
                }}</strong>
                独享：{{
                  prettyDisplayBytes(item.memory.privateBytes)
                }}
                峰值：{{ prettyDisplayBytes(item.memory.peakWorkingSetSize) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <StorageStats></StorageStats>
        </div>
      </div>
    </template>
  </xt-scrollbar>
</template>

<script>
import StorageStats from '../../apps/systemSet/page/develop/StorageStats.vue';
import ZoomUI from "../../components/comp/ZoomUI.vue";
import { appStore } from "../../store";
import { mapWritableState } from "pinia";
import { isMain } from "../../js/common/screenUtils";
import Template from "../../../user/pages/Template.vue";
import { useWidgetStore } from "../../components/card/store.ts";
import { message } from "ant-design-vue";
import { prettyDisplayBytes } from "../../js/action/supervisory";
import { useLogout } from "../../permission/user/useLogout";
import { useAppCenterStore } from "../../apps/appCenter/src/store";
export default {
  name: "Common",
  components: { Template, ZoomUI,  StorageStats},
  data() {
    return {
      trayOpen: "",
      showInTaskBar: false,
      rightMenuList: [
        {
          name: "下拉菜单",
          value: "follow",
        },
        {
          name: "抽屉菜单",
          value: "default",
        },
      ],
      metrics: [],
    };
  },
  computed: {
    ...mapWritableState(appStore, ["settings"]),
    ...mapWritableState(useWidgetStore, ["rightModel"]),
    ...mapWritableState(useAppCenterStore, ["visible"]),
    isMain,
  },
  methods: {
    openAppCenter() {
      this.visible = true;
    },
    exit() {
      useLogout();
    },
    friendlyDate() {},
    prettyDisplayBytes(val) {
      return prettyDisplayBytes(val * 1024);
    },
    openDevTool() {
      ipc.send("openDevTool");
    },

    async getMemory() {
      let rs = await ipc.sendSync("getAppMetrics");
      this.metrics = rs.sort((item1, item2) => {
        return item1.pid - item2.pid > 0 ? 1 : -1;
      });

      console.log(rs);
    },
  },
  async mounted() {
    if (this.$useDev()) return;
    this.trayOpen = (await tsbApi.settings.get("trayOpen")) || "table";
    let showInTaskBar = await tsbApi.settings.get("showInTaskBar");
    if (showInTaskBar === undefined) {
      this.showInTaskBar = true;
    } else {
      this.showInTaskBar = showInTaskBar;
    }
  },
  watch: {
    trayOpen: {
      handler: async (value) => {
        await tsbApi.settings.set("trayOpen", value);
      },
    },
    showInTaskBar: {
      handler: async (value) => {
        await tsbApi.settings.set("showInTaskBar", value);
      },
    },
  },
};
</script>

<style scoped>
.unfit {
  color: orangered;
}
</style>
