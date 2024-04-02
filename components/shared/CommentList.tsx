import React, { useMemo, useRef, useEffect } from "react";

import { formatDistance } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { Id, Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useOrganization } from "@clerk/nextjs";
import { CommentEditor } from "../editor/CommentEditor";
import { MessageSquareDashed } from "lucide-react";

interface CommentListProps {
  parent: Id<"actions">;
}

export function CommentList({ parent }: CommentListProps) {
  const { memberships, isLoaded } = useOrganization({ memberships: true });
  let comments: Array<Doc<"comments">> | undefined;

  try {
    comments = useQuery(
      api.comments.list,
      parent ? { parent: parent } : "skip"
    );
  } catch (e) {
    throw e;
  }

  const commentsWithAuthor = useMemo(() => {
    if (!isLoaded || !memberships?.data) return [];
    return comments
      ?.map((comment) => {
        const author = memberships.data.find(
          (member) =>
            member.publicUserData.userId === (comment as any).authorClerkId
        );
        return {
          ...comment,
          author: author?.publicUserData ?? null,
        };
      })
      .filter((comment) => comment.author !== null);
  }, [comments, memberships, isLoaded]);

  const commentBox = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (commentBox.current) {
      commentBox.current.scrollTop = commentBox.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (commentBox.current) {
      scrollToBottom();
    }
  }, [commentBox.current?.scrollHeight, commentsWithAuthor]);

  return (
    <ScrollArea className="rounded-md border h-full bg-muted" ref={commentBox}>
      <div className="grid gap-3 p-3">
        {commentsWithAuthor?.length === 0 ? (
          <div className=" text-muted-foreground text-center font-medium flex flex-col gap-4 p-4 items-center">
            <MessageSquareDashed className="size-8" />
            No discussion yet
          </div>
        ) : (
          commentsWithAuthor?.map((comment) => (
            <div
              key={comment._id}
              className="text-sm flex items-start gap-4 rounded bg-white border p-4"
            >
              <div className="flex items-center">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage
                    src={comment.author?.imageUrl}
                    className="object-cover"
                  />
                </Avatar>
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">
                    {comment.author?.firstName} {comment.author?.lastName}
                  </div>
                  <div className="text-gray-500 text-xs dark:text-gray-400">
                    {formatDistance(comment._creationTime, new Date(), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}

export default CommentList;
