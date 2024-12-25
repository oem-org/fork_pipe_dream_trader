import { useParams, useNavigate } from "react-router-dom";
import getStrategyQuery from "@/lib/queries/getStrategyQuery";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import { useState, useEffect } from "react";
import { Strategy, DatabaseSource, FileSource } from "@/interfaces/Strategy";
import { File } from "@/interfaces/File";
import { Button } from "@/components/ui/buttons/button";
import GenericSelect from "@/components/ui/lists/generic-select";
import getFilesQuery from "@/lib/queries/getFilesQuery";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import IndicatorSection from "@/components/strategy/indicator-section";
import Charts from "@/components/ui/chart/charts";
import Modal from "@/components/ui/modal";
import { InfoIcon } from "lucide-react";
import SettingsDropdown from "@/components/strategy/settings-dropdown";

import { useUpdateStrategy } from "@/lib/hooks/useUpdateStrategy";
import ConditionsSection from "@/components/strategy/conditions/conditions-section";
import useFileStore from "@/lib/hooks/useFileStore";

export default function StrategyPage() {
  // TODO: use name instead of id
  const { id } = useParams();
  const paramId = id ? parseInt(id) : NaN;
  const { fileId, strategyId, setFileId, setStrategyId } = useStrategyStore();
  //const navigate = useNavigate();
  const [rerender, setRerender] = useState<number>(0)

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const toggleInfoModal = () => setIsInfoModalOpen(!isInfoModalOpen);

  //const [dataSourceType, setDataSourceType] = useState<string>("");


  const { data: strategy, error, isError, isLoading } = getStrategyQuery(paramId);
  //const { data: strategies } = getStrategiesQuery();
  const { data: files } = getFilesQuery();

  const { mutateAsync: updateStrategyMutation } = useUpdateStrategy();


  useEffect(() => {
    console.log(paramId, "stragegy id", strategyId);

    setStrategyId(paramId);
  }, [paramId]);

  const handleFileChange = async (file: File) => {
    if (strategy) {
      console.log(strategy.fk_file_id)
      strategy.fk_file_id = file.id
      // returns the updated strategy
      const resp = await updateStrategyMutation(strategy);
      if (resp) {
        setFileId(file.id);
      }
    }
  };

  //const handleStrategyChange = (strategy: Strategy) => {
  //  navigate(`/strategy/${strategy.id}`);
  //};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  //TODO: fix hover on settings
  return (
    <div className="container mx-auto px-4 space-y-6">
      {strategy ? (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <article className="lg:col-span-1 p-4 bg-gray-100 rounded-lg">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row">
                  <h3 className="h3 mb-4">{strategy.name}</h3>
                  <InfoIcon className="ml-2 mt-1" onClick={() => toggleInfoModal()} />
                </div>
                <SettingsDropdown strategyId={strategyId} />
              </div>

              <hr className='py-1' />
              <Modal onClose={toggleInfoModal} isOpen={isInfoModalOpen} title="Description">
                <pre className="whitespace-pre-wrap break-words p-4">
                  {strategy.description}
                </pre>
              </Modal>



              <h4 className=".h4">Change file</h4>
              <GenericSelect<File>
                data={files || []}
                keyExtractor={(file) => file.id}
                nameExtractor={(file) => file.name}
                onSelect={handleFileChange}
                renderItem={(file) => <span>{file.name}</span>}
                title="Select or search"
                searchEnabled={true}
              />

            </article>
            <div className="lg:col-span-3">
              <Charts />
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-8 gap-4">
            <div className="lg:col-span-3 p-4 bg-gray-100 rounded-lg">
              <IndicatorSection fileId={fileId} strategyId={strategyId} />
            </div>
            <section className="lg:col-span-3 p-4 bg-gray-100 rounded-lg">
              <ConditionsSection />
            </section>

            <section className="lg:col-span-2 p-4 bg-gray-100 rounded-lg">
              <h2 className="h2 mb-4">Backtest</h2>
              <p>This section contains backtest results for the strategy.</p>
            </section>
          </section>
        </>
      ) : (
        <p>Strategy not found.</p>
      )
      }
    </div >
  );
}


//<article>
//  <h4 className=".h4">Change strategy</h4>
//  <GenericSelect<Strategy>
//    data={strategies || []}
//    keyExtractor={(strategy) => strategy.id}
//    nameExtractor={(strategy) => strategy.name}
//    onSelect={handleStrategyChange}
//    renderItem={(strategy) => <span>{strategy.name}</span>}
//    title="Select or search"
//    searchEnabled={true}
//  />
//</article>
//title
