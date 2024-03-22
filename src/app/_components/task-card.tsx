import React, { FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import InputComponent from "./input-component";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  isDone?: boolean;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [isTaskDone, setIsTaskDone] = useState(false);

  let priorityColor = "";

  switch (task.priority) {
    case "LOW":
      priorityColor = "bg-green-500";
      break;
    case "MEDIUM":
      priorityColor = "bg-orange-500";
      break;
    case "HIGH":
      priorityColor = "bg-red-500";
      break;
    default:
      break;
  }

  const trpc = api.useUtils();

  const { mutate: handleDelete } = api.task.delete.useMutation({
    onMutate: async (deleteId) => {
      // Cancel any outgoing refetches
      await trpc.task.all.cancel();

      // Snapshot the previous value
      const previousTasks = trpc.task.all.getData();

      // Update to the new value
      trpc.task.all.setData(undefined, (prev) => {
        if (!prev) return previousTasks;
        return prev.filter((t) => t.id !== deleteId);
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    // Always refetch after
    onSettled: async () => {
      await trpc.task.all.invalidate();
    },
  });

  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();

    updateTask.mutate({
      id: task.id,
      title: taskTitle || task.title,
      description: (textAreaValue || task.description) ?? "", // Provide a default value if task.description is undefined
      priority: (taskPriority || task.priority) ?? "", // Provide a default value if task.priority is undefined
    });
  };

  const markAsDone = api.task.markAsDone.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const handleMarkAsDone = () => {
    markAsDone.mutate({
      id: task.id,
      isDone: true,
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded bg-yellow-500 p-4 text-violet-50">
      <div>
        <h1 className="text-2xl font-medium">{task.title}</h1>
      </div>
      <div>{task.description}</div>
      <div className={`${priorityColor} mt-2 w-[80px] rounded-md text-center`}>
        <p className="p-1 font-medium">{task.priority}</p>
      </div>
      <div className="mt-6 flex">
        {task.isDone ? (
          ""
        ) : (
          <button
            className="ml-auto rounded bg-violet-50 p-2 text-zinc-950 hover:bg-violet-100"
            onClick={handleMarkAsDone}
          >
            Done
          </button>
        )}
        <button
          onClick={() => {
            handleDelete(task.id);
          }}
          className={`${task.isDone ? "ml-auto" : "ml-2"} rounded bg-violet-50 p-2 text-zinc-950 hover:bg-violet-100 `}
        >
          Remove
        </button>
        {task.isDone ? (
          ""
        ) : (
          <Dialog>
            <DialogTrigger>
              <button className="ml-2 rounded bg-violet-50 p-2 text-zinc-950  hover:bg-violet-100">
                Edit Task
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                  Click Save Changes to finish editing your task.
                </DialogDescription>
              </DialogHeader>
              <div className="flex w-full flex-col">
                <div className="flex flex-col">
                  <InputComponent
                    label="Title"
                    type="text"
                    onChange={(e) => setTaskTitle(e.target.value)}
                    value={taskTitle}
                  />
                </div>
                <div className="mt-4 flex flex-col">
                  <label className="font-medium">Description</label>
                  <textarea
                    className="resize-none rounded border bg-violet-50 p-1 outline-none"
                    rows={6}
                    onChange={(e) => setTextAreaValue(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <label className="font-medium">Priority</label>
                <select
                  name="taskPriority"
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="rounded bg-violet-50 p-2 font-medium text-yellow-600"
                  value={taskPriority}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <button
                onClick={handleUpdate}
                className="float-right w-1/2 rounded bg-yellow-500 p-2 font-medium"
              >
                Save Changes
              </button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
