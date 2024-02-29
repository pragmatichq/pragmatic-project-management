import { Dialog, DialogContent } from "@/components/ui/dialog";

import { FileEditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { DueDate } from "@/components/shared/due-date";
import { AssigneeList } from "@/components/shared/assignee-list";
import { StatusSelector } from "@/components/shared/status-selector";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { FlagSelector } from "@/components/shared/flag-selector";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { useAuth } from "@clerk/nextjs";

import { useOrganization } from "@clerk/nextjs";

import { useMemo, useRef, useEffect } from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { formatDistance } from "date-fns";

import { Input } from "@/components/ui/input";

import { useMutation } from "convex/react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Form, FormField } from "../ui/form";

import { ScrollArea } from "../ui/scroll-area";

import * as z from "zod";

export function TaskModal({
  activeTask,
  open,
  onStateChange,
}: {
  activeTask: any;
  open: boolean;
  onStateChange: Function;
}) {
  const { orgId, userId } = useAuth();
  const { memberships, isLoaded } = useOrganization({ memberships: true });

  const activeOrgId: string = orgId ?? "";
  const activeUserId: string = userId ?? "";

  const comments = useQuery(
    api.comments.getCommentsByParent,
    activeTask._id
      ? { organization: activeOrgId, parent: activeTask._id }
      : "skip"
  );

  const commentsWithAuthor = useMemo(() => {
    if (!isLoaded || !memberships?.data) return [];
    return comments
      ?.map((comment) => {
        const author = memberships.data.find(
          (member) => member.publicUserData.userId === comment.author
        );
        return {
          ...comment,
          author: author?.publicUserData ?? null,
        };
      })
      .filter((comment) => comment.author !== null);
  }, [comments, memberships, isLoaded]);

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

  const createComment = useMutation(api.comments.createComment);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createComment({
      text: values.message,
      organization: activeOrgId,
      parent: activeTask._id,
      author: activeUserId,
    });
    form.reset();
  }

  const commentBox = useRef(null);
  const scrollToBottom = () => {
    commentBox.current.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  };

  useEffect(() => {
    if (commentBox.current) {
      scrollToBottom();
    }
    console.log("Fired");
  }, [commentsWithAuthor]);

  return (
    <Dialog open={open} onOpenChange={() => onStateChange()}>
      <DialogContent className="flex gap-8 min-w-[850px]">
        <div className="grow grid gap-4 auto-rows-min">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {activeTask?.projectDetails?.title}
            </p>
            <div className="flex flex-row">
              <h2 className="text-2xl font-bold mr-2">{activeTask?.title}</h2>
              <Button className="w-8 h-8" size="icon" variant="outline">
                <FileEditIcon className="w-4 h-4" />
                <span className="sr-only">Edit task</span>
              </Button>
            </div>
          </div>
          <Textarea
            className="min-h-[100px]"
            placeholder="Add your description here."
          />
          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <TabsContent value="comments">
              <ScrollArea className="h-[250px] rounded-md border my-5">
                <div className="grid gap-6 p-4" ref={commentBox}>
                  {commentsWithAuthor?.length === 0 ? (
                    <div className="text-gray-500 text-center">
                      No comments yet
                    </div>
                  ) : (
                    commentsWithAuthor?.map((comment) => (
                      <div
                        key={comment._id}
                        className="text-sm flex items-start gap-4"
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
                              {comment.author?.firstName}{" "}
                              {comment.author?.lastName}
                            </div>
                            <div className="text-gray-500 text-xs dark:text-gray-400">
                              {formatDistance(
                                comment._creationTime,
                                new Date(),
                                {
                                  addSuffix: true,
                                }
                              )}
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
            </TabsContent>
            <TabsContent value="files">Files</TabsContent>
          </Tabs>
        </div>
        <div className="grid gap-6 auto-rows-min justify-items-start border-l p-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <StatusSelector
              currentStatus={activeTask.status}
              taskID={activeTask._id}
              statuses={["In Progress", "Next Up", "With External", "Done"]}
            />
          </div>
          <div className="grid gap-2">
            <Label>Flags</Label>
            <FlagSelector task={activeTask._id} flags={activeTask.flags} />
          </div>
          <div className="grid gap-2">
            <Label>Assignees</Label>
            <AssigneeList
              task={activeTask._id}
              assignees={activeTask.assignees}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="due-date">Due Date</Label>
            <DueDate task={activeTask._id} dueDate={activeTask.dueDate} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
