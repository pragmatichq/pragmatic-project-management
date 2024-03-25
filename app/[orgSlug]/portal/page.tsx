"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";

export default function PortalPage() {
  return (
    <section className="my-8 flex flex-col space-y-4">
      <h2 className="text-4xl font-bold tracking-tight">Inbox</h2>
      <section className="flex flex-row gap-4">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Waiting On You</CardTitle>
          </CardHeader>
          <CardContent>Lorem ipsum...</CardContent>
        </Card>
        <Card className="min-w-[350px]">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>Lorem ipsum...</CardContent>
        </Card>
      </section>
      <section>
        <Card className="relative">
          <Button className="absolute top-6 right-6">
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Button>
          <CardHeader>
            <CardTitle className="flex-grow">Actions</CardTitle>
            <CardDescription>
              Active actions you're marked as a stakeholder on.
            </CardDescription>
          </CardHeader>
          <CardContent>Lorem ipsum...</CardContent>
        </Card>
      </section>
    </section>
  );
}
