import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  order: number;
};

interface Props {
  tasks: Task[];
  column?: Column;
}

function ColumnContainer({ tasks, column }: Props) {
  const { setNodeRef, transform, transition } = useSortable({
    id: column?.id!,
    data: {
      type: "Column",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const tasksIds = tasks.map((task) => task.id);

  return (
    <div className="w-[350px]">
      <h2 className="text-lg font-bold mb-2">{column?.title}</h2>
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 overflow-hidden min-h-[116px]"
      >
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default ColumnContainer;
