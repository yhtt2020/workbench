import {barrageService} from "../service/barrageService";

export const barrageHandler={
  on({event,data}){
    switch (event){
      case 'add':
        barrageService.send(data)
    }
  }
}
