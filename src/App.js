import logo from './logo.svg';
import './App.css';

import { getCurrentUser } from "aws-amplify/auth";
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
import {
  createTodo as createTodoMutation,
  updateTodo as updateTodoMutation,
  deleteTodo as deleteTodoMutation,
} from "./graphql/mutations";
import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AddTodoModal } from "./components/AddTodoModal";
import { EditTodoModal } from "./components/EditTodoModal";

const client = generateClient();

function App({ signOut}) {
  const [user, setUser]   = useState({ id: "", name: ""});
  const [todos, setTodos] = useState([]);
  const [preTodo, setPreTodo] = useState([]);
  const [isOpenAddModal, setIsOpenAddModal]   = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userInfo = await getCurrentUser();
      // userInfo.userId: ユーザーID(Sub), userInfo.username: ユーザー名
      setUser({ id: userInfo.userId, name: userInfo.username });
    }
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await client.graphql({ query: listTodos });
    const todosFromAPI = apiData.data.listTodos.items;
    setTodos(todosFromAPI);
  }

  function handleAddModal() {
    setIsOpenAddModal(!isOpenAddModal);
  }

  function handleEditModal() {
    setIsOpenEditModal(!isOpenEditModal);
  }

  async function createTodo(event) {
    const data = {
      title: event.title,
      status: event.status,
      priority: event.priority,
      start: event.start,
      end: event.end,
      description: event.description,
      user: event.user,
    };
    await client.graphql({ 
      query: createTodoMutation, 
      variables: { input: data } 
    });
    fetchTodos();
  }

  async function updateTodo(event) {
    const data = {
      id: event.id,
      title: event.title,
      status: event.status,
      priority: event.priority,
      start: event.start,
      end: event.end,
      description: event.description,
      user: event.user,
    }
    await client.graphql({
      query: updateTodoMutation,
      variables: { input: data }
    });
    fetchTodos();
  }

  async function deleteTodo({ id }) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    await client.graphql({ 
      query: deleteTodoMutation, 
      variables: { input: { id } } 
    });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <View className="App" margin="0.3rem">
        <View className="header">
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          > 
            <Heading level={1}>My Todo App</Heading>
            <Flex direction="row">
              <p>{user.name}</p>
              <Button onClick={signOut}>Sign Out</Button>
            </Flex>
          </Flex>
        </View>
        <View className="add-todo-button" margin="1rem 1rem">
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Button onClick={handleAddModal}>Add +</Button>
          </Flex>
        </View>
        {isOpenAddModal && (
          <AddTodoModal 
            userId={user.id} 
            createTodo={createTodo} 
            handleAddModal={handleAddModal}>
          </AddTodoModal>
        )}
        {isOpenEditModal && (
          <EditTodoModal 
            userId={user.id} 
            preTodo={preTodo} 
            updateTodo={updateTodo}
            handleEditModal={handleEditModal}>
          </EditTodoModal>
        )}
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
                  <TableCell>
                    {todo.description ? todo.description : "-"}
                  </TableCell>
                  <TableCell>
                    <Button 
                      margin="0 1rem"
                      onClick={() => {
                        setPreTodo(todo);
                        handleEditModal();
                      }}>Edit</Button>
                    <Button onClick={() => deleteTodo(todo)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </View>
      </View>
    </LocalizationProvider>
  );
}

export default withAuthenticator(App);
