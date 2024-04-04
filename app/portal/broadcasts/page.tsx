"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";
import { Search, ListFilter } from "lucide-react";

export default function BroadcastListing() {
  const broadcasts = useStableQuery(api.broadcasts.list, {
    status: "published",
  });
  return (
    <section className="my-8 flex flex-col space-y-4">
      <h2 className="text-4xl font-bold tracking-tight">Broadcasts</h2>
      <p className="text-sm">Updates from the marketing department.</p>
      <div>
        <div className="flex gap-4 justify-between">
          <div className="relative w-full max-w-[400px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 size-4" />
            <Input
              placeholder="Search entries..."
              className="pl-10 pr-3 py-2 text-md w-full"
            />
          </div>
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
        {broadcasts &&
          broadcasts.map((broadcast) => (
            <>
              <Separator className="my-8" />
              <div className="flex gap-4 flex-row" key={broadcast._id}>
                <div className="w-[200px]">
                  <h2 className="text-sm mt-0.5">March 20, 2024</h2>
                </div>
                <div>
                  <Badge variant="secondary">Release</Badge>
                  <h2 className="text-4xl font-extrabold my-4">
                    {broadcast.title}
                  </h2>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: broadcast.content as string,
                    }}
                  ></div>
                </div>
              </div>
            </>
          ))}
      </div>
    </section>
  );
}
