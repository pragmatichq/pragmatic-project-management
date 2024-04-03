import { UserButton } from "@clerk/nextjs";
import { Separator } from "../ui/separator";
import { HomeIcon } from "lucide-react";

export default function LayoutTitle({ title }: { title: string }) {
  return (
    <>
      <div className="text-sm w-full p-2 pl-4 flex justify-between">
        <span className="flex gap-2 items-center">
          <HomeIcon className="size-3" />
          Dashboard &gt; <span className="font-bold">{title}</span>
        </span>
        <UserButton />
      </div>
      <Separator />
    </>
  );
}
