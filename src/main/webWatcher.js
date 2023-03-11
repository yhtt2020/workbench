
global.watchTasks=[]
class Watcher {
  tasks //任务
  init(){

  }

  /**
   * 测试监控，目标是尝试执行一次测试抓取数据包，并回传给小助手。
   * @param manager
   * @param id
   * @param url
   * @param watcherFile
   */
  testWatch(manager,id,url,watcherFile){

  }

  /**
   * 增加一个监控任务
   * @param manager
   * @param id
   * @param url
   * @param watcherFile
   */
  addTask(manager,id,url,watcherFile){

    //启动一个看不见的browserView，并载入公共的preload，在preload里加载对应watcher
    //添加到任务队列当中
    // watcher准备完毕，并拉取队列任务
    //

  }

  /**
   * 启动任务
   */
  startTask(){

  }
}
