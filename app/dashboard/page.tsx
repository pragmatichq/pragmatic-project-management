"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import React from "react";

export default function taskListPage() {
  let tasks: Array<Doc<"tasks">> | undefined;

  try {
    tasks = useQuery(api.tasks.list, {});
  } catch (e) {
    throw e;
  }

  return <section>Hello</section>;
}
