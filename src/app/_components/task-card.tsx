import React, { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import InputComponent from "./input-component";
import { Patrick_Hand } from "next/font/google";

import { type Task } from "@prisma/client";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
});

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("");

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
      await trpc.task.all.cancel();

      const previousTasks = trpc.task.all.getData();

      trpc.task.all.setData(undefined, (prev) => {
        if (!prev) return previousTasks;
        return prev.filter((t) => t.id !== deleteId);
      });

      return { previousTasks };
    },
    onSettled: async () => {
      await trpc.task.all.invalidate();
      await trpc.task.unfinishedTasks.invalidate();
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
      description: (textAreaValue || task.description) ?? "",
      priority: (taskPriority || task.priority) ?? "",
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
    <div
      className={`flex w-full flex-col justify-between rounded bg-orange-300 py-4 ${patrickHand.className}`}
    >
      <div className="mx-auto w-11/12">
        <div className="flex items-center gap-1">
          <span className={`h-5 w-5 rounded-full ${priorityColor}`}></span>
          <p className="p-1 text-lg font-medium">{task.priority} PRIORITY</p>
        </div>
        <div>
          <h1 className="pt-2 text-4xl font-semibold">{task.title}</h1>
          <hr className="border border-t-0 border-b-gray-700" />
        </div>
        <div className="mt-2">
          <p className="break-words pt-2 text-2xl">{task.description}</p>
        </div>
      </div>
      <div className="mx-auto flex w-11/12 items-center pt-6">
        {task.isDone ? (
          ""
        ) : (
          <FaRegCheckCircle
            onClick={handleMarkAsDone}
            size={30}
            className="ml-auto cursor-pointer text-green-700 hover:scale-125"
          />
        )}
        <FaRegTimesCircle
          size={30}
          className={`${task.isDone ? "ml-auto" : "ml-2"} cursor-pointer text-red-500 hover:scale-125`}
          onClick={() => {
            handleDelete(task.id);
          }}
        />
        {task.isDone ? (
          ""
        ) : (
          <Dialog>
            <DialogTrigger>
              <FaPen
                size={25}
                className="ml-2 cursor-pointer text-orange-500 hover:scale-125"
              />
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
