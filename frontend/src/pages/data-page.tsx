import FileUploadForm from "@/components/data/file-uploader"
import DataTable from "@/components/data/data-table";
import GenericList from "@/components/ui/lists/generic-table";
import getFilesQuery from "@/lib/hooks/react-query/getFilesQuery";
import { File } from "@/interfaces/File";
import { useState } from "react";

export default function DataPage() {
  const { data: files } = getFilesQuery();
  const [fileId, setFileId] = useState<number>(1);

  const handleFileChange = async (file: File) => {
    setFileId(file.id);
    console.log(file.id)
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 custom-grid-full-spacing overflow-hidden">
        <section className="bg-gray-100 rounded-lg flex flex-col overflow-hidden">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Files</h2>
            <FileUploadForm />
          </div>
          <div className="flex-grow overflow-auto p-4">
            <GenericList<File>
              data={files || []}
              keyExtractor={(file) => file.id}
              nameExtractor={(file) => file.name}
              onSelect={handleFileChange}
              renderItem={(file) => <span>{file.name}</span>}
              searchEnabled={true}
            />
          </div>
        </section>
        <section className="bg-gray-100 rounded-lg flex flex-col overflow-hidden">
          <div className="flex-grow overflow-auto p-4">
            <DataTable id={fileId} />
          </div>
        </section>
      </div>
    </div>
  );
}

