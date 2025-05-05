// app/datastores/mongo/overview/page.tsx
import DataSourceLayout from "@/components/admin/company/data-source/DataSourceLayout";
import OverviewTab from "@/components/admin/company/data-source/overview";

export default function OverviewPage() {
  return (
    <DataSourceLayout>
      <OverviewTab />
    </DataSourceLayout>
  );
}