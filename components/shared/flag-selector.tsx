import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Doc } from "@/convex/_generated/dataModel";

interface FlagSelectorProps {
  action: Doc<"actions">;
}

export function FlagSelector({ action }: FlagSelectorProps) {
  const flagsList = [
    {
      title: "Need Information",
      color:
        "border-orange-500 text-orange-500 bg-orange-50 hover:bg-orange-500 hover:text-white",
    },
    {
      title: "Ready for Review",
      color:
        "border-green-500 text-green-500 bg-green-50 hover:bg-green-500 hover:text-white",
    },
    {
      title: "Urgent",
      color:
        "border-red-500 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white",
    },
  ];

  const [currentFlags, setChecked] = useState(action.flags || []);

  const updateActionFlags = useMutation(api.actions.update);

  const handleCheckedChange = async (checked: boolean, flag: string) => {
    let updatedList = checked
      ? [...currentFlags, flag]
      : currentFlags.filter((item) => item !== flag);
    await updateActionFlags({ actionId: action._id, flags: updatedList });
    setChecked(updatedList);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-1 h-auto rounded-sm flex flex-col gap-1 w-full items-start"
          >
            {!currentFlags || currentFlags.length === 0 ? (
              <div className="h-8 w-8">-</div>
            ) : (
              currentFlags.map((flag, index) => (
                <Badge
                  variant="outline"
                  key={flag || `selected-flags-placeholder-${index}`}
                  className={
                    flagsList.find((flagItem) => flagItem.title == flag)?.color
                  }
                >
                  {flag}
                </Badge>
              ))
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {flagsList.map((flag, index) => (
            <DropdownMenuCheckboxItem
              key={flag.title ?? `currentFlags-placeholder-${index}`}
              checked={currentFlags.includes(flag.title)}
              onCheckedChange={(checked) => {
                if (flag.title) {
                  handleCheckedChange(checked, flag.title);
                }
              }}
            >
              <Badge className={flag.color}>{flag.title}</Badge>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
