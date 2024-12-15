
const ToggleFlexDirection = (setIsRow) => {

	const toggleDirection = () => {
		setIsRow((prev) => !prev);
	};

	return (
		<div className="p-4">
			{/* Toggle Button */}
			<button
				onClick={toggleDirection}
				className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
			>
				Toggle to {isRow ? 'Column' : 'Row'}
			</button>
		</div>)
}
