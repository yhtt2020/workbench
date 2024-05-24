export const install = (item:any,index?:number) =>{
    const app = JSON.parse(JSON.stringify(item))
    try{
      app.window=JSON.parse(app.window)
    }catch (e) {
    }
    let userInfo_name
    let avatar
    if(app.userInfo){
      userInfo_name = app.userInfo.nickname
      avatar = app.userInfo.avatar
    }
    if(app.author){
      userInfo_name = app.author.nickname
      avatar = app.author.avatar
    }
  
    let option={
      appJson:{
        nanoid:app.appNanoid,
        app_nanoid:app.appNanoid,
        name: app.name,
        author: {
          nickname: userInfo_name,
          avatar: avatar
        },
        auth:app.auth ? JSON.parse(app.auth): '',
        ability: {},
        site: app.site,
        package: app.packageName,
        version:app.version,
        url: app.url,
        logo: app.logo256,
        summary: app.summary,
        type: app.type,
        theme_color:app.themeColor,
        window:app.window
      },
      background: '',
    }
  
    return option
  }