declare interface Loudness {
  setCmdPath(path:string):void
  getMuted(): Promise<boolean>
  getVolume(): Promise<number>
  setMuted(muted: boolean): Promise<void>
  setVolume(volume: number): Promise<void>
}

declare const loudness: Loudness

export = loudness
