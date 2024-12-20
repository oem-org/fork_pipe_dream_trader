import getFilesQuery from "@/lib/queries/getFilesQuery";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import GenericTable from "@/components/ui/lists/generic-table";
import { Strategy } from "@/interfaces/Strategy";
import { File} from "@/interfaces/File";
import { useEffect, useState } from "react";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { data: strategies } = getStrategiesQuery();
  const { data: files } = getFilesQuery();
  const [fileId, setFileId] = useState<number>(0);
  const navigate = useNavigate();

  const handleFileChange = async (file: File) => {
    setFileId(file.id);
  };

  const handleStrategyChange = (strategy: Strategy) => {
    navigate(`/strategy/${strategy.id}`);
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  //
  // if (isError && error instanceof Error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="p-4 bg-gray-100 rounded-lg">
          <h2 className="h2 mb-4">Strategies</h2>
          <GenericTable<Strategy>
            data={strategies || []}
            keyExtractor={(strategy) => strategy.id}
            nameExtractor={(strategy) => strategy.name}
            onSelect={handleStrategyChange}
            renderItem={(strategy) => <span>{strategy.name}</span>}
            searchEnabled={true}
          />
        </section>

        <section className="p-4 bg-gray-100 rounded-lg">
          <h2 className="h2 mb-4">Files</h2>
          <GenericTable<File>
            data={files || []}
            keyExtractor={(file) => file.id}
            nameExtractor={(file) => file.name}
            onSelect={handleFileChange}
            renderItem={(file) => <span>{file.name}</span>}
            searchEnabled={true}
          />
        </section>
      </div>

      {/* Optional Backtest Section (can go below or be added in the same grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <section className="p-4 bg-gray-100 rounded-lg">
          <h4 className="text-xl font-bold mb-4">Backtest</h4>
          {/* Backtest Content Here */}
        </section>
      </div>
    </div>
  );
}
