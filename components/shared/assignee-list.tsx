import { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import type { OrganizationMembershipResource } from "@clerk/types";
import { GenericId } from "convex/values";
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

interface AssigneeListProps {
  assignees: Array<string>;
  task: GenericId<"tasks">;
}

export function AssigneeList({ assignees, task }: AssigneeListProps) {
  const { memberships, isLoaded } = useOrganization({ memberships: true });

  const assigneeDetails = useMemo(() => {
    if (!isLoaded || !memberships?.data) return [];
    return assignees
      .map((assignee) =>
        memberships.data.find(
          (member) => member.publicUserData.userId === assignee
        )
      )
      .filter(
        (member): member is OrganizationMembershipResource =>
          member !== undefined
      );
  }, [assignees, memberships, isLoaded]);

  const [checkedList, setChecked] = useState(assignees);

  const isChecked = (item: string) => checkedList.includes(item);

  const updateAssignees = useMutation(api.tasks.updateTaskAssignees);

  const handleCheckedChange = async (checked: boolean, member: string) => {
    let updatedList = checked
      ? [...checkedList, member]
      : checkedList.filter((item) => item !== member);
    await updateAssignees({ id: task, assignees: updatedList });
    setChecked(updatedList);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-1 h-auto rounded-sm">
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
              checked={isChecked(member.publicUserData.userId ?? "")}
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
