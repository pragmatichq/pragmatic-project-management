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

import { time_frames } from "@/lib/hooks/getOrganizationCustom";

import TaskCard from "./TaskCard";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

function KanbanBoard({ currentActions }: any) {
  const updateAction = useMutation(api.actions.update);

  const updateActionWithProps = async ({
    actionId,
    status,
    order,
    time_frame,
  }: {
    actionId: Id<"actions">;
    status?: Doc<"actions">["status"];
    order?: number;
    time_frame?: string;
  }) => {
    const response = await updateAction({
      actionId,
      status,
      order,
      time_frame,
    });
    toast.success("Action updated");
  };
  const [actions, setActions] = useState([]);

  useEffect(() => {
    setActions(currentActions.sort((a, b) => a.order! - b.order!));
  }, [currentActions]);

  const [activeAction, setActiveAction] = useState<Doc<"actions"> | null>(null);

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
      {actions ? (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          collisionDetection={closestCenter}
        >
          <div className="m-6 flex gap-4 items-start">
            {actions &&
              time_frames.map((column) => (
                <ColumnContainer
                  key={column.value}
                  column={column}
                  actions={actions?.filter(
                    (action: Doc<"actions">) =>
                      action.time_frame === column.value
                  )}
                />
              ))}
          </div>

          {createPortal(
            <DragOverlay>
              {activeAction && <TaskCard action={activeAction} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      ) : (
        <div>Hello Babe</div>
      )}
    </div>
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Action") {
      setActiveAction(event.active.data.current.action);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    const { active } = event;

    setActiveAction(null); // Reset active action regardless of whether the update is needed or not
    setActions((prevActions) => {
      const actions = [...prevActions]; // Create a shallow copy to ensure immutability
      const newIndex = actions.findIndex((action) => action._id === active.id);

      if (newIndex === -1) {
        console.log("No active task found, no update needed.");
        return actions; // No active task found, no update needed
      }

      let newOrder = calculateNewOrder(actions, newIndex); // A hypothetical function to calculate new order

      if (
        actions[newIndex].order !== newOrder ||
        actions.some(
          (action) => action._id === active.id && action.order !== newOrder
        )
      ) {
        console.log(
          `Updating order for action ${actions[newIndex]._id} to ${newOrder}`
        );
        actions[newIndex].order = newOrder;

        updateActionWithProps({
          actionId: actions[newIndex]._id,
          order: newOrder,
          time_frame: actions[newIndex].time_frame,
        });
      } else {
        console.log("Order is the same, no update needed.");
      }

      return actions;
    });
  }

  function calculateNewOrder(actions, index) {
    // Logic to calculate new order
    if (index === 0) {
      return actions.length > 1 ? actions[1].order! / 2 : 0.5;
    } else if (index === actions.length - 1) {
      return actions[index - 1].order! + 1;
    } else {
      const prevOrder = actions[index - 1].order;
      const nextOrder = actions[index + 1].order;
      return (prevOrder! + nextOrder!) / 2;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Action";
    const isOverATask = over.data.current?.type === "Action";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setActions((actions) => {
        if (actions) {
          const activeIndex = actions.findIndex((t) => t._id === activeId);
          const overIndex = actions.findIndex((t) => t._id === overId);

          if (
            actions[activeIndex].time_frame != actions[overIndex].time_frame
          ) {
            actions[activeIndex].time_frame = actions[overIndex].time_frame;
            const newOverIndex = overIndex === 0 ? 0 : overIndex - 1; // Ensure not to use negative index
            return arrayMove(actions, activeIndex, newOverIndex);
          }

          console.log(arrayMove(actions, activeIndex, overIndex));

          return arrayMove(actions, activeIndex, overIndex);
        }
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setActions((actions) => {
        if (actions) {
          const activeIndex = actions.findIndex((t) => t._id === activeId);

          actions[activeIndex].time_frame = overId;

          return arrayMove(actions, activeIndex, activeIndex);
        }
      });
    }
  }
}

export default KanbanBoard;
