import {
  Text,
  Button,
  Collapse,
  HStack,
  Image,
  Input,
  List,
  ListItem,
  Spinner,
  VStack,
  useDisclosure,
  Flex,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import CustomModal from "../common/layouts/CustomModal";
import useIndicatorListQuery from "../../hooks/useIndicatorListQuery";
import IndicatorDescription from "./IndicatorDescription";
import { useAddIndicator } from "../../hooks/useAddIndicator";
import { IoIosInformationCircleOutline } from "react-icons/io";
import strategyStore from "../../stores/strategyStore";
import Indicator from "../../models/Indicator";
import indicatorStore from "../../stores/indicatorStore";

export default function SelectIndicators() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const { data, error, isLoading } = useIndicatorListQuery();
  const mutateAsync = useAddIndicator();
  const { selectedStrategy, selectedId, setStrategyId } = strategyStore();
  const { indicatorId, setIndicatorId } = indicatorStore();
  const [isListVisible, setListVisible] = useState(true);

  const borderColor = useColorModeValue("gray.500", "white");
  const buttonBackgroundColor = useColorModeValue("black", "white");
  const buttonTextColor = useColorModeValue("white", "black");
  const listBgColor = useColorModeValue("gray.100", "gray.700");
  const listTextColor = useColorModeValue("black", "white");
  const listBorderColor = useColorModeValue("black", "white");

  const addIndicator = async (indicator: Indicator, selectedId: number | null) => {
    console.log(indicator.id, selectedId);
    if (typeof indicator.id === "number" && selectedId !== null) {
      console.log(selectedId, indicator.kind, indicator.settings);
      try {
        const data = await mutateAsync({
          kind: indicator.kind,
          settings: indicator.settings,
          strategy_fk: selectedId,
        });
        console.log("Mutation was successful, returned data:", data);
      } catch (error) {
        console.error("Mutation failed with error:", error);
      }
    } else {
      console.log("Error");
      onOpenError();
    }
  };

  function addSelectIndicator(indicator: Indicator, selectedId: number | null) {
    if (indicator.id !== null) {
      setIndicatorId(indicator.id);
      console.log(indicatorId, "indicator id");
    }
    addIndicator(indicator, selectedId);
  }

  return (
    <>
      <CustomModal isOpen={isOpenError} title="No strategy selected" onClose={onCloseError}>
        <Text>Select strategy to add an indicator</Text>
      </CustomModal>
      {isLoading && <Spinner />}
      {error && <div>{error.message}</div>}
      <Button
        onClick={() => setListVisible(!isListVisible)}
        mb={3}
        width="100%"
        border="none"
        backgroundColor={buttonBackgroundColor}
        color={buttonTextColor}
        _hover={{
          backgroundColor: useColorModeValue("white", "black"),
          color: useColorModeValue("black", "white"),
        }}
      >
        {isListVisible ? "Indicator List" : "Indicator List"}
        <Box
          as="span"
          borderWidth="0 2px 2px 0"
          display="inline-block"
          padding="3px"
          transform={isListVisible ? "rotate(45deg)" : "rotate(-135deg)"}
          marginLeft="5px"
        />
      </Button>
      {isListVisible && (
        <div>
          <List
            mb={3}
            maxHeight="200px"
            bg={listBgColor}
            className="overflow-auto"
            color={listTextColor}
            borderRadius="md"
            border={`1px solid ${listBorderColor}`}
            fontSize="lg"
          >
            {data?.map((indicator) => (
              <ListItem
                key={indicator.id}
                paddingY="5px"
                _hover={{ backgroundColor: useColorModeValue("gray.300", "gray.600") }}
              >
                <Flex justifyContent="space-between" alignItems="center" width="100%">
                  <Button
                    whiteSpace="normal"
                    textAlign="left"
                    onClick={() => addSelectIndicator(indicator, selectedId)}
                    variant="link"
                    fontSize="md"
                    color={listTextColor}
                  >
                    {indicator.kind}
                  </Button>
                  <Button onClick={onOpen} variant="link">
                    <IoIosInformationCircleOutline size={24} />
                  </Button>
                </Flex>
                <CustomModal isOpen={isOpen} title="Indicator Description" onClose={onClose}>
                  <IndicatorDescription onClose={onClose} description={indicator.description} />
                </CustomModal>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </>
  );
}