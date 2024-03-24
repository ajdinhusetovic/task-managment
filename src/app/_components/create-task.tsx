"use client";

import { useSession } from "next-auth/react";
import React, { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import { useToast } from "../../components/ui/use-toast";
import NotLoggedIn from "./not-logged-in";

const NewTaskForm = () => {
  const session = useSession();

  if (session.status !== "authenticated") {
    return <NotLoggedIn />;
  }

  return (
    <div className="mx-auto bg-violet-50 py-8">
      <Form />
    </div>
  );
};

function Form() {
  const { toast } = useToast();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("LOW");
  const [taskCategory, setTaskCategory] = useState("other");
  const isTaskDone = false;

  console.log("Priority", taskPriority);
  console.log("Category", taskCategory);

  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      setTaskPriority("LOW");
      setTaskTitle("");
      setTextAreaValue("");
      setTaskCategory("other");
      toast({ title: "Task created.", variant: "default" });
    },

    onError: (error) => {
      if (error.data?.zodError) {
        const fieldError = (error.data.zodError.fieldErrors = JSON.parse(
          error.message,
        )[0].message);
        toast({ title: fieldError, variant: "destructive" });
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!taskTitle) {
      toast({ title: "Please fill in all the fields", variant: "destructive" });
      return;
    }

    createTask.mutate({
      title: taskTitle,
      description: textAreaValue,
      priority: taskPriority,
      isDone: isTaskDone,
      category: taskCategory,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-[640px] flex-col  items-center gap-6 rounded bg-orange-300 px-6 pb-8 pt-8 md:w-11/12 md:py-14"
    >
      <h1 className="text-2xl font-medium md:mb-4 md:text-4xl">
        Create your task here
      </h1>
      <div className="flex w-full flex-col gap-2 md:w-11/12">
        <label className="text-lg font-medium">Title</label>
        <input
          type="text"
          placeholder="Do the dishes"
          onChange={(e) => setTaskTitle(e.target.value)}
          value={taskTitle}
          className="w-full rounded bg-violet-50 p-2 text-zinc-950 focus:outline-none md:text-xl"
        />
      </div>
      <div className="flex w-full flex-col gap-2 md:w-11/12">
        <label className="text-lg font-medium">Description</label>
        <textarea
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          className="text-blue-500md:text-lg h-[200px] flex-grow resize-none overflow-y-auto rounded-md bg-violet-50 p-4 text-zinc-950 focus:outline-none"
          placeholder="Describe your task..."
        ></textarea>
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <label className="text-lg font-medium">Task Priority</label>
        <select
          name="taskPriority"
          onChange={(e) => setTaskPriority(e.target.value)}
          className="rounded bg-violet-50  p-2 text-zinc-950 md:w-[200px]"
          value={taskPriority}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <label className="text-lg font-medium">Task Category</label>
        <select
          name="taskCategory"
          onChange={(e) => setTaskCategory(e.target.value)}
          className="rounded bg-violet-50  p-2 text-zinc-950 md:w-[200px]"
          value={taskCategory}
        >
          <option value="home">Home</option>
          <option value="personal">Personal</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="work">Work</option>
          <option value="finance">Finance</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button className="mx-auto my-4 w-full rounded-md bg-violet-50 p-2 font-medium text-zinc-950 hover:bg-violet-100 md:w-11/12">
        Create task
      </button>
    </form>
  );
}

export default NewTaskForm;
