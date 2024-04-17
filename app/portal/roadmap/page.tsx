"use client";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Action {
  id: string;
  title: string;
  time_frame: string;
  order: number;
}

const time_frames = ["Planned", "In Progress", "Completed"];

const getActions = (
  count: number,
  time_frame: string,
  offset: number = 0
): Action[] =>
  Array.from({ length: count }, (v, index) => ({
    id: `action-${index + offset}`,
    title: `Task ${index + offset}`,
    time_frame: time_frame,
    order: index + offset + 1,
  }));

const calculateNewOrder = (actions: Action[], index: number): number => {
  if (index === 0) {
    return actions.length > 1 ? actions[0].order / 2 : 0.5;
  } else if (index === actions.length - 1) {
    return actions[index - 1].order + 1;
  }
  const previousOrder = actions[index - 1]?.order;
  const nextOrder = actions[index]?.order;
  return (previousOrder! + nextOrder!) / 2;
};

export default function RoadmapPortal() {
  const [actions, setActions] = useState([
    ...getActions(5, "Planned"),
    ...getActions(5, "In Progress", 5),
    ...getActions(5, "Completed", 10),
  ]);

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;

    const updatedActions = Array.from(actions); // Create a shallow copy of actions
    const newOrder = calculateNewOrder(updatedActions, destination.index);
    const [movedAction] = updatedActions.splice(source.index, 1); // Remove the moved action from its original position

    // Update moved action's time_frame and calculate its new order within the destination column
    movedAction.time_frame = destination.droppableId;
    movedAction.order = newOrder;

    // Combine back into the main actions array
    setActions(
      updatedActions.concat(movedAction).sort((a, b) => a.order - b.order) // This sort ensures all actions are in correct order by their `order` property
    );
  }

  useEffect(() => {
    console.log(actions);
  }, [actions]);

  return (
    <div className="flex flex-col space-y-4 my-8">
      <h2 className="text-4xl font-bold tracking-tight">Roadmap</h2>
      <ScrollArea>
        <div className="flex flex-row gap-4 items-start">
          <DragDropContext onDragEnd={onDragEnd}>
            {time_frames.map((time_frame) => (
              <>
                <Card className="bg-slate-50 min-w-[300px] min-h-[156px]">
                  <CardHeader className="p-3">
                    <CardTitle>{time_frame}</CardTitle>
                  </CardHeader>
                  <Droppable key={time_frame} droppableId={time_frame}>
                    {(provided: DroppableProvided) => (
                      <CardContent
                        className="flex flex-col p-3"
                        ref={provided.innerRef}
                      >
                        {actions
                          .filter((action) => action.time_frame === time_frame)
                          .sort((a, b) => a.order - b.order)
                          .map((action, index) => {
                            const globalIndex = actions.findIndex(
                              (globalAction) => globalAction.id === action.id
                            );
                            return (
                              <Draggable
                                key={action.id}
                                draggableId={action.id}
                                index={globalIndex}
                              >
                                {(provided: DraggableProvided) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="w-full my-1"
                                  >
                                    <CardHeader>
                                      <CardTitle className="text-base">
                                        {action.title} : {globalIndex}
                                      </CardTitle>
                                    </CardHeader>
                                  </Card>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </CardContent>
                    )}
                  </Droppable>
                </Card>
              </>
            ))}
          </DragDropContext>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
