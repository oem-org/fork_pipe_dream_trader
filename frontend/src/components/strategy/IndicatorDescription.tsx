import React, { useState } from 'react'
import { Stack, Input, Button, Text, Textarea } from '@chakra-ui/react'
import useSignUp from '../../hooks/useSignUp'
import { useMutation } from '@tanstack/react-query'
import Strategy from '../../models/Strategy'
import { StrategiesClient } from '../../services/ApiClientInstances'
import  { useCreateStrategy } from '../../hooks/useCreateStrategy'

interface Props {
  onClose: () => void
  description: string
}

const CreateStratForm: React.FC<Props> = ({ onClose, description }) => {
const descriptionBr = description.replace(/\n/g, '<br />')

  

  return (
 <>
<p>
  {description}
</p>

{/* <Button onClick={onClose}>Close</Button> */}
 </>
  )
}

export default CreateStratForm
