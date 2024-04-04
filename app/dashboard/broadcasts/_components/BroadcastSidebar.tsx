"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BroadcastSidebar() {
  const [status, setStatus] = useState("all");
  const queryStatus = status === "all" ? "" : status;
  const broadcasts = useStableQuery(api.broadcasts.list, {
    status: queryStatus,
  });

  return (
    <>
      <div className="flex flex-col space-y-2 p-6 h-[calc(100vh-30px)] overflow-auto">
        <div className="flex justify-between">
          <Button variant={"outline"} className="text-xs p-3 h-10">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Create
          </Button>
          <ToggleGroup
            type="single"
            variant={"outline"}
            value={status}
            onValueChange={setStatus}
            className="justify-end gap-0"
          >
            <ToggleGroupItem
              value="all"
              aria-label="Toggle all broadcasts"
              className="rounded-none rounded-tl-sm rounded-bl-sm text-xs"
            >
              All
            </ToggleGroupItem>
            <ToggleGroupItem
              value="draft"
              aria-label="Toggle drafts"
              className="rounded-none text-xs border-x-0"
            >
              Drafts
            </ToggleGroupItem>
            <ToggleGroupItem
              value="published"
              aria-label="Toggle published"
              className="rounded-none rounded-tr-sm rounded-br-sm text-xs"
            >
              Published
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {broadcasts?.length === 0 ? (
          <p className="text-center text-sm">
            {status === "all"
              ? "You haven't started any broadcasts yet"
              : "No broadcasts match your query"}
          </p>
        ) : (
          broadcasts?.map((broadcast) => (
            <Link href={`/dashboard/broadcasts/${broadcast._id}`}>
              <div className="flex flex-col p-4 border hover:bg-secondary">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium mr-4">
                    {broadcast.title}
                  </h3>
                  <div className="flex flex-col justify-end gap-2">
                    <Badge className="capitalize h-fit">
                      {broadcast.status}
                    </Badge>
                    <div className="text-right text-sm font-light">4/6/24</div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
