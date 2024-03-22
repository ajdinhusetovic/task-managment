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

// const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
//   if (textArea === undefined) return;

//   textArea.style.height = "0";
//   textArea.style.height = `${textArea?.scrollHeight}px`;
// };

const NewTaskForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <Form />;
};

function Form() {
  const session = useSession();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("LOW");

  const createTask = api.task.create.useMutation({
    onSuccess: (newTask) => {
      console.log(newTask);
    },
  });

  if (session.status !== "authenticated") return;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createTask.mutate({
      title: taskTitle,
      description: textAreaValue,
      priority: taskPriority,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex w-11/12 max-w-[640px] flex-col items-center gap-6"
    >
      <div className="flex w-11/12 flex-col gap-2">
        <InputComponent
          label="Title"
          type="text"
          placeholder="Do the dishes"
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </div>
      <div className="flex w-11/12 flex-col gap-2">
        <label>Description</label>
        <textarea
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          className="h-[200px] flex-grow resize-none overflow-y-auto border p-4 md:text-lg"
          placeholder="Describe your task..."
        ></textarea>
      </div>
      <div className="flex gap-2">
        <label className="text-lg">Task Priority</label>
        <select
          name="taskPriority"
          onChange={(e) => setTaskPriority(e.target.value)}
          className="rounded bg-violet-50 p-2 font-medium text-violet-700"
          value={taskPriority}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <button className="mx-auto w-11/12 rounded-md bg-violet-500 p-2 font-medium text-white">
        Create task
      </button>
    </form>
  );
}

export default NewTaskForm;
