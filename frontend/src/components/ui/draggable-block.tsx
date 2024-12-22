import { useDrag, useDrop } from "react-dnd";

const ItemType = {
	BLOCK: "block",
};

interface BlockProps {
	id: number;
	children: JSX.Element[];
	moveBlock: (dragIndex: number, hoverIndex: number) => void;
	index: number;
}



export default function DraggableBlock({ id, children, moveBlock, index }: BlockProps) {
	const [, drag] = useDrag(() => ({
		type: ItemType.BLOCK,
		item: { id, index },
	}));

	const [, drop] = useDrop(() => ({
		accept: ItemType.BLOCK,
		hover: (draggedItem: { id: number; index: number }) => {
			if (draggedItem.index !== index) {
				moveBlock(draggedItem.index, index);
				draggedItem.index = index;
			}
		},
	}));

	return (
		<div
			ref={(node) => drag(drop(node))}
			className="flex flex-item border border-gray-300 mb-2 p-2 bg-gray-100 rounded-lg shadow-sm"
		>
			{children}
		</div>
	);
}
