import React from 'react';

interface ModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
	if (!isOpen) return null;

	return (
		<section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
			<div className="bg-white w-full max-h-full overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-lg shadow-lg">
				<div className="flex flex-col">
					<div className="flex justify-between items-center p-4 border-b">
						<h3 className="text-lg font-bold">{title}</h3>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-red-500 transition"
							aria-label="Close"
						>
							✕
						</button>
					</div>
					<div className="p-4">
						<div className="text-gray-700">{children}</div>
					</div>
				</div>
			</div>
		</section>
	);
}

