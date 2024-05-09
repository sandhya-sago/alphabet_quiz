import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

export const UserForm = ({
  onSubmit,
  submitLabel,
  onSuccess,
}: {
  onSubmit: (data: any) => Promise<any>;
  submitLabel: string;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const createUserCall = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.target);
    const obj = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      console.log("Creating user with ", formData, obj, onSubmit);
      await onSubmit(obj);
      console.log("success to ", onSuccess);
      onSuccess();
    } catch (err) {
      setError(`${err}`);
      console.error(err);
    }
    setLoading(false);
  };
  return (
    <form onSubmit={createUserCall}>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor="email">Email address</FormLabel>
        <Input type="email" isRequired name="email" />
        <FormHelperText>We'll never share your email.</FormHelperText>
      </FormControl>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input type="password" isRequired name="password" />
      </FormControl>
      <FormControl isInvalid={!!error}>
        <Button mt={4} width="40vw" isLoading={loading} type="submit">
          {submitLabel}
        </Button>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </form>
  );
};
