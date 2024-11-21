import {
  Box,
  Button,
  Spinner,
  List,
  Input,
} from "@chakra-ui/react";

import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import strategyStore from "../../stores/strategyStore";
import indicatorStore from "../../stores/indicatorStore";
import useStrategyIndicatorsQuery from "../../hooks/useStrategyIndicatorsQuery";
import { useUpdateIndicator } from "../../hooks/useUpdateIndicator";
import DeleteIndicatorButton from "./DeleteIndicatorButton";
import Indicator from "../../models/Indicator";

export default function IndicatorSection() {
  const { selectedId } = strategyStore();
  const { indicatorId } = indicatorStore();
  const { data, error, isLoading } = useStrategyIndicatorsQuery(selectedId);
  const mutateAsync = useUpdateIndicator();

  const [formValues, setFormValues] = useState({});
  const [isListVisible, setListVisible] = useState(true);
  const queryClient = useQueryClient();
  const inputRefs = useRef({});

  // Invalidate queries when selectedId or indicatorId changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["strategyIndicators"] });
  }, [selectedId, indicatorId]);

  // Initialize form values when data is loaded
  useEffect(() => {
    if (data) {
      const initialValues = {};
      data.forEach((indicator) => {
        initialValues[indicator.id] = indicator.settings[0].reduce((acc, setting, index) => {
          acc[index] = setting[2];
          return acc;
        }, {});
      });
      setFormValues(initialValues);
    }
  }, [data]);

  // Update indicator settings
  function updatedIndicator(indicatorObject: Indicator, indicatorSettings: Array<any>) {
    const updated = indicatorObject.settings[0].map((setting:Array<any>, index: number) => {
      return [setting[0], setting[1], indicatorSettings[index]]; // Update the third element [2] with indicatorSettings[index]
    });
    return updated;
  }

  // Handle saving indicator settings
  function handleSave(indicatorId: number) {
    const indicatorSettings = Object.keys(formValues[indicatorId]).map(
      (key) => formValues[indicatorId][key]
    );

    const indicatorObject = data?.find((indicator) => indicator.id === indicatorId);

    let updatedSettings = updatedIndicator(indicatorObject, indicatorSettings);
    indicatorObject.settings[0] = updatedSettings;

    // Mutate and update the cache
    mutateAsync({ id: indicatorId, newIndicator: indicatorObject }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["strategyIndicators"] });
    });
  }

  // Handle input change
  function handleInputChange(indicatorId, settingIndex, value) {
    setFormValues((prevValues) => ({
      ...prevValues,
      [indicatorId]: {
        ...prevValues[indicatorId],
        [settingIndex]: value,
      },
    }));
  }

  return (
    <>
      <Button
        onClick={() => setListVisible(!isListVisible)}
        width="100%"
        border="none"
        mb={3}
      >
        {isListVisible ? "Indicators" : "Indicator"}
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
      {/* {isLoading && <Spinner />} */}
      {/* {error && <div>{error.message}</div>} */}
      {isListVisible && (
        <Box>
          <List className="flex flex-row flex-wrap">
            {data?.map((indicator) => (
              <Box
                key={indicator.id}
                p={2}
                borderWidth="1px"
                borderRadius="lg"
                mb={2}
                className="mr-4"
              >
                <span className="text-lg">{indicator.kind}</span>
                <div className="flex flex-row items-center">
                  {indicator.settings[0].map<Indicator[]>((setting:any, settingIndex:any) => (
                    <div key={settingIndex}>
                      <label className="text-sm font-medium">
                        {setting[0]}{" "}
                      </label>
                      <Input
                        type={typeof setting[2]}
                        value={formValues[indicator.id]?.[settingIndex] || ""}
                        onChange={(e) =>
                          handleInputChange(indicator.id, settingIndex, e.target.value)
                        }
                        className="border-2 border-gray-300 rounded-md p-1 m-1 w-10"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  mt={2}
                  colorScheme="teal"
                  onClick={() => handleSave(indicator.id)}
                >
                  Save Settings
                </Button>
                <DeleteIndicatorButton id={indicator.id}></DeleteIndicatorButton>
              </Box>
            ))}
          </List>
        </Box>
      )}
    </>
  );
}