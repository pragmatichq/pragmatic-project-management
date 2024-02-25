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
          <Button variant="ghost" className="p-1 h-auto rounded-sm">
            <AvatarGroup limit={2}>
              <AvatarGroupList>
                {assigneeDetails.length <= 0 ? (
                  <div className="h-8 w-8">-</div>
                ) : (
                  assigneeDetails?.map((assignee) => (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={assignee?.publicUserData.imageUrl}
                        className="h-8 w-8 border-solid border-white border-[1px] object-cover"
                      />
                    </Avatar>
                  ))
                )}
              </AvatarGroupList>
              <AvatarOverflowIndicator className="w-8 h-8" />
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
              <Avatar className="w-6 h-6 mr-1">
                <AvatarImage
                  src={member.publicUserData.imageUrl}
                  className="object-cover"
                />
              </Avatar>{" "}
              {member.publicUserData.firstName} {member.publicUserData.lastName}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
