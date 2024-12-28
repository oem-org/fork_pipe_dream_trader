import React from 'react';
import { Button } from './buttons/button';

interface ModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	onAction?: () => any;
	actionText?: string;
}

export default function Modal({ title, isOpen, onClose, children, onAction, actionText }: ModalProps) {
	if (!isOpen) return null;

	return (
		<section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
			<div className="bg-white w-full max-h-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-lg shadow-lg">
				<div className="flex flex-col h-full">
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
					<div className="flex-grow p-4 flex justify-center items-center">
						<div className="flex justify-center items-center w-full space-x-2">
							{children}
						</div>
					</div>
					<div className="flex flex-row mt-4 justify-between p-4 border-t">
						{onAction && (
							<Button onClick={onAction}>{actionText || "Confirm"}</Button>
						)}
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}  
