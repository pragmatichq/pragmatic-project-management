"use client";

import { OrganizationList } from "@clerk/nextjs";

export default function OrganizationSelection() {
  return (
    <section>
      <h1>Welcome to the Organization Selection page.</h1>
      <p>
        This part of the application requires the user to select an organization
        in order to proceed. If you are not part of an organization, you can
        accept an invitation or create your own organization.
      </p>
      <OrganizationList
        hidePersonal={true}
        afterCreateOrganizationUrl="/"
        afterSelectOrganizationUrl="/"
      />
    </section>
  );
}
