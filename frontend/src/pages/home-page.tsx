import getStrategiesQuery from "@/lib/hooks/react-query/getStrategiesQuery";
import { Strategy } from "@/interfaces/Strategy";
import { Link } from "react-router-dom";
import StrategyInfo from "@/components/strategy/strategy-info";
import { useState } from "react";
import StrategyTableRow from "@/components/strategy/conditions/strategy-table-row";
import { useQueryClient } from "@tanstack/react-query";
import GenericComponentList from "@/components/ui/lists/generic-component-table";

export default function HomePage() {
  const { data: strategies, isError, isLoading, error } = getStrategiesQuery();

  const queryClient = useQueryClient();
  const [localStrategyId, setLocalStrategyId] = useState<number>(0);

  const handleStrategyChange = (strategy: Strategy) => {
    queryClient.invalidateQueries({ queryKey: ["strategyConditions"] });
    setLocalStrategyId(strategy.id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  //TODO: margin bottom background color
  return (
    <div className=" flex flex-col h-[calc(100vh-64px)]">

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 custom-grid-full-spacing">
        <section className="bg-gray-100 rounded-lg flex flex-col overflow-auto h-[calc(100vh-64px)]">
          <div className="p-4 flex flex-row justify-between">
            <h2 className="h2 mb-4">Strategies</h2>
            <Link to="/create-strategy" className="btn-primary">
              Create new strategy
            </Link>
          </div>
          <GenericComponentList<Strategy>
            data={strategies || []}
            keyExtractor={(strategy) => strategy.id}
            nameExtractor={(strategy) => strategy.name}
            onSelect={handleStrategyChange}
            renderItem={(strategy) => {
              return <div><StrategyTableRow strategy={strategy} setLocalStrategyId={setLocalStrategyId} /></div>;
            }}
            searchEnabled={true}
          />
        </section>

        <section className="p-4 bg-gray-100 rounded-lg overflow-auto h-[calc(100vh-64px)]">
          <h4 className="text-xl font-bold mb-4">Info</h4>
          <StrategyInfo strategyId={localStrategyId} />
        </section>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"></div>
    </div>
  );
}
