import{_ as t,i as e,P as a,I as s,Q as i,B as n,y as o,O as l,d as c,o as d,e as p,c as r,l as u,z as m,n as v,a as f,j as b,F as x,H as h,p as k,b as y,h as S,K as g}from"./index-db680bea.js";import{_}from"./ContentLayout-c62d6e33.js";/* empty css              */const w=e({mounted(){window.$ipc.on("updateSpecificItem",((t,e)=>{a().UPDATE_SPECIFIC_ITEM(e.name,e.value)}))},components:{ContentLayout:_},data:()=>({active:0,value:0}),computed:{...s(a,["otherStatus"])},methods:{block(t){this.value=t,this.active=t,window.$ipc.send("blockSelect",t),i.success("设置成功")}},setup(){const{proxy:t}=h();return{interceptList:[{id:0,title:"无拦截",icon:"risk"},{id:1,title:"拦截第三方广告和追踪",icon:"safe"},{id:2,title:"拦截所有追踪和广告",icon:"safety"}],nextStep:()=>{l.push({name:"personalise"}),t.$eventBus.emit("nextStep","personalise"),window.$ipc.send("adBlockingState")},lastStep:()=>{l.push({name:"migration"}),t.$eventBus.emit("nextStep","migration")}}}}),C=t=>(k("data-v-7b84fb3b"),t=t(),y(),t),I={class:"ad-main flex flex-direction justify-between align-center"},j={class:"ad-title"},B=C((()=>p("span",{class:"title-first"},"追踪和广告拦截",-1))),L=C((()=>p("span",{class:"title-second"},"选择您的默认保护级别",-1))),$={key:0,class:"title-third"},z={class:"ad-content"},E=["onClick"],P={class:"ad-content-list-title"},F={class:"ad-bottom"},T=S("下一步"),A=S("上一步");var D=t(w,[["render",function(t,e,a,s,i,l){const h=c("SvgIcon"),k=g,y=_;return d(),n(y,{height:504},{default:o((()=>[p("div",I,[p("div",j,[B,L,1===t.value||2===t.value?(d(),r("span",$,"（如果您遇到部分网站显示出现问题，请关闭广告拦截并刷新页面）")):u("",!0)]),p("div",z,[(d(!0),r(x,null,m(t.interceptList,((e,a)=>(d(),r("div",{class:v(["ad-content-list",{active:t.otherStatus.adBlockingLevel===a}]),onClick:e=>t.block(a),key:"id"},[f(h,{name:e.icon,class:"list-icon"},null,8,["name"]),p("span",P,b(e.title),1)],10,E)))),128))]),p("div",F,[f(k,{onClick:e[0]||(e[0]=e=>t.nextStep()),type:"primary",style:{width:"160px",height:"32px",color:"rgba(255, 255, 255, 1)","font-size":"14px","border-radius":"5px"}},{default:o((()=>[T])),_:1}),f(k,{onClick:e[1]||(e[1]=e=>t.lastStep()),type:"link",style:{"margin-top":"6px","font-size":"14px",color:"rgba(80, 139, 254, 1)"}},{default:o((()=>[A])),_:1})])])])),_:1})}],["__scopeId","data-v-7b84fb3b"]]);export{D as default};
