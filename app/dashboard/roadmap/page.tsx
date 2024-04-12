"use client";

import { useEffect, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
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

const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

const defaultTasks = [
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
    order: 0.625,
  },
  {
    id: "7",
    columnId: "todo",
    content: "Deliver dashboard prototype",
    order: 0.78125,
  },
  {
    id: "6",
    columnId: "todo",
    content: "Dev meeting",
    order: 0.9375,
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS",
    order: 1.25,
  },
  {
    id: "1",
    columnId: "done",
    content: "List admin APIs for dashboard",
    order: 2.5,
  },
  {
    id: "8",
    columnId: "done",
    content: "Optimize application performance",
    order: 2.625,
  },
  {
    id: "9",
    columnId: "done",
    content: "Implement data validation",
    order: 2.75,
  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
    order: 3,
  },
  {
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
    order: 4,
  },
  {
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
    order: 5,
  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
    order: 11,
  },
  {
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
    order: 12,
  },
  {
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
    order: 13,
  },
];
function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(
    defaultTasks.sort((a, b) => a.order - b.order)
  );

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div
      className="
        flex
        w-full
        overflow-x-auto
        overflow-y-hidden
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCenter}
      >
        <div className="m-6 flex gap-4 items-start">
          {defaultCols.map((col) => (
            <ColumnContainer
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.columnId === col.id)}
            />
          ))}
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active } = event;

    setActiveTask(null);

    setTasks((tasks) => {
      const newIndex = tasks.findIndex((t) => t.id === active.id);

      if (newIndex === -1) return tasks; // Active task not found

      let newOrder;
      if (newIndex === 0) {
        // The active task is now the first in the list
        // Use half the order of the next task if there is one
        newOrder = tasks.length > 1 ? tasks[1].order / 2 : 1; // Still use a fallback of 0.5 if no next task
      } else if (newIndex === tasks.length - 1) {
        // The active task is now the last in the list
        newOrder = tasks[newIndex - 1].order + 1; // Increment the previous task's order by 1
      } else {
        // Typical case: the active task is between two tasks
        const prevOrder = tasks[newIndex - 1].order;
        const nextOrder = tasks[newIndex + 1].order;
        newOrder = (prevOrder + nextOrder) / 2;
      }

      // Update the order of the active task
      tasks[newIndex].order = newOrder;

      return [...tasks]; // Return a new array to trigger re-render
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          const newOverIndex = overIndex === 0 ? 0 : overIndex - 1; // Ensure not to use negative index
          return arrayMove(tasks, activeIndex, newOverIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

export default KanbanBoard;
