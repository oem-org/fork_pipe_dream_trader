import GenericSelect from "@/components/ui/lists/generic-select";
import {Strategy} from "@/interfaces/Strategy";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import { useState } from "react";
export default function SelectStrategyPage() {
  const { data: dataStrategies } = getStrategiesQuery();
  const [strategyId, setStrategyId] = useState<number>(0);

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2" >
      <p>Select a strategy</p>
      <GenericSelect<Strategy>
        data={dataStrategies || []}
        keyExtractor={(strategy) => strategy.id}
        onSelect={(strategy) => {
          setStrategyId(strategy.id);
          console.log(strategy.id, "Selected Strategy ID");
        }}
        renderItem={(strategy) => <span>{strategy.name}</span>}
        title="Select or search"
        searchEnabled={true}
      />
    </div >
  );
}
