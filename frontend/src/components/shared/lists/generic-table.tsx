
import React, { useState, useEffect } from "react";
import { ChevronDown, SearchIcon } from 'lucide-react';

interface NamedItem {
	name: string;
}

interface GenericSelectProps<T extends NamedItem> {
	data: T[];
	keyExtractor: (item: T) => string | number;
	onSelect: (item: T) => void;
	renderItem: (item: T) => React.ReactNode;
	title: string;
	searchEnabled: boolean;
}


export default function GenericSelect<T extends NamedItem>({
	data,
	keyExtractor,
	onSelect,
	renderItem,
	title,
	searchEnabled,
}: GenericSelectProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentTitle, setCurrentTitle] = useState<string>(title);
	const [isHovered, setIsHovered] = useState(false);
	const [filteredData, setFilteredData] = useState<T[]>(data);
	const [searchQuery, setSearchQuery] = useState("");

	const handleSelection = (item: T) => {
		onSelect(item);
		setCurrentTitle(item.name);
		setIsOpen(false);
		setSearchQuery("")
	};

	const handleSearch = (query: string, e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation(); // Prevent interaction from bubbling to parent form
		setSearchQuery(query);

		if (query.trim() !== "") {
			const filteredItems = data.filter((item) =>
				item.name.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredData(filteredItems);
		} else {
			setFilteredData(data); // Reset to all items if the query is empty
		}
	};

	useEffect(() => {
		setFilteredData(data); // Reset filtered data if the original data changes
	}, [data]);

	return (
		<div
			className="border rounded-md overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="w-full flex justify-between items-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
				{searchEnabled && (isHovered || searchQuery) ? (
					<div className="flex-grow">
						<Search onSearch={(query, e) => handleSearch(query, e)} />
					</div>
				) : (
					<p
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation(); // Prevent interaction from bubbling to parent form
							setIsOpen(!isOpen);
						}}
						className="flex-grow p-4 font-semibold cursor-pointer"
					>
						{currentTitle}
					</p>
				)}
				<ToggleData isOpen={isOpen} setIsOpen={setIsOpen} />
			</div>

			<div
				className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-60" : "max-h-0"} overflow-y-auto`}
			>
				<ul className="list-none p-0">
					{filteredData.length > 0 ? (
						filteredData.map((item) => (
							<li key={keyExtractor(item)} className="border-t border-gray-200">
								<button
									className="w-full p-4 text-left text-md font-normal text-black hover:bg-gray-100 transition-colors duration-200"
									onClick={(e) => handleSelection(item, e)}
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

function Search({
	onSearch,
}: {
	onSearch: (query: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	const [query, setQuery] = useState("");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		onSearch(event.target.value, event); // Pass event to prevent bubbling
	};

	return (
		<div className="w-full flex items-center">
			<SearchIcon className="mx-2" />
			<input
				type="text"
				className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
				placeholder="Search..."
				value={query}
				onChange={handleChange}
			/>
		</div>
	);
}

interface ToggleDataProps {
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isOpen: boolean;
}

function ToggleData({ setIsOpen, isOpen }: ToggleDataProps) {
	return (
		<button
			className="p-4 flex justify-between items-center rounded-md transition-colors duration-200"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation(); // Prevent interaction from bubbling to parent form
				setIsOpen(!isOpen);
			}}
		>
			<ChevronDown
				className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
			/>
		</button>
	);
}
