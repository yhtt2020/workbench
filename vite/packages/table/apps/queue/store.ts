import {defineStore} from "pinia";
// import Queue from "./queue";
//
// if (!window.$queue) {
//   window.$queue = new Queue()
// }
// @ts-ignore
export const queueStore = defineStore("queueStore", {
    state: () => ({
        queue: [],
        isRunning: false,//运行中
        logs: []//日志
      }
    ),

    actions: {
      /**
       * 添加任务到采集任务队列
       */
      add({name, func}, delay) {

        this.queue.push({name, func, delay});

        if (!this.isRunning) {
          this.run();
        }
      },

      /**
       *  执行采集任务队列中的任务
       */
      run() {
        const task = this.queue.shift();

        if (task) {
          this.log(tsbApi.util.friendlyDate(Date.now()) + '执行一个任务：'+ task.name);
          task.func();
          task.processing = true
          this.isRunning = true;

          setTimeout(() => {
            if (!this.isRunning) {
              return
            }
            this.run();
          }, task.delay);
        } else {
          this.isRunning = false;
        }
      },
      pause() {
        this.isRunning = false
      },
      log(content = '', type = 'info') {
        this.logs.unshift({
          type: type,
          content: content,
          createTime: Date.now()
        })
      }
    },
    // persist: {
    //   enabled: true,
    //   strategies: [
    //     {
    //       paths: [],
    //       storage: localStorage,
    //     }
    //   ]
    // },
  }
)
