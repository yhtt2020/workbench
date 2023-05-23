import {defineStore} from "pinia";
import {setSupervisoryData} from '../js/action/supervisory'
declare interface IDisplayData {
  useGPU: number,
  useCPU: number,
  useMemory: number,
  FPS: number,
  down: number,
  up: number
}

const readAida64 = window.readAida64
const {rpc}=window.$models
export const inspectorStore = defineStore(
  "inspectorStore",
  {
    state: () => {

      return {
        running:false,
        dataSource: 'aida',//aida 或者 python 默认aida
        displayData: {
          useGPU: 0,
          useCPU: 0,
          useMemory: 0,
          FPS: 0,
          down: 0,
          up: 0
        } as IDisplayData,
        inspectorTimer: null,//定时器
      }
    },
    actions: {
      setDisplayData(value: IDisplayData) {
        this.displayData = value;
      },
      setDisplayValue(key, value) {
        this.displayData[key] = value
      },
      startInspect() {
        if(this.runing){
          return
        }
        this.running=true
        if (this.dataSource === 'aida') {
          this.setupAida()
        } else {
          this.setupPython() //todo 还需手动开启
        }
      },
      setupPython() {
        //todo 运行python脚本
        console.log('启动python数据源')
        this.inspectorTimer = setInterval(async () => {
          let fps = await rpc.inspector.getFPS()
          this.setDisplayValue('FPS', {value: fps})
        }, 2000)
      },
      setupAida() {
        //根据当前选择数据源，启动定时器
        this.inspectorTimer = setInterval(() => {
          readAida64()
            .then((res) => {
              this.runAida64 = true;
              const newData = setSupervisoryData(res);
              this.setDisplayData(newData);
              // console.log(res)
              //this.data=JSON.stringify(res, null, '\t')
            })
            .catch((err) => {
              this.runAida64 = false;
              clearInterval(this.inspectorTimer);
              this.reserveTimer = setInterval(() => {
                readAida64()
                  .then((res) => {
                    this.runAida64 = true;
                    clearInterval(this.reserveTimer);
                    this.startAida();
                  })
                  .catch((err) => {
                  });
              }, 10000);
              const newData = setSupervisoryData(undefined);
              this.setDisplayData(newData);
            });
        }, 1000);
      },
      stopInspect() {
        //终止定时器
        if (this.inspectorTimer) {
          clearInterval(this.inspectorTimer);
          this.running=false
        }
      }
    }
  }
)
