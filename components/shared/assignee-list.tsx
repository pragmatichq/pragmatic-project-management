import { useState } from "react";
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

import { Doc, Id } from "@/convex/_generated/dataModel";

interface ActionWithAssignees extends Doc<"actions"> {
  assignees: string[];
}

interface AssigneeListProps {
  action: ActionWithAssignees;
}

export function AssigneeList({ action }: AssigneeListProps) {
  const { memberships, isLoaded } = useOrganization({ memberships: true });
  const [checkedList, setChecked] = useState(action.assignees || []);

  const createActionAssignee = useMutation(api.actionAssignees.create);
  const deleteActionAssignee = useMutation(api.actionAssignees.remove);

  const assigneeDetails = memberships?.data?.filter((member) =>
    checkedList.includes(member.publicUserData.userId as string)
  );

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
            {assigneeDetails && assigneeDetails.length === 0 ? (
              <div className="h-8 w-8">-</div>
            ) : (
              <AvatarGroup limit={2} key={assigneeDetails?.length}>
                <AvatarGroupList>
                  {assigneeDetails?.map((assignee, index) => (
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
                member.publicUserData.userId || `member-placeholder-${index}`
              }
              checked={checkedList.includes(
                member.publicUserData.userId as string
              )}
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
