import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import TaskCard from "./TaskCard";
import AnimateHeight, { Height } from "react-animate-height";

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
  const [height, setHeight] = useState<Height>("auto");
  const contentDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = contentDiv.current as HTMLDivElement;

    const resizeObserver = new ResizeObserver(() => {
      setHeight(element.clientHeight);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

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
    <div className="w-[350px] rounded-md bg-secondary">
      <AnimateHeight
        height={height}
        contentClassName="auto-content"
        contentRef={contentDiv}
        duration={300}
        disableDisplayNone
        animateOpacity
      >
        <div
          ref={setNodeRef}
          className="flex flex-col gap-4 p-2 overflow-hidden min-h-[116px] h-fit transition-all duration-1000"
        >
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </AnimateHeight>
    </div>
  );
}

export default ColumnContainer;
