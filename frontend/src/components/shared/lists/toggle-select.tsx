import { ChevronDown } from "lucide-react";

interface ToggleSelectProps {
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isOpen: boolean;
}

export default function ToggleSelect({ setIsOpen, isOpen }: ToggleSelectProps) {
	return (
		<button
			className="p-4 flex justify-between items-center rounded-md transition-colors duration-200"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setIsOpen(!isOpen);
			}}
		>
			<ChevronDown
				className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
			/>
		</button>
	);
}
