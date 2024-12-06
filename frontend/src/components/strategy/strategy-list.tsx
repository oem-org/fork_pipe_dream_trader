import React, { useState } from "react";
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

function Search({ onSearch }: { onSearch: (query: string) => void }) {
	const [query, setQuery] = useState("");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		onSearch(event.target.value);
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
			className="p-4 flex justify-between items-center rounded-md hover:bg-gray-200 transition-colors duration-200"
			onClick={() => setIsOpen(!isOpen)}
		>
			<ChevronDown
				className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
			/>
		</button>
	);
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

	const handleSelection = (item: T) => {
		onSelect(item);
		setCurrentTitle(item.name);
		setIsOpen(false);
	};

	const handleSearch = (query: string) => {
		console.log("Searching for:", query);
	};

	return (
		<div
			className="border rounded-md overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="w-full flex justify-between items-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
				{searchEnabled && isHovered ? (
					<div className="flex-grow p-4">
						<Search onSearch={handleSearch} />
					</div>
				) : (
					<p className="flex-grow p-4 font-semibold">{currentTitle}</p>
				)}
				<ToggleData isOpen={isOpen} setIsOpen={setIsOpen} />
			</div>

			<div
				className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-60" : "max-h-0"} overflow-y-auto`}
			>
				<ul className="list-none p-0">
					{data.map((item) => (
						<li key={keyExtractor(item)} className="border-t border-gray-200">
							<button
								className="w-full p-4 text-left text-md font-normal text-black hover:bg-gray-100 transition-colors duration-200"
								onClick={() => handleSelection(item)}
							>
								{renderItem(item)}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

