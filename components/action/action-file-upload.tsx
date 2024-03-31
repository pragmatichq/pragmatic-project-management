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
  MoreVertical,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

export default function FileUpload({ actionId }: { actionId: Id<"actions"> }) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageId);
  const files = useQuery(api.files.list, { actionId: actionId });

  const { startUpload, isUploading } = useUploadFiles(generateUploadUrl, {
    onUploadBegin: (fileName) => {
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
  console.log(files && files?.length > 0);

  return (
    <>
      <Dropzone
        onDrop={(acceptedFiles) => startUpload(acceptedFiles)}
        multiple={false}
        noClick={files && files?.length > 0}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {files?.length === 0 || !files ? (
              <div>No files. Drag and drop or click to upload.</div>
            ) : (
              <div className="grid gap-10 grid-cols-5 p-4">
                {" "}
                {files?.map((file) => (
                  <Link
                    href={file.url as string}
                    target="_blank"
                    key={file.url}
                    className="space-y-3"
                  >
                    <div className="overflow-hidden rounded-md border-[1px] group relative">
                      {file.metadata &&
                      file.metadata.contentType &&
                      file.metadata.contentType
                        .toLowerCase()
                        .indexOf("image") >= 0 ? (
                        <Image
                          src={
                            "https://image.thum.io/get/image/fit/500x500/" +
                            file.url
                          }
                          alt={file.filename}
                          width="200"
                          height="200"
                          className="h-auto w-auto object-cover transition-all group-hover:scale-105 aspect-square"
                        />
                      ) : (
                        <Image
                          src={
                            "https://image.thum.io/get/pdfSource/width/500/" +
                            file.url
                          }
                          alt={file.filename}
                          width="200"
                          height="200"
                          className="h-auto w-auto object-cover transition-all group-hover:scale-105 aspect-square"
                        />
                      )}
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
                              <DownloadIcon className="h-4 w-4 mr-2" /> Download
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
                        {filesize(file.metadata?.size as number, { round: 0 })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </>
  );
}
