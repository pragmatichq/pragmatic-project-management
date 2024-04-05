"use client";

import React, { useContext, useEffect } from "react";
import { BreadcrumbContext } from "./_contexts/BreadcrumbContext";

export default function actionListPage() {
  const { setBreadcrumbs } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumbs([]);
  }, []);
  return (
    <div className="flex flex-col space-y-2 p-4">
      <h2 className="text-4xl font-bold tracking-tight">Inbox</h2>
    </div>
  );
}
