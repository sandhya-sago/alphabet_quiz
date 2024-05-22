import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { quizService } from "../client";
import {
  Heading,
  HStack,
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

const TIMER_UPDATE = 1; //Sec

const CountdownTimer = ({ time = "180" }) => {
  const [delay, setDelay] = useState(+time);
  const sign = delay < 0 ? "-" : "";
  const result =
    sign +
    Math.abs(parseInt(String(delay / 60))) +
    ":" +
    String(Math.abs(delay % 60)).padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => {
      setDelay(delay - TIMER_UPDATE);
    }, TIMER_UPDATE * 1000);

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <Text fontSize="40px" color={sign.length === 0 ? "" : "tomato"}>
      {result}
    </Text>
  );
};

export const Quiz = () => {
  const location = useLocation();
  const [quizData, setQuizData] = useState({ topics: [], alphabets: [] });
  const [answers, setAnswers] = useState({});
  const [correct, setCorrect] = useState({});

  const timer = location.state.timer || 10;

  useEffect(() => {
    if (location.state?.selectedTopics) {
      const query = { query: { _id: { $in: location.state.selectedTopics } } };
      quizService.find(query).then((data) => setQuizData(data));
    } else {
      quizService.find().then((data) => setQuizData(data));
    }
  }, [location.state?.selectedTopics]);

  const submitQuiz = async (event) => {
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
    const ans = await quizService.create(quizData, {
      headers: { "X-Service-Method": "getAnswers" },
    });
    setAnswers(ans);
    setCorrect(
      Object.entries(ans).reduce(
        (obj, [topic, alpha]) => ({
          ...obj,
          [topic]: Object.entries(alpha).reduce(
            (aobj, [char, answr]) => ({
              ...aobj,
              [char]: answr.toLowerCase() === filled[topic][char].toLowerCase(),
            }),
            {}
          ),
        }),
        {}
      )
    );
  };

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
                    <Td key={`${t}:${alpha}`}>
                      <Input
                        variant="filled"
                        focusBorderColor="lime"
                        htmlSize={4}
                        name={`${t}:${alpha}`}
                      />
                      {answers && answers[t] && answers[t][alpha] && (
                        <Text color={correct[t][alpha] ? undefined : "tomato"}>
                          {answers[t][alpha]}
                        </Text>
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
            <Tfoot></Tfoot>
          </Table>
        </TableContainer>
        <HStack spacing="24px">
          <Button type="submit" colorScheme="green">
            Submit
          </Button>
          <CountdownTimer time={String(timer * 60)} />
        </HStack>
      </form>
    </>
  );
};
