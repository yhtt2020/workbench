import{_ as t}from"./ContentLayout-24322bf1.js";import{_ as e,i as a,B as s,y as i,O as n,d as l,o,e as c,c as d,l as p,z as r,n as u,a as f,j as m,F as v,H as x,p as y,b as h,h as k,K as b}from"./index-9340d8f8.js";/* empty css              */const g=a({components:{ContentLayout:t},data:()=>({active:0,value:0}),methods:{block(t){this.value=t,this.active=t,window.$ipc.send("blockSelect",t)}},setup(){const{proxy:t}=x();return{interceptList:[{id:0,title:"无拦截",icon:"risk"},{id:1,title:"拦截第三方广告和追踪",icon:"safe"},{id:2,title:"拦截所有追踪和广告",icon:"safety"}],nextStep:()=>{n.push({name:"personalise"}),t.$eventBus.emit("nextStep","personalise"),window.$ipc.send("adBlockingState")},lastStep:()=>{n.push({name:"migration"}),t.$eventBus.emit("nextStep","migration")}}}}),S=t=>(y("data-v-7d5d05fa"),t=t(),h(),t),_={class:"ad-main flex flex-direction justify-between align-center"},w={class:"ad-title"},C=S((()=>c("span",{class:"title-first"},"追踪和广告拦截",-1))),j=S((()=>c("span",{class:"title-second"},"选择您的默认保护级别",-1))),B={key:0,class:"title-third"},L={class:"ad-content"},$=["onClick"],z={class:"ad-content-list-title"},I={class:"ad-bottom"},F=k("下一步"),H=k("上一步");var K=e(g,[["render",function(e,a,n,x,y,h){const k=l("SvgIcon"),g=b,S=t;return o(),s(S,{height:504},{default:i((()=>[c("div",_,[c("div",w,[C,j,1===e.value||2===e.value?(o(),d("span",B,"（如果您遇到部分网站显示出现问题，请关闭广告拦截并刷新页面）")):p("",!0)]),c("div",L,[(o(!0),d(v,null,r(e.interceptList,((t,a)=>(o(),d("div",{class:u(["ad-content-list",e.active===a?"active":""]),onClick:t=>e.block(a),key:"id"},[f(k,{name:t.icon,class:"list-icon"},null,8,["name"]),c("span",z,m(t.title),1)],10,$)))),128))]),c("div",I,[f(g,{onClick:a[0]||(a[0]=t=>e.nextStep()),type:"primary",style:{width:"160px",height:"32px",color:"rgba(255, 255, 255, 1)","font-size":"14px","border-radius":"5px"}},{default:i((()=>[F])),_:1}),f(g,{onClick:a[1]||(a[1]=t=>e.lastStep()),type:"link",style:{"margin-top":"6px","font-size":"14px",color:"rgba(80, 139, 254, 1)"}},{default:i((()=>[H])),_:1})])])])),_:1})}],["__scopeId","data-v-7d5d05fa"]]);export{K as default};
