import { useMutation, useQuery } from "convex/react";
import { UploadFileResponse, useUploadFiles } from "@xixixao/uploadstuff/react";
import { api } from "@/convex/_generated/api";
import { filesize } from "filesize";
import Image from "next/image";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  DownloadIcon,
  FileTextIcon,
  MoreVertical,
  PencilIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { LoadingSpinner } from "../ui/loading-spinner";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function FileUpload({ actionId }: { actionId: Id<"actions"> }) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageId);
  const files = useQuery(api.files.list, { actionId: actionId });
  const [isDragging, setIsDragging] = useState(false);

  const { startUpload, isUploading } = useUploadFiles(generateUploadUrl, {
    onUploadBegin: (fileName) => {
      setIsDragging(false);
      toast.loading(`Uploading ${fileName}`);
    },
    onUploadComplete: async (res) => {
      await saveAfterUpload(res);
    },
  });

  const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
    await saveStorageId({
      storageId: (uploaded[0].response as any).storageId,
      filename: uploaded[0].name,
      actionId: actionId,
    });
    toast.success("File uploaded");
  };

  return (
    <>
      <Dropzone
        onDrop={(acceptedFiles) => startUpload(acceptedFiles)}
        multiple={false}
        noClick={files && files?.length > 0}
        onDragOver={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        {({ getRootProps, getInputProps, open }) => (
          <div {...getRootProps()}>
            <div className="relative rounded border bg-muted">
              <input {...getInputProps()} />
              <div
                className={cn(
                  "flex items-center justify-center w-full h-full absolute top-0 left-0 rounded bg-primary opacity-80 z-50 text-primary-foreground",
                  {
                    hidden: !isUploading || !isDragging,
                    block: isUploading || isDragging,
                  }
                )}
              >
                {isUploading && <LoadingSpinner className="size-12" />}
                {isDragging && (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex gap-4 flex-col items-center justify-center">
                      <UploadIcon className="size-16" />
                      <span className="font-medium">
                        Drop here to upload file.
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {files?.length === 0 || !files ? (
                <div className="flex items-center justify-center w-full min-h-[250px] text-muted-foreground">
                  {!isUploading && !isDragging && (
                    <div className="flex flex-col gap-4 items-center justify-center">
                      <UploadIcon className="size-8" />
                      <span className="font-medium">
                        Drag and drop files here or click to select files to
                        upload
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid gap-10 grid-cols-5 p-4">
                  {files?.map((file) => (
                    <Link
                      href={file.url as string}
                      target="_blank"
                      key={file.url}
                      className="space-y-3"
                    >
                      <div className="overflow-hidden rounded-md border-[1px] group relative w-full aspect-square">
                        <div className="w-full h-full flex items-center justify-center bg-accent group-hover:bg-slate-200 text-accent-foreground font-medium">
                          <div className="flex flex-col gap-2 items-center justify-center">
                            <FileTextIcon />
                            <span>
                              {file.metadata?.contentType
                                ?.split("/")[1]
                                .toUpperCase() || null}
                            </span>
                          </div>
                        </div>
                        {file.metadata &&
                        file.metadata.contentType &&
                        file.metadata.contentType
                          .toLowerCase()
                          .indexOf("image") >= 0 ? (
                          <Image
                            src={
                              "https://image.thum.io/get/image/fit/250x250/" +
                              file.url
                            }
                            alt={file.filename}
                            width="250"
                            height="250"
                            className="h-full w-full object-cover transition-all group-hover:scale-105 aspect-square absolute top-0 left-0"
                            onError={(e) => (
                              console.log("error"),
                              (e.currentTarget.style.display = "none")
                            )}
                          />
                        ) : file.metadata &&
                          file.metadata.contentType &&
                          file.metadata.contentType
                            .toLowerCase()
                            .indexOf("pdf") >= 0 ? (
                          <Image
                            src={
                              "https://image.thum.io/get/pdfSource/width/250/" +
                              file.url
                            }
                            alt={file.filename}
                            width="250"
                            height="250"
                            className="h-auto w-auto object-cover transition-all group-hover:scale-105 aspect-square  absolute top-0 left-0"
                            onError={(e) => (
                              console.log("error"),
                              (e.currentTarget.style.display = "none")
                            )}
                          />
                        ) : null}
                        <div className="duration-300 absolute inset-2 z-10 flex justify-end items-start">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-5 w-5"
                              >
                                <MoreVertical className="h-3 w-3" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <DownloadIcon className="h-4 w-4 mr-2" />{" "}
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <PencilIcon className="h-4 w-4 mr-2" /> Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                <TrashIcon className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <h3 className="font-medium leading-none">
                          {file.filename}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {filesize(file?.metadata?.size as number, {
                            round: 0,
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-2 flex w-full justify-end">
              <Button onClick={open}>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </div>
          </div>
        )}
      </Dropzone>
    </>
  );
}
