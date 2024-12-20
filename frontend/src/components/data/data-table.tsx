
import { useEffect, useState } from "react";

interface TableProps {
	id: number;
}

interface TableColumn {
	key: string;
	label: string;
}

interface TableData {
	[key: string]: any;
}

export default function DataTable({ id }: TableProps) {
	const [columns, setColumns] = useState<TableColumn[]>([]);
	const [data, setData] = useState<TableData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				// Replace this with an actual API call
				const response = await fetch(`/api/data/${id}`);
				const result = await response.json();

				if (result.columns && result.data) {
					setColumns(result.columns);
					setData(result.data);
				} else {
					setError("Invalid data format received.");
				}
			} catch (err) {
				setError("Failed to fetch data.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<table className="table-auto border-collapse border border-gray-300 w-full text-left">
				<thead>
					<tr>
						{columns.map((column) => (
							<th
								key={column.key}
								className="border border-gray-300 px-4 py-2 bg-gray-100"
							>
								{column.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{columns.map((column) => (
								<td
									key={column.key}
									className="border border-gray-300 px-4 py-2"
								>
									{row[column.key]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

