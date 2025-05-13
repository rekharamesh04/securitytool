import IssuesPage from "@/app/admin/(dashboard)/company/data-source/issues/page";
import DataSourceLayout from "@/components/company/data-source/DataSourceLayout";

export default function IssuesTab() {
    return (
        <DataSourceLayout>
            <IssuesPage />
        </DataSourceLayout>
    );
}