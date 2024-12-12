import { useState } from 'react';

interface JsonInputProps {
	data: { [key: string]: any }[]; // Array of objects with string keys and any type of values
	onChange?: (updatedData: { [key: string]: any }[]) => void; // Callback when data changes
}

const JsonInput = ({ data, onChange }: JsonInputProps) => {
	const [jsonData, setJsonData] = useState(data);

	const handleInputChange = (rowIndex: number, key: string, value: string) => {
		const updatedData = [...jsonData];
		updatedData[rowIndex] = {
			...updatedData[rowIndex],
			[key]: value,
		};
		setJsonData(updatedData);
		if (onChange) {
			onChange(updatedData);
		}
	};

	return (
		<div className="space-y-4">
			{jsonData.map((row, rowIndex) => (
				<div key={rowIndex} className="p-4 border rounded-lg bg-gray-50 space-y-2">
					{Object.keys(row)
						.sort((a, b) => a.localeCompare(b))
						.map((key) => (
							<div key={key} className="space-y-1">
								<label className="block text-sm font-semibold text-gray-700">
									{key}
								</label>
								<input
									type="text"
									value={row[key]}
									onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
									className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
								/>
							</div>
						))}
				</div>
			))}
		</div>
	);
};

export default JsonInput;
