import { UserButton } from "@clerk/nextjs";
import { Separator } from "../ui/separator";
import { HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useContext } from "react";
import { LayoutContext } from "@/app/dashboard/_contexts/LayoutContext";

export default function LayoutTitle() {
  const { breadcrumbs } = useContext(LayoutContext);
  return (
    <div className="">
      <div className="text-sm w-full p-2 pl-4 flex justify-between">
        <Breadcrumb className="flex items-center">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="flex">
                <HomeIcon className="w-4 h-4 mr-2" />
                <span>Dashboard</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {breadcrumbs.map((breadcrumb, index) =>
              index === breadcrumbs.length - 1 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink>{breadcrumb}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <UserButton />
      </div>
      <Separator />
    </div>
  );
}
