// CreateBroadcastButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CreateBroadcastButtonProps {
  className?: string;
  buttonText: string;
  variant?:
    | "outline"
    | "default"
    | "link"
    | "destructive"
    | "secondary"
    | "ghost";
  Icon: React.ElementType; // Allows passing of any component as an icon
}

export const CreateBroadcastButton: React.FC<CreateBroadcastButtonProps> = ({
  className,
  variant,
  buttonText,
  Icon,
}) => {
  const router = useRouter();
  const createBroadcast = useMutation(api.broadcasts.create);

  const createNewBroadcast = async () => {
    const newBroadcast = await createBroadcast();
    router.push(`/dashboard/broadcasts/${newBroadcast}`);
  };

  return (
    <Button
      className={className}
      onClick={createNewBroadcast}
      variant={variant}
    >
      <Icon className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
};
