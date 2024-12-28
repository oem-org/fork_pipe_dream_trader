import { SearchIcon } from "lucide-react";
import { useState } from "react";




export default function Search({
	onSearch,
}: {
	onSearch: (query: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	const [query, setQuery] = useState("");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		//TODO: research
		// Pass event to prevent bubbling
		onSearch(event.target.value, event);
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




