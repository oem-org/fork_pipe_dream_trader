import React, { useState, useEffect } from "react";
import Search from "./search";

interface GenericListProps<T> {
	data: T[];
	keyExtractor: (item: T) => string | number;
	onSelect: (item: T) => void;
	renderItem: (item: T) => React.ReactNode;
	searchEnabled: boolean;
	nameExtractor: (item: T) => string
}

// Creates a table style list of buttons, which means render items must contain buttons
export default function GenericList<T>({
	data,
	keyExtractor,
	onSelect,
	renderItem,
	searchEnabled,
	nameExtractor

}: GenericListProps<T>) {
	const [filteredData, setFilteredData] = useState<T[]>(data);

	const handleSelection = (item: T, e: React.MouseEvent<HTMLButtonElement>) => {
		onSelect(item);
		e.preventDefault();
	};

	const handleSearch = (query: string, e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		if (query.trim() !== "") {
			const filteredItems = data.filter((item) =>
				nameExtractor(item).toLowerCase().includes(query.toLowerCase())
			);
			setFilteredData(filteredItems);
		} else {
			setFilteredData(data);
		}
	};

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	return (
		<div className="border rounded-md overflow-hidden h-full">
			<div className="w-full p-4 flex justify-between items-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
				{searchEnabled && (
					<div className="flex-grow">
						<Search onSearch={(query, e) => handleSearch(query, e)} />
					</div>
				)}
			</div>

			<div
				className="h-full overflow-y-auto"
			>
				<ul className="list-none p-0">
					{filteredData.length > 0 ? (
						filteredData.map((item) => (
							<li
								key={keyExtractor(item)}
								className={`border-t border-gray-200 bg-gray-100"
									}`}
							>
								<button
									className="custom-select-row"
									onClick={(e) => handleSelection(item, e)}
									role="option"
								>
									{renderItem(item)}
								</button>
							</li>
						))
					) : (
						<li className="p-4 text-center text-gray-500">No results found</li>
					)}
				</ul>
			</div>
		</div>
	);
}


