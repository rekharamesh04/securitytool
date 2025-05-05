// app/datastores/mongo/classified-data/page.tsx
import DataSourceLayout from "@/components/admin/company/data-source/DataSourceLayout";
import ClassifiedDataTab from "@/components/admin/company/data-source/classifiedData";

export default function ClassifiedDataPage() {
  return (
    <DataSourceLayout>
      <ClassifiedDataTab />
    </DataSourceLayout>
  );
}