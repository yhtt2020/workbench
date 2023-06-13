import {createRouter, createWebHashHistory} from "vue-router";
import routes from "./route/route";
import {cardStore} from "./store/card";

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to,from,next) =>{
  if(from.name==='home'){
    document.body.style.setProperty('--backGroundImgBlur',  '12px');
    document.body.style.setProperty('--backGroundImgLight', 0.3);
  }
  cardStore().setRouteParams(to.params)
  next()
})

export {router}
