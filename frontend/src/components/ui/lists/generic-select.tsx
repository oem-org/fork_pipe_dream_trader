import React, { useState, useEffect } from "react";
import Search from "./search";
import ToggleSelect from "./toggle-select";

interface GenericSelectProps<T> {
	data: T[];
	keyExtractor: (item: T) => string | number;
	onSelect: (item: T) => void;
	renderItem: (item: T) => React.ReactNode;
	title: string;
	searchEnabled: boolean;
	changeTitle?: boolean;
	nameExtractor: (item: T) => string
	initialValue?: T | null
}

export default function GenericSelect<T>({
	data,
	keyExtractor,
	onSelect,
	renderItem,
	title,
	searchEnabled,
	nameExtractor,
	initialValue,
	changeTitle = true,

}: GenericSelectProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentTitle, setCurrentTitle] = useState<string>(title);
	const [isHovered, setIsHovered] = useState(false);
	const [filteredData, setFilteredData] = useState<T[]>(data);
	const [searchQuery, setSearchQuery] = useState("");

	const handleSelection = (item: T, e: React.MouseEvent<HTMLButtonElement>) => {
		onSelect(item);
		if (changeTitle) {
			setCurrentTitle(nameExtractor(item));
		}
		setIsOpen(false);
		setSearchQuery("");
		e.preventDefault()
	};

	const handleSearch = (query: string, e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setSearchQuery(query);

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
		if (initialValue && changeTitle) {
			setCurrentTitle(nameExtractor(initialValue));
		}
	}, [initialValue]);

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	return (
		<div
			className="border rounded-md overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="custom-select">
				{searchEnabled && (isHovered || searchQuery) ? (
					<div className="flex-grow">
						<Search onSearch={(query, e) => handleSearch(query, e)} />
					</div>
				) : (
					<p
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setIsOpen(!isOpen);
						}}
						className="flex-grow p-2 font-semibold cursor-pointer"
					>
						{currentTitle}
					</p>
				)}
				<ToggleSelect isOpen={isOpen} setIsOpen={setIsOpen} />
			</div>

			<div
				className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-60" : "max-h-0"} overflow-y-auto`}
			>
				<ul className="list-none p-0">
					{filteredData.length > 0 ? (
						filteredData.map((item) => (
							<li key={keyExtractor(item)} className="border-t border-gray-200">
								<button
									className="w-full text-left p-2 text-md font-normal text-black hover:bg-gray-100 transition-colors duration-200"
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

