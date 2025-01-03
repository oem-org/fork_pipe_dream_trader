import getStrategyIndicatorsQuery from "@/lib/hooks/react-query/getStrategyIndicatorsQuery";
import GenericSelect from "@/components/ui/lists/generic-select";
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";
import { StrategyIndicator } from "@/interfaces/StrategyIndicator";
import useInitialValue from "@/lib/hooks/useInitialValue";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useUpdateStrategyCondition } from "@/lib/hooks/react-query/useUpdateStrategyConditions";
import { useEffect } from "react";
import { getStrategyConditionApi, putStrategyConditionsApi } from "@/lib/apiClientInstances";

interface IndicatorConditionSelectProps {
  position: number | undefined;
  initialValue: string;
  onValueChange: (value: string) => void;
  conditionId: number,
  blockIndex: number,
  isFirst: boolean,
}

const IndicatorConditionSelect = forwardRef(
  ({ blockIndex, isFirst, position, initialValue, onValueChange, conditionId }: IndicatorConditionSelectProps, ref) => {
    const { strategyId } = useStrategyStore();
    const { data: indicatorSettings } = getStrategyIndicatorsQuery(strategyId);
    const findInitialValue = useInitialValue(
      indicatorSettings || [],
      initialValue,
      (indicator) => indicator.dataframe_column
    );

    //const currentCondition = getStrategyConditionApi.get(conditionId)

    const [selectedIndicator, setSelectedIndicator] = useState<StrategyIndicator | null>(
      findInitialValue
    );

    async function handleChange(item: StrategyIndicator) {
      setSelectedIndicator(item);
      if (onValueChange) {
        onValueChange(item.dataframe_column);
      }
      console.log(conditionId, item.settings)

      let data = {}

      if (isFirst) {
        data = {
          "settings": [{ "indicator": item.dataframe_column }, { "none": null }, { "none": null }]
        }
      } else {

        data = {
          "settings": [{ "note": null }, { "none": null }, { indicator: item.dataframe_column }]
        }
      }

      putStrategyConditionsApi.put(strategyId, conditionId, data)
      console.log(position, conditionId, data, "IndicatorCondtionSelect")

      //putStrategyConditionsApi(strategyId, conditionId, data)
      //console.log(position, conditionId, data, "IndicatorCondtionSelect")
    }


    useEffect(() => {
      console.log(" THE BLOCK Block Index:", position);
    }, [position]);

    useImperativeHandle(ref, () => ({

      getValue: () => ({ indicator: selectedIndicator?.dataframe_column || initialValue }),
      getPosition: () => ({ position: position }),

    }));
    console.log(isFirst, "ISFIRST")
    return (
      <div>
        {isFirst && <p>{isFirst ? "This is the first element" : "ggggg"}</p>}
        <GenericSelect<StrategyIndicator>
          data={indicatorSettings || []}
          keyExtractor={(indicator) => indicator.id}
          nameExtractor={(indicator) => indicator.dataframe_column}
          onSelect={handleChange}
          renderItem={(indicator) => <span>{indicator.dataframe_column}</span>}
          title="Indicator"
          searchEnabled={false}
          initialValue={findInitialValue}
        />
      </div>
    );
  }
);

export default IndicatorConditionSelect;
