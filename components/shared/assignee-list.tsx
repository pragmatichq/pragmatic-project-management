"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import type { OrganizationMembershipResource } from "@clerk/types";
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

import { Id } from "@/convex/_generated/dataModel";

interface AssigneeListProps {
  actionId: Id<"actions">;
  assignees: string[];
}

export function AssigneeList({ actionId, assignees }: AssigneeListProps) {
  const { memberships, isLoaded } = useOrganization({ memberships: true });
  const [checkedList, setChecked] = useState(assignees);

  const createActionAssignee = useMutation(api.actionAssignees.create);
  const deleteActionAssignee = useMutation(api.actionAssignees.remove);

  const assigneeDetails = useMemo(() => {
    if (!isLoaded || !memberships?.data) return [];
    return checkedList
      .map((assignee) =>
        memberships.data.find(
          (member) => member.publicUserData.userId === assignee
        )
      )
      .filter(
        (member): member is OrganizationMembershipResource =>
          member !== undefined
      );
  }, [checkedList, memberships, isLoaded]);

  useEffect(() => {
    const assigneesSet = new Set(assignees);
    const checkedListSet = new Set(checkedList);
    const areSetsDifferent =
      assigneesSet.size !== checkedListSet.size ||
      [...assigneesSet].some((item) => !checkedListSet.has(item));

    if (areSetsDifferent) {
      setChecked(assignees);
    }
  }, [assignees]);

  const handleCheckedChange = async (checked: boolean, member: string) => {
    if (checked) {
      await createActionAssignee({ actionId: actionId, userClerkId: member });
    } else {
      await deleteActionAssignee({ actionId: actionId, userClerkId: member });
    }

    const updatedList = checked
      ? [...checkedList, member]
      : checkedList.filter((item) => item !== member);
    setChecked(updatedList);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-1 h-auto rounded-sm w-full justify-start"
          >
            <AvatarGroup limit={2}>
              <AvatarGroupList>
                {assigneeDetails.length === 0 ? (
                  <div className="h-8 w-8">-</div>
                ) : (
                  assigneeDetails.map((assignee, index) => (
                    <Avatar
                      key={
                        assignee.publicUserData.userId || `placeholder-${index}`
                      }
                      className="h-8 w-8"
                    >
                      <AvatarImage
                        src={assignee.publicUserData.imageUrl}
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
          {memberships?.data?.map((member, index) => (
            <DropdownMenuCheckboxItem
              key={
                member.publicUserData.userId ?? `member-placeholder-${index}`
              }
              checked={
                checkedList.includes(member.publicUserData.userId as string) ??
                ""
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
