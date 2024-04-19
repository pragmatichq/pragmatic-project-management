"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { time_frames } from "@/lib/hooks/getOrganizationCustom";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const calculateNewOrder = (sortedActions: any, newIndex: any) => {
  if (newIndex === 0) {
    // First position in the list
    return sortedActions.length > 1 ? sortedActions[1].order / 2 : 0.5;
  } else if (newIndex === sortedActions.length - 1) {
    // Last position in the list
    return sortedActions[sortedActions.length - 2].order + 1;
  } else {
    // Middle position in the list
    const prevOrder = sortedActions[newIndex - 1].order;
    const nextOrder = sortedActions[newIndex + 1].order;
    console.log(prevOrder, nextOrder);
    return (prevOrder + nextOrder) / 2;
  }
};

export default function RoadmapPortal({
  actionsData,
}: {
  actionsData: Doc<"actions">[];
}) {
  const [actions, setActions] = useState<Doc<"actions">[]>([]);

  useEffect(() => {
    setActions(actionsData);
  }, [actionsData]);

  const updateAction = useMutation(api.actions.update);

  const updateRoadmap = async ({
    actionId,
    time_frame,
    order,
  }: {
    actionId: Id<"actions">;
    time_frame: string;
    order: number;
  }) => {
    try {
      await updateAction({
        actionId,
        time_frame,
        order,
      });
      toast.success("Roadmap updated");
    } catch (error) {
      toast.error("Failed to update roadmap");
      setActions(actionsData);
    }
  };

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return; // Exit if no destination is defined (e.g., dropped outside of any droppable area)
    }

    const updatedActions = [...actions]; // Clone the current state
    const sourceIndex = updatedActions.findIndex(
      (action) => action._id === draggableId
    );
    const movedAction = updatedActions[sourceIndex]; // Get reference to the action being moved

    if (sourceIndex === -1 || !movedAction) {
      return; // Exit if the action is not found (shouldn't happen but good to safeguard)
    }

    // Temporarily remove the action from its original place
    updatedActions.splice(sourceIndex, 1);

    // Find the index where the action will be placed
    const actionsInDestination = updatedActions.filter((action) => {
      // Check if the destination is the special "No Time Frame" droppable
      if (destination.droppableId === "No Time Frame") {
        // Include actions where `time_frame` is not set (undefined, null, or empty string)
        return !action.time_frame;
      } else {
        // For other destinations, match the `time_frame` exactly
        return action.time_frame === destination.droppableId;
      }
    });
    actionsInDestination.splice(destination.index, 0, movedAction); // Insert at the destination index

    // Calculate the new index of the moved action in the context of its new column
    const newIndex = destination.index;

    console.log(destination.droppableId);

    // Calculate new order based on its new neighbors
    const newOrder = calculateNewOrder(actionsInDestination, newIndex);

    // Apply the new time_frame and order
    movedAction.time_frame = destination.droppableId;
    movedAction.order = newOrder;

    // Integrate the moved action back into the main array
    updatedActions.push(movedAction);
    updatedActions.sort((a, b) => a.order! - b.order!); // Ensure the global list is sorted by order

    setActions(updatedActions); // Update state

    const updatedTimeFrame =
      destination.droppableId === "No Time Frame"
        ? ""
        : destination.droppableId;

    updateRoadmap({
      actionId: draggableId as Id<"actions">,
      time_frame: updatedTimeFrame,
      order: newOrder,
    });
  }

  const timeFramesIncludingUnset = useMemo(() => {
    return [...time_frames, { value: "No Time Frame", label: "No Time Frame" }];
  }, [time_frames]);

  return (
    <div className="h-[calc(100vh-45px)] overflow-auto p-6 space-y-4">
      <h2 className="text-4xl font-bold tracking-tight">Roadmap</h2>
      <div className="flex flex-row gap-4 items-start">
        <DragDropContext onDragEnd={onDragEnd}>
          {timeFramesIncludingUnset.map((time_frame) => (
            <React.Fragment key={time_frame.value}>
              <div className="min-w-[300px]">
                <h3 className="p-1 text-lg font-medium">{time_frame.value}</h3>
                <Droppable droppableId={time_frame.value}>
                  {(
                    provided: DroppableProvided,
                    snapshot: DroppableStateSnapshot
                  ) => (
                    <div
                      className={cn(
                        (snapshot.isDraggingOver &&
                        !snapshot.draggingFromThisWith
                          ? "bg-secondary"
                          : "") +
                          " flex rounded-md flex-col p-1 min-h-[74px] transition-colors ease-in"
                      )}
                      ref={provided.innerRef}
                    >
                      {actions
                        .filter(
                          (action) =>
                            action.time_frame === time_frame.value ||
                            (time_frame.value === "No Time Frame" &&
                              !action.time_frame)
                        )
                        .map((action, index) => {
                          return (
                            <Draggable
                              key={action._id}
                              draggableId={action._id}
                              index={index}
                            >
                              {(provided: DraggableProvided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="w-full my-1 p-4 bg-white border rounded-sm"
                                >
                                  {action.title}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </React.Fragment>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
