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

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const Home = () => {
  const [allTopics, setAllTopics] = useState<homeSchema[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    homeService.find().then((data) => {
      const topics = data
        .map((d: homeSchema) => ({
          ...d,
          name: toTitleCase(d.name),
        }))
        .sort((a, b) => (a.name > b.name ? 1 : -1));
      setAllTopics(topics as homeSchema[]);
    });
  }, []);

  const generateTest = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log("Generrate test with ");
    const data = {
      timer: formData.get("timer"),
      selectedTopics: formData.getAll("selectedTopics"),
    };
    if (data.selectedTopics.length === 0) {
      const randomIdxs = [
        ...new Set(allTopics.map(() => (Math.random() * allTopics.length) | 0)),
      ].slice(0, 5);
      console.log({ randomIdxs });
      data.selectedTopics = randomIdxs.map((i) => allTopics[i]._id);
    }
    console.log(data);
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
