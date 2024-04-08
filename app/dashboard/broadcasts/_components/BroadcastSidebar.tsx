"use client";

import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";
import { parseDate } from "@/lib/utils";
import { format } from "date-fns";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateBroadcastButton } from "./BroadcastQueries";

export default function BroadcastSidebar() {
  const [status, setStatus] = useState("all");
  const queryStatus = status === "all" ? "" : status;
  const broadcasts = useStableQuery(api.broadcasts.list, {
    status: queryStatus,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <CreateBroadcastButton
            buttonText="Create"
            Icon={PlusCircleIcon}
            variant={"outline"}
            className="text-xs p-3 h-10"
          />
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
          <div className="mx-auto text-center flex flex-col gap-8 p-6 rounded bg-muted text-muted-foreground border w-full mt-4">
            {status === "all"
              ? "You haven't created any broadcasts yet."
              : "No broadcasts match your query."}
          </div>
        ) : (
          broadcasts
            ?.sort((a, b) => b._creationTime - a._creationTime)
            .map((broadcast) => {
              const parsedDate = parseDate(broadcast.publish_date);

              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return (
                <Link href={`/dashboard/broadcasts/${broadcast._id}`}>
                  <div className="flex flex-col p-4 border hover:bg-secondary">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium mr-4">
                        {broadcast.title ? broadcast.title : "New Broadcast"}
                      </h3>
                      <div className="flex flex-col justify-end gap-2">
                        <div className="flex justify-end">
                          {parsedDate && broadcast.status === "published" ? (
                            parsedDate > today ? (
                              <Badge className="capitalize h-fit w-fit">
                                Scheduled
                              </Badge>
                            ) : (
                              <Badge className="capitalize h-fit w-fit">
                                Published
                              </Badge>
                            )
                          ) : (
                            <Badge className="capitalize h-fit w-fit">
                              {broadcast.status}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right text-sm font-light">
                          {parsedDate && format(parsedDate, "MM/d/yy")}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
        )}
      </div>
    </>
  );
}
