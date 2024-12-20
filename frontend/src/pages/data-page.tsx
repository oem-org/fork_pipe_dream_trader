import FileUploadForm from "@/components/data/file-uploader"
import DataTable from "@/components/data/data-table";
import GenericTable from "@/components/ui/lists/generic-table";
import getFilesQuery from "@/lib/queries/getFilesQuery";
import { File } from "@/interfaces/File";
import { useState } from "react";

export default function DataPage() {

  const { data: files } = getFilesQuery();
  const [fileId, setFileId] = useState<number>(1);
  //const navigate = useNavigate();

  const handleFileChange = async (file: File) => {
    setFileId(file.id);
    console.log(file.id)
  };


  return (
    <div className="container mx-auto px-4 space-y-6">


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="p-4 bg-gray-100 rounded-lg">
          <div className="flex flex-col">
            <h2 className="h2 mb-4">Files</h2>
            <FileUploadForm />
          </div>
          <GenericTable<File>
            data={files || []}
            keyExtractor={(file) => file.id}
            nameExtractor={(file) => file.name}
            onSelect={handleFileChange}
            renderItem={(file) => <span>{file.name}</span>}
            searchEnabled={true}
          />
        </section>
        <section className="p-4 bg-gray-100 rounded-lg">
          <DataTable id={fileId} />
        </section>
      </div>
    </div>
  );
}
