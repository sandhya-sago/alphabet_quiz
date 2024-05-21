import { useEffect, useState } from "react";
import {
  Heading,
  Input,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  FormLabel,
  Button,
  Stack,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  CheckIcon,
  RepeatIcon,
  AddIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { homeService } from "../client";
import { homeSchema } from "../../server/src/services/home/home.schema";
import { formatTopics, toTitleCase } from "../common/utils";

export const Admin = () => {
  const [allTopics, setAllTopics] = useState<homeSchema[]>([]);
  const [selectedTopic, setSelectedTopic] = useState({});
  const [toSave, setToSave] = useState(false);
  useEffect(() => {
    homeService.find().then((data) => {
      setAllTopics(formatTopics(data) as homeSchema[]);
    });
  }, []);

  const editTopic = async (id: string) => {
    await homeService.get(id).then((facts) => setSelectedTopic(facts));
  };
  const addNewTopic = () => {
    setSelectedTopic({
      name: "New Topic",
      alphabets: Array.from(new Array(26)).reduce(
        (p, c, i) => ({ ...p, [String.fromCharCode(i + 65)]: "" }),
        {}
      ),
    });
  };
  const updateTopic = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const ipData = Object.fromEntries(formData.entries());
    const data = {
      name: ipData.name,
      alphabets: Object.entries(ipData)
        .filter(([key, val]) => key.startsWith("alphabets/"))
        .reduce(
          (obj, [key, val]) => ({ ...obj, [key.split("/")[1]]: val }),
          {}
        ),
    };
    if (selectedTopic._id) {
      const res = await homeService.update(selectedTopic._id, {
        ...selectedTopic,
        ...data,
      });
      setSelectedTopic(res);
    } else {
      const res = await homeService.create({ ...data });
      setSelectedTopic(res);
      const topics = await homeService.find();
      setAllTopics(formatTopics(topics) as homeSchema[]);
    }
  };
  const deleteTopic = async () => {
    if (selectedTopic._id) {
      await homeService.remove(selectedTopic._id);
    }
    const data = await homeService.find();
    setAllTopics(formatTopics(data) as homeSchema[]);
    setSelectedTopic({});
  };
  return (
    <>
      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <Heading>Update topics</Heading>
          <Stack spacing={5} direction={"column"}>
            <Button rightIcon={<AddIcon />} onClick={addNewTopic}>
              Add Topic
            </Button>
            <FormLabel>Choose Topic to update</FormLabel>
            {allTopics.map((topic) => (
              <Stack spacing={5} direction={"row"} key={topic._id}>
                <Text>{topic.name}</Text>
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="teal"
                  variant="outline"
                  size={"xs"}
                  onClick={() => editTopic(topic._id)}
                >
                  Update
                </Button>
              </Stack>
            ))}
          </Stack>
        </Box>
        {selectedTopic.name ? (
          <Box>
            <form onChange={() => setToSave(true)} onSubmit={updateTopic}>
              <Heading>
                Update{" "}
                <Input
                  name={"name"}
                  defaultValue={toTitleCase(selectedTopic.name)}
                />
              </Heading>
              <Button
                rightIcon={<CheckIcon />}
                colorScheme={toSave ? "teal" : undefined}
                variant="outline"
                size={"xs"}
                type="submit"
              >
                Save
              </Button>
              <Button
                rightIcon={<RepeatIcon />}
                variant="outline"
                size={"xs"}
                type="reset"
                onClick={() => setSelectedTopic((topic) => ({ ...topic }))}
              >
                Reset
              </Button>
              <Button
                rightIcon={<DeleteIcon />}
                variant={"outline"}
                size={"xs"}
                onClick={deleteTopic}
              >
                Delete
              </Button>
              <Table>
                <Tbody>
                  {Object.entries(selectedTopic.alphabets).map(
                    ([alpha, val]) => (
                      <Tr key={`${selectedTopic.name}:${alpha}`}>
                        <Td>{alpha}</Td>
                        <Td>
                          <Input
                            name={`alphabets/${alpha}`}
                            defaultValue={val}
                            focusBorderColor="lime"
                          />
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </form>
          </Box>
        ) : null}
      </SimpleGrid>
    </>
  );
};
