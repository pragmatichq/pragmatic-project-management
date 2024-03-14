import React, { useMemo, useRef, useEffect } from "react";

import { useForm } from "react-hook-form";

import { formatDistance } from "date-fns";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Id, Doc } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useOrganization } from "@clerk/nextjs";

interface CommentListProps {
  parent: Id<"tasks">;
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

  const commentBox = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (commentBox.current) {
      commentBox.current.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }
  };

  useEffect(() => {
    if (commentBox.current) {
      scrollToBottom();
    }
  }, [commentsWithAuthor]);

  const formSchema = z.object({
    message: z.string().min(2, {
      message: "Message title must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createComment = useMutation(api.comments.create);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createComment({
      text: values.message,
      parent: parent,
    });
    form.reset();
  }

  return (
    <div>
      <ScrollArea className="h-[250px] rounded-md border my-5">
        <div className="grid gap-6 p-4" ref={commentBox}>
          {commentsWithAuthor?.length === 0 ? (
            <div className="text-gray-500 text-center">No comments yet</div>
          ) : (
            commentsWithAuthor?.map((comment) => (
              <div key={comment._id} className="text-sm flex items-start gap-4">
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
                  <div>{comment.text}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-between p-2 border rounded-md"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <Input
                className="flex-1 border-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                placeholder="Write a comment..."
                type="text"
                {...field}
              />
            )}
          />
          <Button className="ml-2" type="submit">
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CommentList;
