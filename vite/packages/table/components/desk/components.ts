import { defineAsyncComponent } from "vue";

import Vuuri from "../vuuriHome/Vuuri.vue";
import CPULineChart from "../widgets/supervisory/CPULineChart.vue";
import CPUFourCard from "../widgets/supervisory/CPUFourCard.vue";
import InternalList from "../widgets/supervisory/InternalList.vue";
import SmallCPUCard from "../widgets/supervisory/SmallCPUCard.vue";
import SmallGPUCard from "../widgets/supervisory/SmallGPUCard.vue";
import GamesDiscount from "../widgets/games/GamesDiscount.vue";
import DiscountPercentage from "../widgets/games/DiscountPercentage.vue";
import MiddleWallpaper from "../widgets/MiddleWallpaper.vue";
import SmallWallpaper from "../widgets/SmallWallpaper.vue";
import MyGameSmall from "../widgets/games/MyGameSmall.vue";
import Capture from "../widgets/games/Capture.vue";
import Voice from "../widgets/games/Voice.vue";
import Audio from "../widgets/games/Audio.vue";
import CaptureNewCard from "../widgets/games/CaptureNewCard.vue";
import Remote from "../widgets/custom/Remote.vue";
import GameEpic from "../widgets/games/GameEpic.vue";
import CustomAssembly from "../widgets/custom/CustomAssembly.vue";
import SignIn from "../widgets/SignIn.vue";
import SingleFilm from "../widgets/film/SingleFilm.vue";
import ManyFilm from "../widgets/film/ManyFilm.vue";
import SteamFriends from "../widgets/games/SteamFriends.vue";
import Weather from "../widgets/Weather.vue";
import Clocks from "../widgets/clock/index.vue";
import Timer from "../widgets/Timer.vue";
import Music from "../widgets/Music.vue";
import Stock from "../widgets/Stock.vue";
import Dou from "../widgets/Dou.vue";
import Fish from "../widgets/Fish.vue";
import CustomTimer from "../widgets/CustomTimer.vue";
import SmallCountdownDay from "../widgets/SmallCountdownDay.vue";
import Clock from "../widgets/Clock.vue";
import CountdownDay from "../widgets/CountdownDay.vue";
import Notes from "../widgets/note/index.vue";
import GameInformation from "../widgets/gameInformation/index.vue";
import HistoryInfo from "../widgets/historyInfo/index.vue";
import ShortcutKey from "../../apps/shortcutKey/widget/index.vue";
import ClipBoard from "../widgets/clipBoard/index.vue";

import Guider from "../widgets/shortTalk/page/Guider.vue";
import ShortTodo from "../widgets/shortTalk/page/ShortTodo.vue";
import Dashboard from "../widgets/shortTalk/page/Dashboard.vue";
import ShortChart from "../widgets/shortTalk/page/ShortChart.vue";

import TimerChart from "../../apps/tomato/page/Chart.vue";
import TimerClock from "../../apps/tomato/page/Clock.vue";

const NewAddCard = defineAsyncComponent(
  () => import("../../page/app/card/NewAddCard.vue")
);
import MyIcons from "../widgets/myIcons/index.vue";
import AggregateSearch from "../widgets/aggregate/AggregateSearch.vue";
import AggregateSearchFullScreen from "../widgets/aggregate/AggregateSearchFullScreen.vue";
import GameStrategy from "../widgets/games/GameStrategy.vue";

import VueCustomScrollbar from "../../../../src/components/vue-scrollbar.vue";
import HorizontalPanel from "../HorizontalPanel.vue";
import AddIcon from "../../page/app/addIcon/index.vue";
import News from "../widgets/news/NewsCard.vue";
import Template from "../../../user/pages/Template.vue";
import SmallRank from "../widgets/SmallRank.vue";
import Todo from "../widgets/todo/Todo.vue";
import EatToday from "../widgets/eat/EatToday.vue";
import HotSearch from "../widgets/HotSearch.vue";
import CoolWidget from "../card/CoolWidget.vue";
import AIaides from "../widgets/AIaides.vue";
import OilPrices from "../widgets/OilPrices.vue";
import yuanCommunity from "../widgets/yuanCommunity/YuanCommunity.vue";
import RightMenu from "./RightMenu.vue";
import Courier from "../widgets/courier/Courier.vue";

import FreeLayoutScrollbar from "./freeLayout/Scrollbar.vue";
import FreeLayoutContainer from "./freeLayout/Container.vue";
import FreeLayoutState from "./freeLayout/State.vue";
export default {
  components: {
    FreeLayoutScrollbar,
    FreeLayoutContainer,
    FreeLayoutState,
    RightMenu,
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
    HorizontalPanel,
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
    AddIcon,
    SmallRank,
    Todo,
    EatToday,
    HotSearch,
    AIaides,
    OilPrices,
    yuanCommunity,
    Courier,
  },
};
