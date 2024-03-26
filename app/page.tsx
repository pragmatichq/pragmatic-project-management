"use client";

import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="flex gap-4 w-fit mx-auto my-8">
      <Link href="/portal" className="p-12 border">
        Portal
      </Link>
      <Link href="/dashboard" className="p-12 border">
        Dashboard
      </Link>
    </div>
  );
}
