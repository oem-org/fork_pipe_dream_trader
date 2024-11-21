import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react'

interface ModalLayoutProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const ModalLayout: React.FC<ModalLayoutProps> = ({ isOpen, onClose, title, children }) => {
  const isFullScreen = useBreakpointValue({ base: true, md: false })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isFullScreen ? 'full' : 'md'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalLayout