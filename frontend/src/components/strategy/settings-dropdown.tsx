import { useState } from 'react';
import Modal from '../ui/modal';
import { Button } from '../ui/buttons/button';
import Dropdown from '../ui/navigation/dropdown';
import { SettingsIcon } from 'lucide-react';
import { useDeleteStrategy } from '@/lib/hooks/useDeleteStrategy';

interface SettingsDropdownProps {
	strategyId: number
}

export default function SettingsDropdown({ strategyId }: SettingsDropdownProps) {

	const { mutateAsync: deleteStrategyMutation } = useDeleteStrategy();

	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
	const toggleRenameModal = () => setIsRenameModalOpen(!isRenameModalOpen);
	return (<>


		<Dropdown textColor="text-black" icon={SettingsIcon} animation={false} direction="right">
			<button onClick={() => toggleDeleteModal()} className="block text-white px-4 py-2">Delete</button>
			<button onClick={() => toggleRenameModal()} className="block text-white px-4 py-2">Rename</button>
		</Dropdown>
		<Modal onClose={toggleDeleteModal} isOpen={isDeleteModalOpen} title={"Delete strategy"}>
			<Button onClick={() => { deleteStrategyMutation(strategyId) }}>Delete Strategy</Button>
		</Modal>

		<Modal onClose={toggleRenameModal} isOpen={isRenameModalOpen} title={"Rename"}>
			<p>Rename</p>
		</Modal>

	</>)
}

