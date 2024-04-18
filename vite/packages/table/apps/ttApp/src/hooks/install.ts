export const useInstallTTApp = async (id?: string) => {
  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile", "multiSelections"],
    filters: [
      {
        name: "zip压缩包",
        extensions: ["zip"],
      },
    ],
  });

  if (!path[0]) return;

  const res: any = await new Promise((resolve) => {
    tsbApi.ttapp.installV2(
      {
        path: path[0],
        id,
      },
      (data) => {
        console.log("installV2 data :>> ", data);
        resolve(data);
      }
    );
  });

  return res;
};
