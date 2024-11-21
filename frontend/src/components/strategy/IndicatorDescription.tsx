import React, { useState } from "react";
import { Stack, Input, Button, Text, Textarea } from "@chakra-ui/react";
import useSignUp from "../../../lib/hooks/useSignUp";
import { useMutation } from "@tanstack/react-query";
import Strategy from "../../../interfaces/Strategy";
import { StrategiesClient } from "../../../lib/services/ApiClientInstances";
import { useCreateStrategy } from "../../../lib/hooks/useCreateStrategy";

interface Props {
  onClose: () => void;
  description: string;
}

const CreateStratForm: React.FC<Props> = ({ onClose, description }) => {
  const descriptionBr = description.replace(/\n/g, "<br />");

  return (
    <>
      <p>{description}</p>

      {/* <Button onClick={onClose}>Close</Button> */}
    </>
  );
};

export default CreateStratForm;
