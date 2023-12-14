import DeckHome from "./DeckHome.vue";
import DeckAdd from "./DeckAdd.vue";
import DeckIndex from "./DeckIndex.vue";
export default [{
  path: "/deck",
  name: "deckIndex",
  component: DeckIndex,
  children: [
    {
      path: '',
      name: 'deck',
      component: DeckHome,
      meta:{
        tab1:'work',
        tab2:'deck'
      }
    },
    {
      path: "/add",
      name: 'deckAdd',
      component: DeckAdd
    }
  ]
}]
