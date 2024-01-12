<script lang="ts">
import {defineComponent} from 'vue'
import {mapWritableState, mapActions} from "pinia";
import {deviceStore} from "../deviceStore";

export default {
  name: "Remote",
  data() {
    return {
      myName: '',
      showOffline:false,
    }
  },
  computed: {
    ...mapWritableState(deviceStore, ['clients'])
  },
  mounted() {
    this.myName = tsbApi.runtime.client.name
    this.updateDeviceList()
  },
  methods: {
    ...mapActions(deviceStore, ['updateDeviceList'])
  }
}
</script>

<template>
  <div class="flex flex-col h-full">

    <div>
      {{ myName }}
    </div>
    <div>
      <a-checkbox v-model:checked="showOffline">显示离线设备</a-checkbox>
    </div>
    <div class="flex-1 h-0 flex">
      <div style="width: 400px">
        <xt-scrollbar :y="true" class="h-full w-full">
          <div v-for="client in clients">
            <a-row :gutter="[10,10]" v-if="client.status==='online' || showOffline">
              <a-col :span="6">
                <a-avatar :size="60">{{ client.name?.substring(0,1) }}</a-avatar>
              </a-col>
              <a-col :span="12">
                <div class="item-title">
                  <span class="xt-text font-16">{{ client.name }}</span> <span class="xt-text-2 font-12">{{client.clientId}}</span>
                </div>
                <div class="item-des xt-text-2">
                  <span v-if="client.os">{{ client.os }}</span><span v-else>未知</span>
                </div>
                <div class="item-des xt-text-2">
                  {{ client.ip }}
                </div>
                <div class="item-des xt-text-2">
                  <div v-if="client.status==='online'">
                    在线{{ client.keepOnlineTime.toFixed(1) }}小时
                  </div>
                  <div v-else>
                    已离线{{ client.keepOnlineTime.toFixed(1) }}小时
                  </div>
                </div>
              </a-col>
              <a-col :span="6">
                <xt-button :w="80" :h="40" v-if="client.status==='online'">连接</xt-button>
              </a-col>
            </a-row>
          </div>
        </xt-scrollbar>
      </div>


    </div>
  </div>
</template>

<style scoped lang="scss">
.item-title {
  font-size: 14px;
  font-weight: bold;
}

.item-des {
  font-size: 12px;
}
</style>
