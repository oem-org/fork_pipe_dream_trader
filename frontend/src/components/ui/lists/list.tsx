import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SimpleListProps<T> {
	data: T[];
	keyExtractor: (item: T) => string | number;
	addSelected: (item: T) => void;
	renderItem: (item: T) => React.ReactNode;
	title: string;
}

export default function SimpleList<T>({
	data,
	keyExtractor,
	addSelected,
	renderItem,
	title
}: SimpleListProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const clicked = (item: T) => {
		addSelected(item)
		setIsOpen(!isOpen)
	}
	return (
		<div className="border rounded-md overflow-hidden">
			<button
				className="w-full p-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="font-semibold">{title}</span>
				<ChevronDown
					className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
						}`}
				/>
			</button>
			<div
				className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60' : 'max-h-0'
					} overflow-y-auto`}
			>
				<ul className="list-none p-0">
					{data.map((item) => (
						<li
							key={keyExtractor(item)}
							className="border-t border-gray-200"
						>
							<button
								className="w-full p-4 text-left text-md font-normal text-black hover:bg-gray-100 transition-colors duration-200"
								onClick={() => clicked(item)}
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

