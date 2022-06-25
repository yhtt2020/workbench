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
  async start(){
    await this.createServer()
  }
}

dev.start()
