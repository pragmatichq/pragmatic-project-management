"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarGroup,
  AvatarGroupList,
  AvatarImage,
  AvatarOverflowIndicator,
} from "@/components/ui/avatar";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { GenericId } from "convex/values";

import { useOrganization } from "@clerk/nextjs";

export function AssigneeList({
  assignees,
  task,
}: {
  assignees: Array<string>;
  task: GenericId<"tasks">;
}) {
  let emptyAssignees: boolean;
  assignees.length != 0 ? (emptyAssignees = false) : (emptyAssignees = true);
  const { memberships } = useOrganization({ memberships: true });

  const assigneeDetails = assignees?.map((assignee) => {
    const memberDetails = memberships?.data?.find(
      (member) => member.publicUserData.userId === assignee
    );
    return memberDetails;
  });

  const [checkedList, setChecked] = useState(assignees);

  var isChecked = (item: string) => (checkedList.includes(item) ? true : false);

  const updateAssignees = useMutation(api.tasks.updateTaskAssignees);

  async function handleCheckedChange(checked: boolean, member: string) {
    var updatedList = [...checkedList];
    if (checked) {
      updatedList = [...checkedList, member];
    } else {
      updatedList.splice(checkedList.indexOf(member), 1);
    }
    await updateAssignees({
      id: task,
      assignees: updatedList,
    });
    setChecked(updatedList);
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-1 h-8">
            <AvatarGroup limit={3}>
              <AvatarGroupList>
                {assigneeDetails.length <= 0 ? (
                  <div className="p-4">-</div>
                ) : (
                  assigneeDetails?.map((assignee) => (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={assignee?.publicUserData.imageUrl}
                        className="border-solid border-white border-[1px]"
                      />
                    </Avatar>
                  ))
                )}
              </AvatarGroupList>
              <AvatarOverflowIndicator />
            </AvatarGroup>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {memberships?.data?.map((member) => (
            <DropdownMenuCheckboxItem
              checked={isChecked(member?.publicUserData.userId!)}
              onCheckedChange={(checked) => {
                handleCheckedChange(checked, member.publicUserData.userId!);
              }}
            >
              <Avatar>
                <AvatarImage src={member.publicUserData.imageUrl} />
              </Avatar>{" "}
              {member.publicUserData.firstName} {member.publicUserData.lastName}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
