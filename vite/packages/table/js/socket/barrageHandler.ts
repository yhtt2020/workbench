import {barrageService} from "../service/barrageService";

export const barrageHandler={
  on({event,data}){
    switch (event){
      case 'add':
        window.$manager.send(barrageService.filterBarrages([data]))//进行前置过滤
        window.$manager.start()
    }
  }
}
