import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { quizService } from "../client";
import {
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  Button,
} from "@chakra-ui/react";

export const Quiz = () => {
  const location = useLocation();
  const [quizData, setQuizData] = useState({ topics: [], alphabets: [] });
  const [answers, setAnswers] = useState({});
  useEffect(() => {
    if (location.state?.selectedTopics) {
      const query = { query: { _id: { $in: location.state.selectedTopics } } };
      quizService.find(query).then((data) => setQuizData(data));
    } else {
      quizService.find().then((data) => setQuizData(data));
    }
  }, [location.state?.selectedTopics]);

  const submitQuiz = (event) => {
    event.preventDefault();
    const filledData = new FormData(event.target);
    const filled = quizData.topics.reduce(
      (obj, t) => ({
        ...obj,
        [t]: quizData.alphabets.reduce(
          (aobj, alpha) => ({
            ...aobj,
            [alpha]: filledData.get(`${t}:${alpha}`),
          }),
          {}
        ),
      }),
      {}
    );
    console.log(filled);
    quizService
      .create(quizData, {
        headers: { "X-Service-Method": "getAnswers" },
      })
      .then((answers) => setAnswers(answers));
  };
  console.log({ quizData, answers });
  return (
    <>
      <Heading>Fill in terms starting with the alphabet</Heading>
      <form onSubmit={submitQuiz}>
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <TableCaption>{""}</TableCaption>
            <Thead>
              <Tr>
                <Th> </Th>
                {quizData["topics"].map((t) => (
                  <Th key={t}>{t}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {quizData["alphabets"].map((alpha) => (
                <Tr key={alpha}>
                  <Td>{alpha}</Td>
                  {quizData.topics.map((t) => (
                    <Td>
                      <Input
                        variant="filled"
                        focusBorderColor="lime"
                        htmlSize={4}
                        name={`${t}:${alpha}`}
                      />
                      {answers && answers[t] && answers[t][alpha] && (
                        <Text color="tomato">{answers[t][alpha]}</Text>
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
            <Tfoot></Tfoot>
          </Table>
        </TableContainer>
        <Button type="submit" colorScheme="green">
          Submit
        </Button>
      </form>
    </>
  );
};
