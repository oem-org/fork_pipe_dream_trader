import React, { useState } from 'react'
import { Stack, Input, Button, Text, Textarea } from '@chakra-ui/react'
import useSignUp from '../../hooks/useSignUp'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Strategy from '../../models/Strategy'
import { StrategiesClient } from '../../services/ApiClientInstances'
import  { useCreateStrategy } from '../../hooks/useCreateStrategy'

interface SignUpProps {
  onClose: () => void
}

const CreateStratForm: React.FC<SignUpProps> = ({ onClose }) => {
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [quote, setQuote] = useState("")
  const mutateAsync  = useCreateStrategy()

  const descriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const quoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuote(e.target.value)
  }


  const queryClient = useQueryClient()



  const handleCreateStrat = async () => {
    if (description && name && quote) {
      const newStrategy = { name, description, quote }
      console.log(newStrategy)
      try {
        let created = await mutateAsync(newStrategy)
        if (created){
            queryClient.invalidateQueries({ queryKey: ['strategies'] })
            onClose()
        }
      } catch (error) {
        console.error('Mutation failed', error)
      }

    //   onClose()
    }
  }

  return (
    <Stack spacing={3}>
      <Input placeholder="Name" onChange={nameChange} />
      <Input placeholder="Quote currency" onChange={quoteChange} />
      <Textarea
        placeholder="Description"
        onChange={descriptionChange}
      />
  
      <Button colorScheme="blue" onClick={handleCreateStrat}>
        Save Chart
      </Button>
    </Stack>
  )
}

export default CreateStratForm
