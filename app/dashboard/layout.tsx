"use client";

import React from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
