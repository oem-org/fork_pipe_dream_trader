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
			setRows(JSON.parse(data.data));
			console.log(typeof rows);
			Object.keys(rows).map((key) => {
				const innerObject = rows[key];

				Object.keys(innerObject).map((innerKey) => {
					console.log(`${innerKey}: ${innerObject[innerKey]}`);
				});
			});
		}
	}, [data]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error?.message}</div>;
	}

	return (
		<div>
			<table className="table-auto border-collapse border border-gray-300 w-full text-left">
				<thead>
					<tr>
						{columns.map((column) => (
							<th
								key={column}
								className="border border-gray-300 px-4 py-2 bg-gray-100"
							>
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Object.keys(rows).map((key) => {
						const innerObject = rows[key];
						return (
							<tr key={key}>
								{Object.keys(innerObject).map((innerKey) => (
									<td key={innerKey}>{innerObject[innerKey]}</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div >
	);
}

