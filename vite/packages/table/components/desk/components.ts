import { defineAsyncComponent } from 'vue'
/**
 * 挂载相关组件
 */
import VueCustomScrollbar from '../../../../src/components/vue-scrollbar.vue'
import Vuuri from '../vuuriHome/Vuuri.vue'
// import CPULineChart from "../../apps/inspector/widget/CPULineChart.vue";
const CPULineChart = defineAsyncComponent(
  () => import('../../apps/inspector/widget/CPULineChart.vue')
)
// import CPUFourCard from "../../apps/inspector/widget/CPUFourCard.vue";
const CPUFourCard = defineAsyncComponent(
  () => import('../../apps/inspector/widget/CPUFourCard.vue')
)
import SmallGPUCard from "../../apps/inspector/widget/SmallGPUCard.vue";

// import InternalList from "../../apps/inspector/widget/InternalList.vue";
const InternalList = defineAsyncComponent(
  () => import('../../apps/inspector/widget/InternalList.vue')
)
// import SmallCPUCard from "../../apps/inspector/widget/SmallCPUCard.vue";
const SmallCPUCard = defineAsyncComponent(
  () => import('../../apps/inspector/widget/SmallCPUCard.vue')
)
// import GamesDiscount from "../widgets/games/GamesDiscount.vue";
const GamesDiscount = defineAsyncComponent(() => import('../widgets/games/GamesDiscount.vue'))
// import DiscountPercentage from "../widgets/games/DiscountPercentage.vue";
const DiscountPercentage = defineAsyncComponent(
  () => import('../widgets/games/DiscountPercentage.vue')
)
// import MiddleWallpaper from "../widgets/MiddleWallpaper.vue";
const MiddleWallpaper = defineAsyncComponent(() => import('../widgets/MiddleWallpaper.vue'))
// import SmallWallpaper from '../widgets/SmallWallpaper.vue'
const SmallWallpaper = defineAsyncComponent(() => import('../widgets/SmallWallpaper.vue'))
// import MyGameSmall from '../widgets/games/MyGameSmall.vue'
const MyGameSmall = defineAsyncComponent(() => import('../widgets/games/MyGameSmall.vue'))
// import Capture from '../widgets/games/Capture.vue'
const Capture = defineAsyncComponent(() => import('../widgets/games/Capture.vue'))
// import Voice from '../widgets/audio/Voice.vue'
const Voice = defineAsyncComponent(() => import('../widgets/audio/Voice.vue'))
// import Audio from '../widgets/audio/Audio.vue'
const Audio = defineAsyncComponent(() => import('../widgets/audio/Audio.vue'))
// import CaptureNewCard from '../widgets/games/CaptureNewCard.vue'
const CaptureNewCard = defineAsyncComponent(() => import('../widgets/games/CaptureNewCard.vue'))
// import Remote from '../widgets/custom/Remote.vue'
const Remote = defineAsyncComponent(() => import('../widgets/custom/Remote.vue'))
// import GameEpic from '../widgets/games/GameEpic.vue'
const GameEpic = defineAsyncComponent(() => import('../widgets/games/GameEpic.vue'))
// import CustomAssembly from '../widgets/custom/CustomAssembly.vue'
const CustomAssembly = defineAsyncComponent(() => import('../widgets/custom/CustomAssembly.vue'))
// import SignIn from '../widgets/SignIn.vue'
const SignIn = defineAsyncComponent(() => import('../widgets/SignIn.vue'))
// import SingleFilm from '../widgets/film/SingleFilm.vue'
const SingleFilm = defineAsyncComponent(() => import('../widgets/film/SingleFilm.vue'))
// import ManyFilm from '../widgets/film/ManyFilm.vue'
const ManyFilm = defineAsyncComponent(() => import('../widgets/film/ManyFilm.vue'))
// import SteamFriends from '../widgets/games/SteamFriends.vue'
const SteamFriends = defineAsyncComponent(() => import('../widgets/games/SteamFriends.vue'))
// import Weather from '../widgets/Weather.vue'
const Weather = defineAsyncComponent(() => import('../widgets/Weather.vue'))
// import Clocks from '../widgets/clock/index.vue'
const Clocks = defineAsyncComponent(() => import('../widgets/clock/index.vue'))
// import Timer from '../widgets/Timer.vue'
const Timer = defineAsyncComponent(() => import('../widgets/Timer.vue'))
// import Music from '../widgets/Music.vue'
const Music = defineAsyncComponent(() => import('../widgets/Music.vue'))
// import Stock from '../widgets/Stock.vue'
const Stock = defineAsyncComponent(() => import('../widgets/Stock.vue'))
// import Dou from '../widgets/Dou.vue'
const Dou = defineAsyncComponent(() => import('../widgets/Dou.vue'))
// import Fish from '../widgets/Fish.vue'
const Fish = defineAsyncComponent(() => import('../widgets/Fish.vue'))
// import CustomTimer from '../widgets/CustomTimer.vue'
const CustomTimer = defineAsyncComponent(() => import('../widgets/CustomTimer.vue'))
// import SmallCountdownDay from '../widgets/SmallCountdownDay.vue'
const SmallCountdownDay = defineAsyncComponent(() => import('../widgets/SmallCountdownDay.vue'))
// import Clock from '../widgets/Clock.vue'
const Clock = defineAsyncComponent(() => import('../widgets/Clock.vue'));

