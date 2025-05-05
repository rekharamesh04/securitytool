// app/datastores/mongo/issues/page.tsx
import DataSourceLayout from "@/components/admin/company/data-source/DataSourceLayout";
import IssuesTab from "@/components/admin/company/data-source/issues";

export default function IssuesPage() {
  return (
    <DataSourceLayout>
      <IssuesTab />
    </DataSourceLayout>
  );
}