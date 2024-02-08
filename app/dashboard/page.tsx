"use client";

import { useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function Component() {
  return (
    <main>
      <section className="p-10">
        <h1>Dashboard</h1>
      </section>
    </main>
  );
}