// import CountdownDay from '../widgets/CountdownDay.vue'
const CountdownDay = defineAsyncComponent(() => import('../widgets/CountdownDay.vue'));

// import Notes from '../widgets/note/index.vue'
const Notes = defineAsyncComponent(() => import('../widgets/note/index.vue'));

// import GameInformation from '../widgets/gameInformation/index.vue'
const GameInformation = defineAsyncComponent(() => import('../widgets/gameInformation/index.vue'));

// import HistoryInfo from '../widgets/historyInfo/index.vue'
const HistoryInfo = defineAsyncComponent(() => import('../widgets/historyInfo/index.vue'));

// import ShortcutKey from '../../apps/shortcutKey/widget/index.vue'
const ShortcutKey = defineAsyncComponent(() => import('../../apps/shortcutKey/widget/index.vue'));

// import ClipBoard from '../widgets/clipBoard/index.vue'
const ClipBoard = defineAsyncComponent(() => import('../widgets/clipBoard/index.vue'));

// import Guider from '../widgets/shortTalk/page/Guider.vue'
const Guider = defineAsyncComponent(() => import('../widgets/shortTalk/page/Guider.vue'));

// import ShortTodo from '../widgets/shortTalk/page/ShortTodo.vue'
const ShortTodo = defineAsyncComponent(() => import('../widgets/shortTalk/page/ShortTodo.vue'));

// import Dashboard from '../widgets/shortTalk/page/Dashboard.vue'
const Dashboard = defineAsyncComponent(() => import('../widgets/shortTalk/page/Dashboard.vue'));

// import ShortChart from '../widgets/shortTalk/page/ShortChart.vue'
const ShortChart = defineAsyncComponent(() => import('../widgets/shortTalk/page/ShortChart.vue'));

// import TimerChart from '../../apps/tomato/page/Chart.vue'
const TimerChart = defineAsyncComponent(() => import('../../apps/tomato/page/Chart.vue'));

// import TimerClock from '../../apps/tomato/page/Clock.vue'
const TimerClock = defineAsyncComponent(() => import('../../apps/tomato/page/Clock.vue'));




const NewAddCard = defineAsyncComponent(() => import('../../page/app/card/NewAddCard.vue'))
// import MyIcons from "../widgets/myIcons/index.vue";
const MyIcons = defineAsyncComponent(() => import('../widgets/myIcons/index.vue'))
import AggregateSearch from '../widgets/aggregate/AggregateSearch.vue'
import AggregateSearchFullScreen from '../widgets/aggregate/AggregateSearchFullScreen.vue'
import GameStrategy from '../widgets/games/GameStrategy.vue'


