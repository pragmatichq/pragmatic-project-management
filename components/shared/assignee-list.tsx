"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarGroup,
  AvatarGroupList,
  AvatarImage,
  AvatarOverflowIndicator,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Doc } from "@/convex/_generated/dataModel";

interface ActionsWithAssignees extends Doc<"actions"> {
  assignees: string[];
}

interface AssigneeListProps {
  action: ActionsWithAssignees;
}

export function AssigneeList({ action }: AssigneeListProps) {
  const { memberships, isLoaded } = useOrganization({ memberships: true });

  const createActionAssignee = useMutation(api.actionAssignees.create);
  const deleteActionAssignee = useMutation(api.actionAssignees.remove);

  const assigneeDetails = useMemo(() => {
    if (!isLoaded || !memberships?.data) return [];
    return action.assignees
      .map((assignee) =>
        memberships.data.find(
          (member) => member.publicUserData.userId === assignee
        )
      )
      .filter((member) => member !== undefined);
  }, [action, memberships, isLoaded]);

  const handleCheckedChange = async (checked: boolean, member: string) => {
    if (checked) {
      await createActionAssignee({
        actionId: action._id,
        assigneeClerkId: member,
      });
    } else {
      await deleteActionAssignee({
        actionId: action._id,
        assigneeClerkId: member,
      });
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-1 h-auto rounded-sm w-full justify-start"
          >
            {assigneeDetails.length === 0 ? (
              <div className="h-8 w-8">-</div>
            ) : (
              // TODO: Using assigneeDetails.length as a workaround for AvatarGroup not rerendering when the assigneeDetails changes
              <AvatarGroup limit={2} key={assigneeDetails.length}>
                <AvatarGroupList>
                  {assigneeDetails.map((assignee, index) => (
                    <Avatar
                      key={
                        assignee?.publicUserData.userId ||
                        `placeholder-${index}`
                      }
                      className="h-8 w-8"
                    >
                      <AvatarImage
                        src={assignee?.publicUserData.imageUrl}
                        className="h-8 w-8 border-solid border-white border-[1px] object-cover"
                      />
                    </Avatar>
                  ))}
                </AvatarGroupList>
                <AvatarOverflowIndicator className="w-8 h-8" />
              </AvatarGroup>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {memberships?.data?.map((member, index) => (
            <DropdownMenuCheckboxItem
              key={
                member.publicUserData.userId ?? `member-placeholder-${index}`
              }
              checked={
                action.assignees.includes(
                  member.publicUserData.userId as string
                ) ?? ""
              }
              onCheckedChange={(checked) => {
                if (member.publicUserData.userId) {
                  handleCheckedChange(checked, member.publicUserData.userId);
                }
              }}
            >
              <Avatar className="w-6 h-6 mr-1">
                <AvatarImage
                  src={member.publicUserData.imageUrl}
                  className="object-cover"
                />
              </Avatar>
              {member.publicUserData.firstName} {member.publicUserData.lastName}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
