"use client";

import { useSession } from "next-auth/react";
import React, {
  type FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import InputComponent from "./input-component";
import { api } from "~/trpc/react";
import { useToast } from "../../components/ui/use-toast";
import NotLoggedIn from "./not-logged-in";

const NewTaskForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") {
    console.log("not logged in ");
    return <NotLoggedIn />;
  }

  return <Form />;
};

function Form() {
  const { toast } = useToast();
  const session = useSession();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("LOW");
  const [isTaskDone, setIsTaskDone] = useState(false);

  const createTask = api.task.create.useMutation({
    onSuccess: (newTask) => {
      console.log(newTask);
      setTaskPriority("");
      setTaskTitle("");
      setTextAreaValue("");
    },
  });

  // if (session.status !== "authenticated") {

  // }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!taskTitle || !textAreaValue) {
      console.log("Please fill in all fields");
      return;
    }

    createTask.mutate({
      title: taskTitle,
      description: textAreaValue,
      priority: taskPriority,
      isDone: isTaskDone,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex w-11/12 max-w-[640px] flex-col items-center gap-6 rounded bg-orange-400 px-6 py-12"
    >
      <div className="flex w-11/12 flex-col gap-2">
        <label className="text-lg font-medium">Title</label>
        <input
          type="text"
          placeholder="Do the dishes"
          onChange={(e) => setTaskTitle(e.target.value)}
          value={taskTitle}
          className="w-full rounded bg-violet-50 p-2 font-medium text-zinc-950 focus:outline-none md:text-xl"
        />
      </div>
      <div className="flex w-11/12 flex-col gap-2">
        <label className="text-lg font-medium">Description</label>
        <textarea
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          className="text-blue-500md:text-lg h-[200px] flex-grow resize-none overflow-y-auto rounded-md bg-violet-50 p-4 font-medium text-zinc-950 focus:outline-none"
          placeholder="Describe your task..."
        ></textarea>
      </div>
      <div className="flex gap-2">
        <label className="text-lg font-medium">Task Priority</label>
        <select
          name="taskPriority"
          onChange={(e) => setTaskPriority(e.target.value)}
          className="rounded bg-violet-50  p-2 font-medium text-zinc-950"
          value={taskPriority}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <button className="mx-auto w-11/12 rounded-md bg-violet-50 p-2 font-medium text-zinc-950 hover:bg-violet-100">
        Create task
      </button>
    </form>
  );
}

export default NewTaskForm;
