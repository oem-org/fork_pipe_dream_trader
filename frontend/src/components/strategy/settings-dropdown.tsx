import { useState } from 'react';
import Modal from '../ui/modal';
import { Button } from '../ui/buttons/button';
import Dropdown from '../ui/navigation/dropdown';
import { SettingsIcon } from 'lucide-react';
import { useDeleteStrategy } from '@/lib/hooks/react-query/useDeleteStrategy';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface SettingsDropdownProps {
	strategyId: number
}
//TODO: Create 2 diffremt kind of modales, there is a close button to much
export default function SettingsDropdown({ strategyId }: SettingsDropdownProps) {

	const navigate = useNavigate();
	const queryClient = useQueryClient()
	const { mutateAsync: deleteStrategyMutation } = useDeleteStrategy();
	const handleDelete = () => {
		deleteStrategyMutation(strategyId)
		queryClient.invalidateQueries();
		navigate("/")

	}
	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
	const toggleRenameModal = () => setIsRenameModalOpen(!isRenameModalOpen);
	return (<>


		<Dropdown textColor="text-black" icon={SettingsIcon} animation={false} direction="right">
			<button onClick={() => toggleDeleteModal()} className="btn-dropdown">Delete</button>
			<button onClick={() => toggleRenameModal()} className="btn-dropdown">Rename</button>
		</Dropdown>
		<Modal onClose={toggleDeleteModal} isOpen={isDeleteModalOpen} title={"Delete strategy"}>
			<Button onClick={() => handleDelete()}>Delete Strategy</Button>
		</Modal>

		<Modal onClose={toggleRenameModal} isOpen={isRenameModalOpen} title={"Rename"}>
			<p>Rename</p>
		</Modal>

	</>)
}

