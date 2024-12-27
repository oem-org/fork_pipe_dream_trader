import React, { useEffect, useState } from 'react';
import { getStrategyApi } from '@/lib/apiClientInstances';
import { Strategy, FileSource, DatabaseSource, StrategyCondition, StrategyIndicator, StrategyBacktest } from "@/interfaces/Strategy";

interface StrategyInfoProps {
	strategyId: number;
}

export default function StrategyInfo({ strategyId }: StrategyInfoProps) {
	const [strategy, setStrategy] = useState<Strategy | null>(null);

	useEffect(() => {
		async function fetchStrategy(strategyId: number) {
			try {
				const response = await getStrategyApi.get(strategyId);
				setStrategy(response);
			} catch (error) {
				console.error("Error fetching strategy:", error);
			}
		}

		if (strategyId) {
			fetchStrategy(strategyId);
		}
	}, [strategyId]);

	if (strategyId === 0) {
		return (
			<div className="text-center text-lg text-gray-500">
				Select a strategy to view its details.
			</div>
		);
	}

	if (!strategy) {
		return (
			<div className="text-center text-lg text-red-600">
				No strategy found.
			</div>
		);
	}

	// Type guard to check if the data_source is a FileSource
	function isFileSource(dataSource: FileSource | DatabaseSource): dataSource is FileSource {
		return (dataSource as FileSource).fk_file_id !== undefined;
	}

	return (
		<div>
			<h3 className="h3 font-bold ">{strategy.name}</h3>
			<h3 className="h3 ">Description</h3>
			<p >{strategy.description}</p>

			{strategy.fk_file_id && (
				<div className="mt-4">
					<h3 className="h3 ">File Information</h3>
				</div>
			)}

			{strategy.data_source && (
				<div className="mt-4">
					<h3 className="h3 ">Data Source</h3>
					{isFileSource(strategy.data_source) ? (
						<div >
							<p>File ID: {strategy.data_source.fk_file_id}</p>
							{strategy.data_source.timeperiod && <p>Timeperiod: {strategy.data_source.timeperiod}</p>}
						</div>
					) : (
						<div >
							<p>Table: {strategy.data_source.table}</p>
							<p>Pair: {strategy.data_source.pair}</p>
							{strategy.data_source.timeperiod && <p>Timeperiod: {strategy.data_source.timeperiod}</p>}
						</div>
					)}
				</div>
			)}

			{strategy.file && (
				<div className="mt-4">
					<h3 className="h3 ">File Details</h3>
					<div >
						<p>File Path: {strategy.file.path}</p>
						<p>File Name: {strategy.file.name}</p>
						<p>File Type: {strategy.file.file_type}</p>
						{strategy.file.pair && <p>Pair: {strategy.file.pair}</p>}
					</div>
				</div>
			)}

			{strategy.strategy_conditions && strategy.strategy_conditions.length > 0 && (
				<div className="mt-4">
					<h3 className="h3 ">Strategy Conditions</h3>
					{strategy.strategy_conditions.map((condition: StrategyCondition) => (
						<div key={condition.id} className="mt-2">
							<p >Side: {condition.side}</p>
							{condition.settings && (
								<div className="mt-2">
									<h4 className="font-semibold text-gray-700">Settings</h4>
									<pre className=" p-4 rounded-lg">{JSON.stringify(condition.settings, null, 2)}</pre>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{strategy.strategy_indicators && strategy.strategy_indicators.length > 0 && (
				<div className="mt-4">
					<h3 className="h3 ">Strategy Indicators</h3>
					{strategy.strategy_indicators.map((indicator: StrategyIndicator) => (
						<div key={indicator.id} className="mt-2">
							{indicator.dataframe_column && <p >Dataframe Column: {indicator.dataframe_column}</p>}
							{indicator.settings && (
								<div className="mt-2">
									<h4 className="font-semibold text-gray-700">Settings</h4>
									<pre className=" p-4 rounded-lg">{JSON.stringify(indicator.settings, null, 2)}</pre>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{strategy.backtests && strategy.backtests.length > 0 && (
				<div className="mt-4">
					<h3 className="h3 ">Strategy Backtests</h3>
					{strategy.backtests.map((backtest: StrategyBacktest) => (
						<div key={backtest.id} className="mt-2">
							<h4 >Backtest Conditions</h4>
							<pre className=" p-4 rounded-lg">{JSON.stringify(backtest.conditions, null, 2)}</pre>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
