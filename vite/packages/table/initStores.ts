/*加载其他状态*/
import {aiStore} from './store/ai'
import {appsStore} from './store/apps'
import {frameStore} from './store/avatarFrame'
import {browserStore} from "./store/browser";
import {captureStore} from "./store/capture";
import {cardStore} from "./store/card";
import {chatStore} from "./store/chat";
import {codeStore} from "./store/code";
import {comStore} from "./store/com";
import {countDownStore} from "./store/countDown";
import {deskStore} from "./store/desk";
import {filmStore} from "./store/douBan";
import {epicStore} from "./store/epicStore";
import {fishStore} from "./store/fish";
import {gameStrategyStore} from "./store/gameStrategyStore";
import {homeStore} from "./store/home";
import {inspectorStore} from "./store/inspector";
import {marketStore} from "./store/market";
import{myIcons} from "./store/myIcons";
import {navStore} from "./store/nav";
import{newsStore} from "./store/news";
import{paperStore} from "./store/paper";
import {rankStore} from "./store/rank";
import {screenStore} from "./store/screen";
import {steamStore} from "./store/steam";
import {steamUserStore} from "./store/steamUser";
import {teamStore} from "./store/team";
import {timerStore} from "./store/timer";
import{topClockSettingStore} from "./store/topClockSetting";
import {weatherStore} from "./store/weather";
import {workStore} from "./store/work";
import {yuanCommunityStore} from "./store/yuanCommunity";
/*加载其他状态end*/

function initStores(){
  aiStore()
  appsStore()
  frameStore()
  browserStore()
  captureStore()
  cardStore()
  chatStore()
  codeStore()
  comStore()
  countDownStore()
  deskStore()
  filmStore()
  epicStore()
  fishStore()
  gameStrategyStore()
  homeStore()
  inspectorStore()
  marketStore()
  myIcons()
  navStore()
  newsStore()
  paperStore()
  rankStore()
  screenStore()
  steamStore()
  steamUserStore()
  teamStore()
  timerStore()
  topClockSettingStore()
  weatherStore()
  workStore()
  yuanCommunityStore()
}
export default initStores
