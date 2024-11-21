import {
  Box,
  Button,
  Collapse,
  HStack,
  Image,
  Input,
  List,
  ListItem,
  Spinner,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import strategyStore from "../../stores/strategyStore"
import useStrategyQuery from "../../hooks/useStrategyQuery"

import { useEffect, useState } from "react"
import Strategy from "../../models/Strategy"
import { useMutation } from "@tanstack/react-query"
import { StrategiesClient } from "../../services/ApiClientInstances"
import CustomModal from "../common/layouts/CustomModal"
import CreateStratForm from "./CreateStratForm"

export default function SelectStrategyPanel() {
  const {
    isOpen: isCreateStratOpen,
    onOpen: onCreateStratOpen,
    onClose: onCreateStratClose,
  } = useDisclosure()
  const {colorMode} = useColorMode
  const { data, error, isLoading } = useStrategyQuery()
  const listBorderColor = useColorModeValue('black', 'white');
  const buttonBackgroundColor = useColorModeValue('black', 'white');
  const buttonTextColor = useColorModeValue('white', 'black' );
  const listColor = useColorModeValue('teal', 'grey');
  const listBgColor = useColorModeValue('gray.100', 'gray.700');
  const listTextColor = useColorModeValue('black', 'white');
  const { strategies, selectedId, setStrategies, setStrategyId, getById } =
    strategyStore()

  const [isListVisible, setListVisible] = useState(true)

  // updates the client with new data everytime data changes
  useEffect(() => {
    if (data) {
      setStrategies(data)
    }
  }, [data])

  return (
    <>
      {/* {error && <div>{error.message}</div>} */}

      <Button
        onClick={onCreateStratOpen}
                width="100%"
        backgroundColor={buttonBackgroundColor}
        color={buttonTextColor}
        mb={3}
        mt={3}
        _hover={{
          backgroundColor: useColorModeValue('white', 'black' ),
          color: useColorModeValue('black', 'white')
        }}
      >
        Create strategy
      </Button>
      {isLoading && <Spinner />}
      <Button
        mb={3}
    
        onClick={() => setListVisible(!isListVisible)}
        width="100%"
        border="none"
        backgroundColor={buttonBackgroundColor}
        color={buttonTextColor}
        _hover={{
          backgroundColor: useColorModeValue('white', 'black' ),
          color: useColorModeValue('black', 'white')
        }}
      >
        {isListVisible ? "Strategy List" : "Strategy List"}
        <Box
          as="span"
          border="solid 1px"
          borderColor="currentColor"
          borderWidth="0 2px 2px 0"
          display="inline-block"
          padding="3px"
          transform={isListVisible ? "rotate(45deg)" : "rotate(-135deg)"}
          marginLeft="5px"
        />
      </Button>
      {isListVisible && (
        <div>
          <CustomModal
            isOpen={isCreateStratOpen}
            title="Create strategy"
            onClose={onCreateStratClose}
          >
            <CreateStratForm onClose={onCreateStratClose}></CreateStratForm>
          </CustomModal>

          <List
            maxHeight="200px"
            bg={listBgColor}
            className="overflow-auto"
            color={listTextColor}
            borderRadius="md"
            border={`1px solid ${listBorderColor}`}
            mb={3}
          >
            {data?.map((strategy, index) => (
              <ListItem className="hover:bg-gray-300"
                key={strategy.id}
                py={2}
                px={3}
                borderBottom="1px solid grey.500"
              >
                <HStack>
                  <Button
                    whiteSpace="normal"
                    textAlign="left"
                    onClick={() => {
                      console.log(strategy.id)
                      if (typeof strategy.id === "number") {
                        console.log(strategy.id)
                        setStrategyId(strategy.id)
                      }
                    }}
                    variant="link"
                    fontSize="md"
                    color={listTextColor}
                  >
                    {strategy.name}
                  </Button>
                </HStack>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </>
  )
}