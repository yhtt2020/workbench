/**
 * 更新配置文件
 */
export const updateConfig = async (id: any) => {
  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile", "multiSelections"],
    filters: [
      {
        name: "配置文件",
        extensions: ["json"],
      },
    ],
  });

  if (!path[0]) return;
  // 拿到配置文件
  tsbApi.ttapp.renew(id, (data) => {
    console.log("拿到 data :>> ", data);
  });

  const res: any = await new Promise((resolve) => {
    // tsbApi.ttapp.install(path[0], (data) => {
    //   resolve(data);
    // });
  });
};
