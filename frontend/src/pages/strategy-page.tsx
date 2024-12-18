import { useParams, useNavigate } from "react-router-dom";
import getStrategyQuery from "@/lib/queries/getStrategyQuery";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import { useState, useEffect } from "react";
import { Strategy, DatabaseSource, FileSource } from "@/interfaces/Strategy";
import File from "@/interfaces/File";
import GenericSelect from "@/components/ui/lists/generic-select";
import getFilesQuery from "@/lib/queries/getFilesQuery";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import IndicatorSection from "@/components/strategy/indicator-section";
import { Button } from "@/components/ui/buttons/button";
import Charts from "@/components/ui/chart/charts";
import Modal from "@/components/ui/modal";

export default function StrategyPage() {
  const { id } = useParams();
  const paramId = id ? parseInt(id) : NaN;
  const { setStrategyId } = useStrategyStore();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);


  const [fileId, setFileId] = useState<number>(0);
  const [dataSourceType, setDataSourceType] = useState<string>("");


  const { data: strategy, error, isError, isLoading } = getStrategyQuery(paramId);
  const { data: strategies } = getStrategiesQuery();
  const { data: files } = getFilesQuery();

  useEffect(() => {
    setStrategyId(paramId);
  }, [paramId]);

  const handleFileChange = async (file: File) => {
    setFileId(file.id);
  };

  const handleStrategyChange = (strategy: Strategy) => {
    navigate(`/strategy/${strategy.id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 space-y-6">
      {strategy ? (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <article className="lg:col-span-1 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-xl font-bold mb-4">{strategy.name}</h4>
              <Button onClick={() => toggleModal()}>Information</Button>
              <Modal onClose={toggleModal} isOpen={isModalOpen} title={"Description"}>
                <section>
                  <pre class="whitespace-pre-wrap break-words p-4 rounded-md">
                    {strategy.description}
                  </pre>

                </section>
              </Modal>

              <GenericSelect<File>
                data={files || []}
                keyExtractor={(file) => file.id}
                nameExtractor={(file) => file.name}
                onSelect={handleFileChange}
                renderItem={(file) => <span>{file.name}</span>}
                title="Select or search"
                searchEnabled={true}
              />
              <GenericSelect<Strategy>
                data={strategies || []}
                keyExtractor={(strategy) => strategy.id}
                nameExtractor={(strategy) => strategy.name}
                onSelect={handleStrategyChange}
                renderItem={(strategy) => <span>{strategy.name}</span>}
                title="Select or search"
                searchEnabled={true}
              />
            </article>
            <div className="lg:col-span-3">
              <Charts />
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 p-4 bg-gray-100 rounded-lg">
              <IndicatorSection />
            </div>
            <section className="lg:col-span-1 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Backtest</h4>
              <p>This section contains backtest results for the strategy.</p>
            </section>
          </section>
        </>
      ) : (
        <p>Strategy not found.</p>
      )}
    </div>
  );
}


//title
//<p className="absolute top-0 left-0 p-2 z-10 bg-white bg-opacity-75 rounded transparent-bg">
//  {/* Any additional content like loading or info can go here */}
//</p>
