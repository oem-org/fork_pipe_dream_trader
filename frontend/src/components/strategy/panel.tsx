import React from 'react'

export default function Panel() {
	return (
		<div>
			<h4>Clone an existing strategy</h4>
			<GenericSelect<Strategy>
				data={dataStrategies || []}
				keyExtractor={(strategy) => strategy.id}
				onSelect={(strategy) => {
					setClonedStrategyId(strategy.id);
					console.log(strategy.id, "Selected Strategy ID");
				}}
				renderItem={(strategy) => <span>{strategy.name}</span>}
				title="Select or search"
				searchEnabled={true}
			/>

			<h4>Choose a data source</h4>
			<div className="flex items-center justify-center space-x-4">
				<button
					type="button"
					onClick={() => setDataSourceType("file")}
					className={`btn-primary ${dataSourceType === "file" ? "bg-blue-600 text-white" : "btn-secondary"}`}
				>
					File
				</button>
				<button
					type="button"
					onClick={() => setDataSourceType("database")}
					className={`btn-primary ${dataSourceType === "database" ? "bg-blue-600 text-white" : "btn-secondary"}`}
				>
					Database
				</button>
			</div>
		</div>
	)
}

