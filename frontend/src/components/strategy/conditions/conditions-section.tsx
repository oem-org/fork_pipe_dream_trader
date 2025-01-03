import { Button } from '@/components/ui/buttons/button';
import { BacktestService } from '@/lib/services/BacktestService';
import BuildConditionRenderer from './build-condition-renderer';
import { useCallback, useRef, useState, useEffect } from 'react';
import CreateConditions from './create-conditions';
import useStrategyStore from '@/lib/hooks/stores/useStrategyStore';
import { getAllStrategyConditionsApi, postStrategyBacktestApi, postStrategyConditionsApi } from '@/lib/apiClientInstances';
import { CreateBacktestRequest } from '@/interfaces/Backtest';


export default function ConditionsSection() {
  const { strategyId } = useStrategyStore();
  const [sellConditions, setSellConditions] = useState<any[]>([]);
  const [buyConditions, setBuyConditions] = useState<any[]>([]);
  const [refetch, setRefetch] = useState<number>(0);

  const fetchConditions = useCallback(async (strategyId: number, side: "buy" | "sell") => {
    try {
      const data = await getAllStrategyConditionsApi.getAll(strategyId);
      const filteredConditions = data
        .filter((condition) => condition.side === side)
        .map((condition) => ({
          id: condition.id,
          position: condition.position,
          settings: condition.settings,
        }));

      console.log(`Filtered ${side.charAt(0).toUpperCase() + side.slice(1)} Conditions:`, filteredConditions);
      return filteredConditions;
    } catch (error) {
      console.error(`Error fetching ${side} conditions:`, error);
      throw new Error(`Failed to fetch ${side} conditions`);
    }
  }, []);

  const fetchStrategyConditions = useCallback(async () => {
    try {
      const [buyConditions, sellConditions] = await Promise.all([
        fetchConditions(strategyId, "buy"),
        fetchConditions(strategyId, "sell"),
      ]);

      setBuyConditions(buyConditions);
      setSellConditions(sellConditions);
    } catch (error) {
      console.error("Error in fetchStrategyConditions:", error);
    }
  }, [fetchConditions, strategyId]);

  useEffect(() => {
    fetchStrategyConditions();
  }, [fetchStrategyConditions, refetch]);

  const addCondition = useCallback(async (newCondition: any) => {
    try {
      console.log("Adding!!!!!!!!!!!!!!!!! this strategy condition", newCondition);

      const response = await postStrategyConditionsApi.post(strategyId, {
        settings: newCondition.settings,
        side: newCondition.side,
      });

      console.log("Condition added successfully!!!!!!!!!!!!!!!!!!!!!", response);

      await fetchStrategyConditions(); // Ensure updated conditions are fetched.
    } catch (error) {
      console.error("Error adding condition:", error);
    }
  }, [fetchStrategyConditions, strategyId]);

  const buyStringRef = useRef<{ createConditionString: () => Array<any> }>(null);
  const sellStringRef = useRef<{ createConditionString: () => Array<any> }>(null);

  const runBacktest = useCallback(() => {
    let buy = [];
    let sell = [];
    if (buyStringRef.current) {
      buy = buyStringRef.current.createConditionString();
    }

    if (sellStringRef.current) {
      sell = sellStringRef.current.createConditionString();
    }

    const sellConds = new BacktestService(sell);
    const buyConditions = sellConds.processConditions();

    const buyConds = new BacktestService(buy);
    const sellConditions = buyConds.processConditions();

    let data: CreateBacktestRequest = {
      buy_conditions: JSON.stringify(buyConditions),
      sell_conditions: JSON.stringify(sellConditions),
    };
    console.log("OUTPUT:", sellConditions);
    console.log("OUTPUT:", buyConditions);
    postStrategyBacktestApi.post(strategyId, data);
  }, [strategyId]);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h2 className="h2 mb-4">Strategy</h2>
        <Button onClick={() => runBacktest()}>Run Backtest</Button>
      </div>
      <hr className="py-1" />
      <div className='flex flex-row'>
        <div>
          <h3 className='h3 pb-4'>Buy conditions</h3>

          <div className="flex flex-row">
            <BuildConditionRenderer setRefetch={setRefetch} side="buy" ref={buyStringRef} conditions={buyConditions} />
          </div>
          <div className='flex flex-col'>
            <CreateConditions side="buy" addCondition={addCondition} />
          </div>
        </div>
        <div>

          <h3 className='h3 pb-4'>Sell conditions</h3>
          <div className="flex flex-row">
            <BuildConditionRenderer setRefetch={setRefetch} side="sell" ref={sellStringRef} conditions={sellConditions} />
          </div>

          <div className='flex flex-col'>
            <CreateConditions side="sell" addCondition={addCondition} />

          </div>
        </div>
      </div>
    </div>
  );
}
