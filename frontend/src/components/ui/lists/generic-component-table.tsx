
import React, { useState, useEffect } from "react";
import Search from "./search";

interface GenericComponentListProps<T> {
	data: T[];
	keyExtractor: (item: T) => string | number;
	onSelect: (item: T) => void;
	renderItem: (item: T) => React.ReactNode;
	searchEnabled: boolean;
	nameExtractor: (item: T) => string
}

// Works button passing of buttons or components to the renderItem
export default function GenericComponentList<T>({
	data,
	keyExtractor,
	onSelect,
	renderItem,
	searchEnabled,
	nameExtractor
}: GenericComponentListProps<T>) {
	const [filteredData, setFilteredData] = useState<T[]>(data);

	const handleSelection = (item: T, e: React.MouseEvent<HTMLButtonElement>) => {
		onSelect(item);
		e.preventDefault(); // Prevent default behavior, if needed (e.g., form submission)
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
			<div className="w-full p-2 flex justify-between items-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
				{searchEnabled && (
					<div className="flex-grow">
						<Search onSearch={(query, e) => handleSearch(query, e)} />
					</div>
				)}
			</div>

			<div className="h-full overflow-y-auto">
				<ul className="list-none p-0">
					{filteredData.length > 0 ? (
						filteredData.map((item) => (
							<li
								key={keyExtractor(item)}
								className="border-t border-gray-200 bg-gray-100"
							>
								<div className="custom-select-row">
									{/* Selection Button - Triggers onSelect */}
									<button
										className="w-full text-left "
										onClick={(e) => handleSelection(item, e)}
										role="option"
									>
										{nameExtractor(item)}
									</button>
									<div>
										{renderItem(item)}
									</div>

								</div>
								{/* Render the item content (can contain other buttons or interactive elements) */}
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
