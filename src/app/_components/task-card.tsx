import React from "react";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority?: string | null;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
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

  return (
    <div className="flex flex-col gap-2 rounded bg-violet-500 p-4">
      <div>
        <h1 className="text-2xl font-medium">{task.title}</h1>
      </div>
      <div>{task.description}</div>
      <div className={`${priorityColor} w-[80px] rounded-md text-center`}>
        <p className="p-1 font-medium">{task.priority}</p>
      </div>
      <div className="flex">
        <button className="ml-auto rounded bg-violet-50 p-2">Remove</button>
      </div>
    </div>
  );
};

export default TaskCard;
