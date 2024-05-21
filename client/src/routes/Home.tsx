import {
  Heading,
  Button,
  FormControl,
  FormLabel,
  Checkbox,
  Input,
  InputRightAddon,
  Stack,
  InputGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { homeService } from "../client";
import { homeSchema } from "../../server/src/services/home/home.schema";
import { formatTopics } from "../common/utils";

export const Home = () => {
  const [allTopics, setAllTopics] = useState<homeSchema[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    homeService.find().then((data) => {
      setAllTopics(formatTopics(data) as homeSchema[]);
    });
  }, []);

  const generateTest = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      timer: formData.get("timer"),
      selectedTopics: formData.getAll("selectedTopics"),
    };
    navigate("/quiz", { state: data });
  };
  return (
    <>
      <Heading>Setup Test</Heading>
      <form onSubmit={generateTest}>
        <FormControl>
          <FormLabel>Time Limit (5-100min):</FormLabel>
          <Stack spacing={5} direction={"row"}>
            <InputGroup>
              <Input
                type="number"
                id="timer"
                name="timer"
                min="5"
                max="100"
                defaultValue="10"
                htmlSize={4}
                width="auto"
              />
              <InputRightAddon>Minutes</InputRightAddon>
            </InputGroup>
            <Button type="submit" colorScheme="teal">
              Generate test
            </Button>
          </Stack>
          <Stack spacing={5} direction={"column"}>
            <FormLabel>
              Choose Topics to test (leave unselected to generate randomly)
            </FormLabel>
            {allTopics.map((topic) => (
              <Checkbox
                value={topic._id}
                key={topic._id}
                name={"selectedTopics"}
              >
                {topic.name}
              </Checkbox>
            ))}
          </Stack>
        </FormControl>
      </form>
    </>
  );
};
