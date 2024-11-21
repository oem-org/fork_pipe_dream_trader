import React from 'react';
import { useDeleteIndicator } from '../../hooks/useDeleteIndicator';
import { Button } from '@chakra-ui/react';

interface Props {
    id: number | undefined; 
}


const DeleteIndicatorButton: React.FC<Props> = ({id}) => {
    const mutateAsync = useDeleteIndicator();
    const handleClick = () => {
        // Function to be executed when the button is clicked
        if (id === undefined) {
            return;
        }
        mutateAsync({ id: id });
    };

    return (
        <Button mt={2} ml={12} onClick={handleClick}>
            Delete Indicator
        </Button>
    );
};

export default DeleteIndicatorButton;