// import HorizontalPanel from '../HorizontalPanel.vue'
// import News from '../widgets/news/NewsCard.vue'
const News = defineAsyncComponent(() => import('../widgets/news/NewsCard.vue'))
// import Template from '../../../user/pages/Template.vue'
const Template = defineAsyncComponent(() => import('../../../user/pages/Template.vue'))
// import SmallRank from '../widgets/SmallRank.vue'
const SmallRank = defineAsyncComponent(() => import('../widgets/SmallRank.vue'))
// import Todo from '../widgets/todo/Todo.vue'
const Todo = defineAsyncComponent(() => import('../widgets/todo/Todo.vue'))
// import EatToday from '../widgets/eat/EatToday.vue'
const EatToday = defineAsyncComponent(() => import('../widgets/eat/EatToday.vue'))
// import HotSearch from '../widgets/HotSearch.vue'
const HotSearch = defineAsyncComponent(() => import('../widgets/HotSearch.vue'))
// import AIaides from '../widgets/AIaides.vue'
const AIaides = defineAsyncComponent(() => import('../widgets/AIaides.vue'))
// import OilPrices from '../widgets/OilPrices.vue'
const OilPrices = defineAsyncComponent(() => import('../widgets/OilPrices.vue'))
// import yuanCommunity from '../widgets/yuanCommunity/YuanCommunity.vue'
const yuanCommunity = defineAsyncComponent(
  () => import('../widgets/yuanCommunity/YuanCommunity.vue')
)
// import Courier from '../widgets/courier/Courier.vue'
const Courier = defineAsyncComponent(() => import('../widgets/courier/Courier.vue'))

import FreeLayoutScrollbar from "./freeLayout/Scrollbar.vue";
// const FreeLayoutScrollbar = defineAsyncComponent(() => import('./freeLayout/Scrollbar.vue'))
import FreeLayoutContainer from "./freeLayout/Container.vue";
// const FreeLayoutContainer = defineAsyncComponent(() => import('./freeLayout/Container.vue'))
import FreeLayoutState from "./freeLayout/State.vue";
// const FreeLayoutState = defineAsyncComponent(() => import('./freeLayout/State.vue'))
import FreeLayoutCanvas from "./freeLayout/Canvas.vue"
// const FreeLayoutCanvas = defineAsyncComponent(() => import('./freeLayout/Canvas.vue'))
import FloatMenu from "./floatMenu/FloatMenu.vue";
// const FloatMenu = defineAsyncComponent(() => import('./floatMenu/FloatMenu.vue'))
// import Test from "../widgets/test/index.vue";
const Test = defineAsyncComponent(() => import('../widgets/test/index.vue'))

// import Folder from "../../apps/folder";
const Folder = defineAsyncComponent(() => import('../../apps/folder'))
export default {
  components: {
    Test,
    Folder,
    FreeLayoutScrollbar,
    FloatMenu,
    FreeLayoutContainer,
    FreeLayoutCanvas,
    FreeLayoutState,
    GameInformation,
    HistoryInfo,
    ShortcutKey,
    ClipBoard,
    Guider,
    ShortTodo,
    Dashboard,
    ShortChart,
    TimerChart,
    TimerClock,
    News,
    Template,
    // HorizontalPanel,
    VueCustomScrollbar,
    Vuuri,
    CPUFourCard,
    CPULineChart,
    InternalList,
    SmallCPUCard,
    SmallGPUCard,
    DiscountPercentage,
    GamesDiscount,
    GameEpic,
    Music,
    Stock,
    Dou,
    Fish,
    CustomTimer,
    SmallCountdownDay,
    Clock,
    CountdownDay,
    Timer,
    Weather,
    SteamFriends,
    Remote,
    SignIn,
    SingleFilm,
    ManyFilm,
    CaptureNewCard,
    Voice,
    Audio,
    Capture,
    CustomAssembly,
    MyGameSmall,
    SmallWallpaper,
    MiddleWallpaper,
    NewAddCard,
    Clocks,
    Notes,
    GameStrategy,
    AggregateSearch,
    AggregateSearchFullScreen,
    MyIcons,
    SmallRank,
    Todo,
    EatToday,
    HotSearch,
    AIaides,
    OilPrices,
    yuanCommunity,
    Courier
  }
}
