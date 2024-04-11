export const useInstallTTApp = async () => {
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
    tsbApi.ttapp.install(path[0], (data) => {
      resolve(data);
    });
  });
  console.log('useInstallTTApp res :>> ', res);

  return res;
};
