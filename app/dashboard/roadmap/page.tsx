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
import { useStableQuery } from "@/lib/hooks/useStableQuery";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import KanbanBoard from "./KanbanBoard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function RoadmapPage() {
  const defaultActions = useStableQuery(api.actions.list, {});
  console.log(defaultActions);

  return (
    <>
      {defaultActions ? (
        <KanbanBoard currentActions={defaultActions} />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
