"use client";

import React, { useState } from "react";
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

interface Item {
  id: string;
  content: string;
}

interface MoveResult {
  [key: string]: Item[];
}

const getItems = (count: number, offset: number = 0): Item[] =>
  Array.from({ length: count }, (element, index) => index).map((index) => ({
    id: `item-${index + offset}`,
    content: `Task ${index + offset}`,
  }));

const reorder = (
  list: Item[],
  startIndex: number,
  endIndex: number
): Item[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  source: Item[],
  destination: Item[],
  droppableSource: any,
  droppableDestination: any
): MoveResult => {
  const sourceClone = Array.from(source);
  const destinationClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destinationClone.splice(droppableDestination.index, 0, removed);

  const result: MoveResult = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destinationClone;

  return result;
};

export default function RoadmapDashboard() {
  const [state, setState] = useState<Item[][]>([
    getItems(5),
    getItems(5, 5),
    getItems(1, 11),
    getItems(1, 12),
    getItems(1, 13),
    getItems(1, 14),
  ]);

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const sourceIndex = +source.droppableId;
    const destinationIndex = +destination.droppableId;

    if (sourceIndex === destinationIndex) {
      const items = reorder(
        state[sourceIndex],
        source.index,
        destination.index
      );
      const newState = [...state];
      newState[sourceIndex] = items;
      setState(newState);
    } else {
      const result = move(
        state[sourceIndex],
        state[destinationIndex],
        source,
        destination
      );
      const newState = [...state];
      newState[sourceIndex] = result[sourceIndex];
      newState[destinationIndex] = result[destinationIndex];

      setState(newState.filter((group) => group.length));
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h2 className="text-4xl font-bold tracking-tight">Roadmap</h2>
      <ScrollArea>
        <div className="flex flex-row gap-4 items-start">
          <DragDropContext onDragEnd={onDragEnd}>
            {state.map((element, index) => (
              <Droppable key={index.toString()} droppableId={`${index}`}>
                {(provided: DroppableProvided) => (
                  <Card ref={provided.innerRef} className=" bg-slate-50">
                    <CardHeader className="p-3">
                      <CardTitle>{`List ${index + 1}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col p-3">
                      {element.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided: DraggableProvided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="w-[300px] my-1"
                            >
                              <CardHeader>
                                <CardTitle className=" text-base">
                                  {item.content}
                                </CardTitle>
                              </CardHeader>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </CardContent>
                  </Card>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
