// 定义采集任务队列类
class Queue {
  queue=[]
  isRunning = false
  constructor() {
  }

  // 添加任务到采集任务队列
  add(func, delay) {
    this.queue.push({ func, delay });

    if (!this.isRunning) {
      this.run();
    }
  }

  // 执行采集任务队列中的任务
  run() {
    const task = this.queue.shift();

    if (task) {

      task.func();
      this.isRunning = true;

      setTimeout(() => {
        this.run();
      }, task.delay);
    } else {
      this.isRunning = false;
    }
  }
}


export default Queue
