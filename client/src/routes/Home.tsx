import {
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Checkbox,
  CheckboxGroup,
  Input,
  InputRightAddon,
  Stack,
  InputGroup,
  keyframes,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { app, homeService } from "../client";
import restClient from "@feathersjs/rest-client";
import { SERVER_URL } from "../constants";
import { homeSchema } from "../../server/src/services/home/home.schema";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const Home = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [allTopics, setAllTopics] = useState<homeSchema[]>([]);

  const selectFile = (event) => {
    const fileElem = document.getElementById("fileElem");
    if (fileElem) {
      fileElem.click();
    }
    event.preventDefault();
  };

  const uploadFile = async (event) => {
    console.log("File uploaded:", event.target, event.target.files[0]);
    const data = new FormData();
    data.append("files", event.target.files);
    data.append("fileType", "FACTS_CSV");
    data.append("text", "FACTS_CSV");
    const { accessToken } = await app.get("authentication");
    // https://github.com/feathersjs/feathers/issues/1744#issuecomment-568015824
    fetch(`${SERVER_URL}/${FILE_UPLOAD}`, {
      body: data,
      method: "post",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((request) => request.text())
      .then((response) => {
        // success
        console.log("Server responded with: ", response);
      })
      .catch((err) => console.log("Server error:", err))
      .finally(() => console.log("finished"));
    // Reset the input files, so that same file can be uploaded again
    event.target.value = null;
  };
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
    console.log(data);
  };
  // return (
  //   <>
  //     <input
  //       type="file"
  //       onChange={uploadFile}
  //       id="fileElem"
  //       accept=".csv"
  //       style={{ display: "none" }}
  //     />
  //     <Button id="fileSelect" onClick={selectFile}>
  //       Upload File
  //     </Button>
  //   </>
  // );
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
