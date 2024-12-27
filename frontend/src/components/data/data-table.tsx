import { useEffect, useState } from "react";
import getFileQuery from "@/lib/queries/getFileQuery";

interface TableProps {
	id: number;
}

export default function DataTable({ id }: TableProps) {
	const [columns, setColumns] = useState<string[]>([]);
	const [rows, setRows] = useState<any[]>([]);

	const { data, error, isError, isLoading } = getFileQuery(id);

	useEffect(() => {
		if (data) {
			setColumns(data.columns);
			const parsedData = JSON.parse(data.data);
			setRows(Object.values(parsedData));
		}
	}, [data]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error?.message}</div>;
	}

	return (
		<div className="w-full h-full overflow-auto border border-gray-300 rounded-lg">
			<table className="w-full border-collapse">
				<thead className="bg-gray-100 sticky top-0 z-10">
					<tr>
						{columns.map((column) => (
							<th
								key={column}
								className="text-left p-2 border-b border-r border-gray-300"
							>
								<div className="max-h-[100px] overflow-y-auto">
									{column}
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, rowIndex) => (
						<tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
							{columns.map((column) => (
								<td
									key={`${rowIndex}-${column}`}
									className="p-2 border-b border-r border-gray-300"
								>
									<div className="max-h-[100px] overflow-y-auto">
										{row[column]}
									</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

