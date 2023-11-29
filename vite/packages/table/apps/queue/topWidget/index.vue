<template>
  <div class="flex" v-if="queue.length>0 || show">
    <xt-button   :w="80" :h="28" @click="showModal=!showModal">
      <div class="flex">
        <xt-new-icon icon="fluent-emoji:hourglass-not-done"></xt-new-icon>
        {{ queue.length }}
      </div>
    </xt-button>
  </div>
  <Modal v-if="showModal" v-model:visible="showModal">
    <div class="p-10" style="width:800px;height:600px">
      <div>
        <span class="xt-text">后台任务</span> <span class="xt-text-2">{{ queue.length }}</span>
        <div class="float-right">
          <xt-button @click="run" v-if="!isRunning" size="mini" :w="100" :h="30">启动</xt-button>
          <xt-button @click="pause" v-else size="mini" :w="100" :h="30">暂停</xt-button>
        </div>
      </div>
      <div class="mb-2" style="height:200px">
        <XtScrollbar :y="true">
          <div class="p-2">
            <div class="task-item px-4 py-2 mb-2 flex" v-for="task in queue">
              <xt-new-icon v-if="task.processing" icon="fluent:play-circle-16-filled" class="mr-1"></xt-new-icon>
              <xt-new-icon v-else icon="fluent-mdl2:clock" class="mr-1"></xt-new-icon>
              {{ task.name }}
            </div>
          </div>
        </XtScrollbar>

      </div>

      <div>
        运行日志：
      </div>
      <div style="height:200px">
        <XtScrollbar :y="true">
          <div class="p-2">
            <div class="log-item px-4 py-2 mb-2 flex" v-for="log in logs">
              <a-tag :color="getColor(log.type)">
                {{log.type}}
              </a-tag>{{ friendlyDate(log.createTime) }} {{ log.content }}
            </div>
          </div>
        </XtScrollbar>
      </div>

    </div>
  </Modal>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {queueStore} from "../store";
import {mapState, mapActions} from "pinia";
import Modal from "../../../components/Modal.vue";

export default {
  name: "index",
  components: {Modal},
  props:{
    show:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      showModal: false,
    }
  },
  computed: {
    ...mapState(queueStore, ['queue', 'logs', 'isRunning'])
  },
  methods: {
    ...mapActions(queueStore, ['pause','run']),
    friendlyDate(date) {
      return tsbApi.util.friendlyDate(date)
    },
    getColor(type){
      switch (type) {
        case 'error':
          return 'red'
        case 'info':
          return 'blue'
      }
    }

  }
}
</script>


<style scoped lang="scss">
.task-item ,.log-item{
  background: var(--secondary-bg);
  border-radius: 8px;
  align-items: flex-start
}
</style>
