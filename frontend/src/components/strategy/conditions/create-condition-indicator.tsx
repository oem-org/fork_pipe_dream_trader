
import getStrategyIndicatorsQuery from "@/lib/hooks/react-query/getStrategyIndicatorsQuery";
import GenericSelect from "@/components/ui/lists/generic-select";
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";
import { StrategyIndicator } from "@/interfaces/StrategyIndicator";
import { useState } from "react";
import React from "react";
import { ConditionElement } from "@/interfaces/Condition";

interface CreateConditionIndicatorProps {
  setIndicator: React.Dispatch<React.SetStateAction<ConditionElement>>;
}

export default function CreateConditionIndicator({ setIndicator }: CreateConditionIndicatorProps) {
  const { strategyId } = useStrategyStore();
  const { data: indicatorSettings } = getStrategyIndicatorsQuery(strategyId);
  const [selectedIndicator, setSelectedIndicator] = useState<StrategyIndicator>();
  // Connect StrategyIndicator id
  function handleChange(indicator: StrategyIndicator) {
    setSelectedIndicator(indicator)
    setIndicator({ indicator: indicator.dataframe_column, id: indicator.id })
    console.log(selectedIndicator)
  }

  return (
    <div>
      <GenericSelect<StrategyIndicator>
        data={indicatorSettings || []}
        keyExtractor={(indicator) => indicator.id}
        nameExtractor={(indicator) => indicator.dataframe_column}
        onSelect={handleChange}
        renderItem={(indicator) => <span>{indicator.dataframe_column}</span>}
        title="Indicator"
        searchEnabled={false}
      />
    </div>
  );
}

