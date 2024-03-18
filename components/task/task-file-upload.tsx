import { useMutation, useQuery } from "convex/react";
import { UploadDropzone, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { api } from "@/convex/_generated/api";
import { filesize } from "filesize";
import Image from "next/image";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export default function FileUpload({ taskId }: { taskId: Id<"tasks"> }) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageId);
  const files = useQuery(api.files.list, { taskId: taskId });

  const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
    const reader = new FileReader();
    await saveStorageId({
      storageId: (uploaded[0].response as any).storageId,
      filename: uploaded[0].name,
      taskId: taskId,
    });
  };

  return (
    <>
      <UploadDropzone
        uploadUrl={generateUploadUrl}
        uploadImmediately
        fileTypes={{
          "application/pdf": [".pdf"],
          "image/*": [".png", ".gif", ".jpeg", ".jpg"],
        }}
        onUploadComplete={saveAfterUpload}
        onUploadError={(error: unknown) => {
          alert(`ERROR! ${error}`);
        }}
      />
      <div className="grid gap-10 grid-cols-5 p-4">
        {files?.map((file) => (
          <Link
            href={file.url as string}
            target="_blank"
            key={file.url}
            className="space-y-3"
          >
            <div className="overflow-hidden rounded-md border-[1px] relative">
              {file.metadata &&
              file.metadata.contentType &&
              file.metadata.contentType.toLowerCase().indexOf("image") >= 0 ? (
                <Image
                  src={
                    "https://image.thum.io/get/image/fit/500x500/" + file.url
                  }
                  alt={file.filename}
                  width="200"
                  height="200"
                  className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                />
              ) : (
                <Image
                  src={
                    "https://image.thum.io/get/pdfSource/width/500/" + file.url
                  }
                  alt={file.filename}
                  width="200"
                  height="200"
                  className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                />
              )}
              <div className="opacity-0 hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center">
                Hello
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <h3 className="font-medium leading-none">{file.filename}</h3>
              <p className="text-xs text-muted-foreground">
                {filesize(file.metadata?.size as number, { round: 0 })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
