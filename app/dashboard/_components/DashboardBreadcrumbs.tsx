import { UserButton } from "@clerk/nextjs";
import { Separator } from "../../../components/ui/separator";
import { HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useContext } from "react";
import { BreadcrumbContext } from "@/app/dashboard/_contexts/BreadcrumbContext";
import Link from "next/link";

export default function DashboardBreadcrumbs() {
  const { breadcrumbs } = useContext(BreadcrumbContext);
  return (
    <div className="">
      <div className="text-sm w-full p-2 pl-4 flex justify-between">
        <Breadcrumb className="flex items-center">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center">
                  <HomeIcon className="size-[0.85rem] mr-2" />
                  <span>Dashboard</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <UserButton />
      </div>
      <Separator />
    </div>
  );
}
