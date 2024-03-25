"use client";

import { useEffect } from "react";
import { useParams, redirect } from "next/navigation";
import { useAuth, useOrganizationList } from "@clerk/nextjs";

export function SyncActiveOrganization() {
  const { setActive, isLoaded } = useOrganizationList();
  const { orgSlug } = useAuth();
  const { orgSlug: urlOrgSlug } = useParams() as { orgSlug: string };

  useEffect(() => {
    if (!isLoaded) return;
    if (urlOrgSlug && urlOrgSlug !== orgSlug) {
      redirect("/" + orgSlug + "/dashboard");
    }
  }, [orgSlug, isLoaded, setActive, urlOrgSlug]);

  return null;
}
