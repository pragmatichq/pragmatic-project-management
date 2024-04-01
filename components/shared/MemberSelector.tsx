"use client";

import { useMemo } from "react";
import { useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

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
import AddItemPlaceholder from "./AddItemPlaceholder";

interface ActionsWithMembers extends Doc<"actions"> {
  assignees: string[];
  stakeholders: string[];
}
interface MemberSelectorProps {
  action: ActionsWithMembers;
  purpose: "assignees" | "stakeholders";
}

export function MemberSelector({ action, purpose }: MemberSelectorProps) {
  const { memberships, isLoaded } = useOrganization({ memberships: true });

  const apiEndpoints = {
    assignees: {
      create: api.actionAssignees.create,
      remove: api.actionAssignees.remove,
    },
    stakeholders: {
      create: api.actionStakeholders.create,
      remove: api.actionStakeholders.remove,
    },
  };

  const createActionItem = useMutation(apiEndpoints[purpose].create);
  const deleteActionItem = useMutation(apiEndpoints[purpose].remove);

  const memberDetails = useMemo(() => {
    if (!isLoaded || !memberships?.data) return [];
    return action[purpose]
      .map((listedMember) =>
        memberships.data.find(
          (member) => member.publicUserData.userId === listedMember
        )
      )
      .filter((member) => member !== undefined);
  }, [action, memberships, isLoaded]);

  const handleCheckedChange = async (checked: boolean, member: string) => {
    if (checked) {
      await createActionItem({
        actionId: action._id,
        memberClerkId: member,
      });
    } else {
      await deleteActionItem({
        actionId: action._id,
        memberClerkId: member,
      });
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-start items-center text-left font-normal text-[14px] w-full h-10 hover:bg-gray-100">
          {memberDetails.length === 0 ? (
            <AddItemPlaceholder />
          ) : (
            // TODO: Using memberDetails.length as a workaround for AvatarGroup not rerendering when the memberDetails changes, causes flashing
            <AvatarGroup limit={2} key={memberDetails.length}>
              <AvatarGroupList>
                {memberDetails.map((assignee, index) => (
                  <Avatar
                    key={
                      assignee?.publicUserData.userId || `placeholder-${index}`
                    }
                    className="h-7 w-7"
                  >
                    <AvatarImage
                      src={assignee?.publicUserData.imageUrl}
                      className="h-7 w-7 border-solid border-white border-[1px] object-cover"
                    />
                  </Avatar>
                ))}
              </AvatarGroupList>
              <AvatarOverflowIndicator className="w-7 h-7" />
            </AvatarGroup>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {memberships?.data?.map((member, index) => (
            <DropdownMenuCheckboxItem
              key={
                member.publicUserData.userId ?? `member-placeholder-${index}`
              }
              checked={
                action[purpose].includes(
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
