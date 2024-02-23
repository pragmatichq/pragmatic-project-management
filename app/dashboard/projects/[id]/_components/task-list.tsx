import { AssigneeList } from "./assignee-list";

export function TaskList({ tasks }: { tasks: any }) {
  let emptyTasks: boolean;
  tasks?.length != 0 ? (emptyTasks = false) : (emptyTasks = true);

  return (
    <div>
      {tasks?.map((task: any) => (
        <div>
          Title: {task.title}{" "}
          <AssigneeList task={task._id} assignees={task.assignees} />
        </div>
      ))}
    </div>
  );
}
