declare module 'action' {


}
declare interface ActionResult {
  message: string,
  //1.成功,0.失败,-1//未知
  status: number
}

interface IDeckActionType {
  name: string
  alias: string
}

type IArgs = {
  [key: string]: string
}

//标准动作属性
declare interface IDeckAction {
  /**
   * 名称
   */
  name: string,
  //对应的指令组，只是为了方便
  group: any,
  //对应的action
  action: any,
  args: IArgs //指令参数
}

declare interface IWidget {
  id: string,
  icon: string,
  cover: string,
  type: string,
  font: any,
  title: string,
  action: IDeckActionType
}

declare interface IGrid {
  id: string,
  title: string,
  children?: Array<IWidget>[],
}
