import React, { useState } from "react";
import { 
    Button, 
    Flex, 
    Heading, 
    SelectField, 
    TextField, 
    TextAreaField, 
    View, 
} from "@aws-amplify/ui-react";
import {
    DatePicker
} from "@mui/x-date-pickers";
import dayjs from "dayjs";

const statusList   = ["New", "Open", "On Hold", "Resolved", "Close"];
const priorityList = ["Trivial", "Minor", "Major", "Critical", "Blocker"];

export function EditTodoModal({ userId, preTodo, updateTodo, handleEditModal }) {
    const [todo, setTodos] = useState({ ...preTodo, user: userId });

    return (
        <div className="overlay">
            <div className="content">
                <View className="header">
                    <Heading level={2}>Edit Todo</Heading>
                </View>
                <View margin="1rem">
                    <Flex direction="column">
                        <TextField
                            placeholder="Input todo title"
                            label="Title"
                            value={todo.title}
                            onChange={(e) => setTodos({ ...todo, title: e.target.value })}
                        />
                        <TextAreaField
                            placeholder="Input todo description"
                            label="Description"
                            value={todo.description}
                            onChange={(e) => setTodos({ ...todo, description: e.target.value })}
                        />
                        <SelectField
                            label="Status"
                            value={todo.status}
                            onChange={(e) => setTodos({ ...todo, status: e.target.value })}
                        >
                            {statusList.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </SelectField>
                        <SelectField
                            label="Priority"
                            value={todo.priority}
                            onChange={(e) => setTodos({ ...todo, priority: e.target.value })}
                        >
                            {priorityList.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </SelectField>
                        <Flex 
                            direction="row" 
                            justifyContent="space-between" 
                            alignItems="center" 
                            margin="1rem 0"
                        >
                            <DatePicker
                                label="Start Date"
                                value={dayjs(todo.start)}
                                onChange={(date) => setTodos({ ...todo, start: dayjs(date).format("YYYY-MM-DD") })}
                            />
                            <span>-</span>
                            <DatePicker
                                label="End Date"
                                value={dayjs(todo.end)}
                                onChange={(date) => setTodos({ ...todo, end: dayjs(date).format("YYYY-MM-DD") })}
                            />
                        </Flex>
                    </Flex>
                    <Flex 
                        direction="row" 
                        justifyContent="flex-end" 
                        alignItems="center" 
                        margin="1rem 0"
                    >
                        <Button onClick={handleEditModal}>Cansel</Button>
                        <Button 
                            onClick={() => {
                                updateTodo(todo);
                                handleEditModal();
                            }}
                        >
                            Edit
                        </Button>
                    </Flex>
                </View>
            </div>
        </div>
    );
}