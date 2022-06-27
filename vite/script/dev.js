let vite=require("vite")
let vue=require("@vitejs/plugin-vue")
let dev={
  server:null,
  serverPort:1600,
  async createServer(){
    let options={
      configFile:false,
      root:process.cwd(),
      server:{
        port:this.serverPort
      },
      plugins:[vue()]
    }
    this.server=await vite.createServer(options)
    await this.server.listen()
    this.server.printUrls()
  },

  getEnvScript(){
    let env=require("./dev/env.js")
    env.WEB_PORT=this.serverPort
    env.RES_DIR=path.join(process.cwd(),"resource/release")
    let script=""
    for(let v in env)
    {
      script+='process.env.${v}="${env[v]}";'
    }
    return script
  },


  async start(){
    await this.createServer()
  }
}

dev.start()
