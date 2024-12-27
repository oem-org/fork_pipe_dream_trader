import React from 'react';
import getStrategyQuery from '@/lib/hooks/react-query/getStrategyQuery';
import { Strategy, FileSource, DatabaseSource, StrategyCondition, StrategyIndicator, StrategyBacktest } from "@/interfaces/Strategy"

interface StrategyInfoProps {
	strategyId: number;
}

const StrategyInfo: React.FC<StrategyInfoProps> = ({ strategyId }) => {
	const { data: strategy, error, isError, isLoading } = getStrategyQuery(strategyId);

	// Check loading and error states
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error?.message}</div>;
	}

	if (!strategy) {
		return <div>No strategy found</div>;
	}

	return (
		<div>
			<h1>{strategy.name}</h1>
			<p>{strategy.description}</p>

			{strategy.fk_file_id && (
				<div>
					<h3>File Information</h3>
				</div>
			)}

			{strategy.data_source && (
				<div>
					<h3>Data Source</h3>
					{isFileSource(strategy.data_source) ? (
						<div>
							<p>File ID: {strategy.data_source.fk_file_id}</p>
							{strategy.data_source.timeperiod && <p>Timeperiod: {strategy.data_source.timeperiod}</p>}
						</div>
					) : (
						<div>
							<p>Table: {strategy.data_source.table}</p>
							<p>Pair: {strategy.data_source.pair}</p>
							{strategy.data_source.timeperiod && <p>Timeperiod: {strategy.data_source.timeperiod}</p>}
						</div>
					)}
				</div>
			)}

			{strategy.file && (
				<div>
					<h3>File Details</h3>
					<p>File Path: {strategy.file.path}</p>
					<p>File Name: {strategy.file.name}</p>
					<p>File Type: {strategy.file.file_type}</p>
					{strategy.file.pair && <p>Pair: {strategy.file.pair}</p>}
				</div>
			)}

			{strategy.strategy_conditions && strategy.strategy_conditions.length > 0 && (
				<div>
					<h3>Strategy Conditions</h3>
					{strategy.strategy_conditions.map((condition: StrategyCondition) => (
						<div key={condition.id}>
							<p>Side: {condition.side}</p>
							{condition.settings && (
								<div>
									<h4>Settings</h4>
									<pre>{JSON.stringify(condition.settings, null, 2)}</pre>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{strategy.strategy_indicators && strategy.strategy_indicators.length > 0 && (
				<div>
					<h3>Strategy Indicators</h3>
					{strategy.strategy_indicators.map((indicator: StrategyIndicator) => (
						<div key={indicator.id}>
							{indicator.dataframe_column && <p>Dataframe Column: {indicator.dataframe_column}</p>}
							{indicator.settings && (
								<div>
									<h4>Settings</h4>
									<pre>{JSON.stringify(indicator.settings, null, 2)}</pre>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{strategy.backtests && strategy.backtests.length > 0 && (
				<div>
					<h3>Strategy Backtests</h3>
					{strategy.backtests.map((backtest: StrategyBacktest) => (
						<div key={backtest.id}>
							<h4>Backtest Conditions</h4>
							<pre>{JSON.stringify(backtest.conditions, null, 2)}</pre>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

// Type guard to check if the data_source is of type FileSource
function isFileSource(dataSource: FileSource | DatabaseSource): dataSource is FileSource {
	return (dataSource as FileSource).fk_file_id !== undefined;
}

export default StrategyInfo;
