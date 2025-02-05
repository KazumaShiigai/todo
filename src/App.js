import logo from './logo.svg';
import './App.css';

import { generateClient } from 'aws-amplify/api';
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Flex,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Heading,
  View,
} from "@aws-amplify/ui-react";
import { listTodos } from "./graphql/queries";
import React, { useState, useEffect } from 'react';

const client = generateClient();

function App({ signOut}) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await client.graphql({ query: listTodos });
    const todosFromAPI = apiData.data.listTodos.items;
    setTodos(todosFromAPI);
  }

  return (
    <View className="App" margin="0.3rem">
      <View className="header">
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        > 
          <Heading level={1}>My Todo App</Heading>
          <Flex direction="row">
            <Button onClick={signOut}>Sign Out</Button>
          </Flex>
        </Flex>
      </View>
      <View margin="3rem 0">
        <Table caption="" highlightOnHover={false}>
          <TableHead>
            <TableRow>
              <TableCell as="th">No.</TableCell>
              <TableCell as="th">Title</TableCell>
              <TableCell as="th">Status</TableCell>
              <TableCell as="th">Priority</TableCell>
              <TableCell as="th">Milestone</TableCell>
              <TableCell as="th">Discription</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((todo, index) => (
              <TableRow key={index}>
                <TableCell>{index}</TableCell>
                <TableCell>{todo.title}</TableCell>
                <TableCell>{todo.status}</TableCell>
                <TableCell>{todo.priority}</TableCell>
                <TableCell>
                  {todo.start} - {todo.end}
                </TableCell>
                <TableCell>{todo.description ? todo.description : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
    </View>
  );
}

export default withAuthenticator(App);
