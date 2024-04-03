"use client";

import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";
import Link from "next/link";

export default function BroadcastSidebar() {
  const broadcasts = useStableQuery(api.broadcasts.list, {});

  return (
    <div className="flex flex-col">
      {broadcasts?.map((broadcast) => (
        <Link href={`/dashboard/broadcasts/${broadcast._id}`}>
          {broadcast.title}
        </Link>
      ))}
    </div>
  );
}
