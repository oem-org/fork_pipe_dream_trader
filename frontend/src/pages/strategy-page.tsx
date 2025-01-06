import { useParams } from "react-router-dom";
import getStrategyQuery from "@/lib/hooks/react-query/getStrategyQuery";
import { useState, useEffect } from "react";
import { File } from "@/interfaces/File";
import GenericSelect from "@/components/ui/lists/generic-select";
import getFilesQuery from "@/lib/hooks/react-query/getFilesQuery";
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";
import IndicatorSection from "@/components/strategy/indicator-section";
import Charts from "@/components/ui/chart/charts";
import Modal from "@/components/ui/modal";
import { InfoIcon } from "lucide-react";
import SettingsDropdown from "@/components/strategy/settings-dropdown";
import { useUpdateStrategy } from "@/lib/hooks/react-query/useUpdateStrategy";
import ConditionsSection from "@/components/strategy/conditions/conditions-section";
import { queryClient } from "@/main";
import { removeSurroundingQuotes } from "@/lib/utils/string-utils";
import { getLatestStrategyBacktestsApi } from "@/lib/apiClientInstances";



export default function StrategyPage() {
  // TODO: use name instead of id
  const { id } = useParams();
  const paramId = id ? parseInt(id) : NaN;
  const { fileId, strategyId, setFileId, setStrategyId } = useStrategyStore();

  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const toggleInfoModal = () => setIsInfoModalOpen(!isInfoModalOpen);

  const { data: strategy, error, isError, isLoading } = getStrategyQuery(paramId);
  const { data: files } = getFilesQuery();

  const { mutateAsync: updateStrategyMutation } = useUpdateStrategy();
  const [initialValue, setInitialValue] = useState<File>()

  const [pair, setPair] = useState<string>("")
  const [timeframe, setTimeframe] = useState<string>("")
  const [backtest, setBacktest] = useState<string>("")

  useEffect(() => {
    console.log(paramId, "stragety id", strategyId);
    // Remove entire cache on navigating to the page
    queryClient.invalidateQueries()

    setStrategyId(paramId);
  }, [paramId]);

  const handleFileChange = async (file: File) => {
    if (strategy) {
      console.log(strategy.fk_file_id)
      strategy.fk_file_id = file.id
      const resp = await updateStrategyMutation(strategy);
      if (resp) {
        setFileId(file.id);
      }
    }
  };

  // Set the initial file for the file dropdown
  useEffect(() => {
    if (strategy && strategy.fk_file_id && files) {
      const selectedFile = files?.find((file) => file.id === strategy.fk_file_id);
      if (selectedFile) {
        setInitialValue(selectedFile);
      }
    }
  }, [strategy, files])

  useEffect(() => {
    async function getBacktests() {
      // If state for strategyId is not set it will result in being 0
      if (strategyId > 0) {
        const result = await getLatestStrategyBacktestsApi.getAll(strategyId)
        console.log(result, "BT")
        setBacktest(result)

      }
    }
    getBacktests()
  }, [strategy])


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }
  //TODO: hide file ui if datasource
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
                  <InfoIcon className="cursor-pointer ml-2 mt-1" onClick={() => toggleInfoModal()} />
                </div>
                <SettingsDropdown strategyId={strategyId} />
              </div>
              <div className="flex flex-row">
                <h4 className="h4">Pair:</h4> <p> &nbsp;{removeSurroundingQuotes(pair)}</p>
              </div>
              <div className="flex flex-row">
                <h4 className="h4 mb-2">Timeframe:</h4> <p> &nbsp;{removeSurroundingQuotes(timeframe)}</p>
              </div>
              <hr className='py-1' />
              <Modal onClose={toggleInfoModal} isOpen={isInfoModalOpen} title="Description">
                <pre className="whitespace-pre-wrap break-words p-4">
                  {strategy.description}
                </pre>
              </Modal>

              <h4 className="h4">File</h4>
              <GenericSelect<File>
                data={files || []}
                keyExtractor={(file) => file.id}
                nameExtractor={(file) => file.name}
                onSelect={handleFileChange}
                renderItem={(file) => <span>{file.name}</span>}
                title="Select or search"
                searchEnabled={true}
                initialValue={initialValue}
              />
              <hr className='py-1 mt-4' />
              <h4 className="h4 mt-2">Backtest Results</h4>

            </article>
            <div className="lg:col-span-3">
              <Charts />
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-8 gap-4">
            {/* IndicatorSection Loads all data related to the indicators and the chart and saves it in state */}
            <div className="lg:col-span-2 p-4 bg-gray-100 rounded-lg">
              <IndicatorSection setTimeframe={setTimeframe} setPair={setPair} fileId={fileId} strategyId={strategyId} />
            </div>
            <div className="lg:col-span-6 p-4 bg-gray-100 rounded-lg">
              <ConditionsSection setBacktest={setBacktest} />
            </div>
          </section>
        </>
      ) : (
        <p>Strategy not found.</p>
      )
      }
    </div >
  );
}

