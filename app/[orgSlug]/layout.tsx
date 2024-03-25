import { type PropsWithChildren } from "react";
import { SyncActiveOrganization } from "./SyncActiveOrganization";

export default function OrganizationLayout(props: PropsWithChildren) {
  return (
    <>
      <SyncActiveOrganization />
      {props.children}
    </>
  );
}
