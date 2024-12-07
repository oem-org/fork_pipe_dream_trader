import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import getStrategyQuery from "@/lib/queries/getStrategyQuery";

function StrategyPage() {
  const { id } = useParams();
  const strategyId = id ? parseInt(id) : NaN;

  const { data: strategy, error, isError, isLoading } = getStrategyQuery(strategyId)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="">
      {strategy ? (
        <div>
          <h1>{strategy.name}</h1>
          <p>{strategy.description}</p>
        </div>
      ) : (
        <p>Strategy not found.</p>
      )}
    </div>
  );
}

export default StrategyPage;
