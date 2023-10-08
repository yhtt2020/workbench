import { taskStore } from "../../store";
import { useToast } from "vue-toastification";

export const completeTask = (id) => {
  const store: any = taskStore();
  const { startBranchTask, successBranchTask } = store;
  const toast = useToast();
  if (startBranchTask.has(id)) {
    startBranchTask.delete(id);
    successBranchTask.add(id);
    toast.success("任务完成");
  } else {
    toast.error("任务失败");
  }
};
