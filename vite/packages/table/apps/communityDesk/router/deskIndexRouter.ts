// @ts-ignore
import CommunityGroupDesk from "../page/CommunityGroupDesk.vue";

export default {
  path:'/communityDesktop',
  redirect:'/communitydesktop/:no',
  children:[
   {
    path:'/communitydesktop/:no',
    name:'CommunityGroupDesk',
    component:CommunityGroupDesk,
   }
  ]
}