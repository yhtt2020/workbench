const userAgent = window.navigator.userAgent;
const isXT = userAgent.indexOf("想天工作台") > -1;
const debug=true//开启这里的调试，会输出调试信息
let model: any = "";
if (isXT) {
  const { storageModel } = window.$models;
  model = storageModel;
} else {
  model = localStorage;
}

function getSign(): string {
  let href = window.location.href;
  if (href.startsWith("tsbapp://./")) {
    return "table.com";
  } else if (href.startsWith("http://localhost:1600")) {
    return "table.com";
  } else {
    let url = new URL(href);
    return url.hostname;
  }
}

const dbStorage: Storage = {
  async setItem(key: string, value: string) {
    const time=Date.now()
    model.setItem(key, value, getSign()).then(()=>{
      if(debug){
        if(!window.writeLog){
          window.writeLog=[]
        }
        window.writeLog.push({
          key,
          value,
          useTime:Date.now()-time+'ms',
          time:time
        })
      }
    });//异步写入，防止阻塞

  },
  async getItem(key: string): string | null | Promise<string> {
    const time=Date.now()
    //console.log('准备取数据',key,time)
    if(!window.readLog){
      window.readLog=[]
    }
    let record={
      id:time,
      key:key,
      time:time
    }
    window.readLog.push(record)
    let value = await model.getItem(key, getSign());
    if (!value) {
      try {
        value = localStorage.getItem(key);
      } catch (e) {
        console.warn("本地也没存储");
      }
    }
    if (!window.loadedStore) {
      window.loadedStore = {};
    }
    window.loadedStore[key] = true;
    if(debug){
      record.useTime=Date.now()-time+'ms'
      record.value=value
      console.log('加载',key,'完成')
    }
    return value;
  },
};

export default dbStorage;
