import getStrategyIndicatorsQuery from '@/lib/queries/getStrategyIndicatorsQuery';
import GenericSelect from '../../ui/lists/generic-select';
import Indicator from '@/interfaces/Indicator';
import useStrategyStore from '@/lib/hooks/useStrategyStore';
import { StrategyIndicator } from '@/interfaces/StrategyIndicator';
import { SettingsIcon } from 'lucide-react';
import Dropdown from '../../ui/navigation/dropdown';
import BuildConditionRenderer from './build-condition-renderer';
import { Input } from '../../ui/forms/input';

import { Plus } from 'lucide-react';


export default function ConditionSelect() {

  // Access the cache and filter for `strategyIndicators` entries
  const { strategyId } = useStrategyStore()
  function handleIndicatorChange(indicator: StrategyIndicator): void {
    try {
      // Using the destructured mutateAsync
      console.log("Indicator added successfully:", indicator);

    } catch (error) {
      console.error("Error adding indicator:");
    }
  };
  function handleOperatorChange(operator: Operator): void {
    try {
      // Using the destructured mutateAsync
      console.log("Indicator added successfully:", operator);

    } catch (error) {
      console.error("Error adding indicator:");
    }
  }

  function addValueInput() {
    console.log("val7e");

  }
  function addIndicatorSelect() {
    console.log("val7e");

  }


  function addOperatorSelect() {
    console.log("val7e");

  }
  const operators = [{ "id": 1, "name": "=" }, { "id": 2, "name": "<" }];


  const { data: indicatorSettings } = getStrategyIndicatorsQuery(strategyId);

  const defaultConds = [[{ "indicator": null }, { "operator": null }, { "value": 1 }], "&", [{ "indicator": null }, { "operator": null }, { "indicator": null }]]



  return (
    <>
      <BuildConditionRenderer conditions={defaultConds} />
      <form>
        <Dropdown textColor="text-black" icon={Plus} animation={false} direction="right">
          <button onClick={() => addIndicatorSelect()} className="btn-dropdown">Delete</button>
          <button onClick={() => addValueInput()} className="btn-dropdown">Rename</button>
          <button onClick={() => addOperatorSelect()} className="btn-dropdown">Rename</button>
        </Dropdown>
      </form>
    </>);
};

