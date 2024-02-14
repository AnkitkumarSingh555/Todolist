import React, { useState, useEffect } from "react";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editedTodoId, setEditedTodoId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [id, setId] = useState();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      console.log(data);
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTodo,
            id: id,
            userId: 60,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTodos([...todos, data]); // Add the new todo to the local state
        setNewTodo(''); // Clear the input field
      } else {
        console.error('Failed to add todo');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = (id, title) => {
    setEditedTodoId(id);
    setEditedTitle(title);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${editedTodoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editedTitle,
          }),
        }
      );
      if (response.ok) {
        // Update local todos after successful update
        const updatedTodos = todos.map((todo) => {
          if (todo.id === editedTodoId) {
            return { ...todo, title: editedTitle };
          }
          return todo;
        });
        setTodos(updatedTodos);
        setEditedTodoId(null);
        setEditedTitle("");
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <>
      <div>
        <h1>Todo App</h1>
        <form onSubmit={handleAddTodo}>
          <div>
            <input
              type="text"
              defaultValue={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter todo title"
            />
          </div>

          <div>
            <input
              type="number"
              defaultValue={id}
              placeholder="Enter todo id"
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <button type="submit">Add Todo</button>
        </form>

        <div className="flex flex-col">
          {todos.map((todo) => (
            <div key={todo.id} className="flex justify-between my-2">
              
              {editedTodoId === todo.id ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <span>{todo.title}</span>
              )}
              <div className="flex justify-between">
              <button onClick={() => handleDeleteTodo(todo.id)} className="mx-5 bg-blue-900">Delete</button>
              <button className="mx-5 bg-blue-900" onClick={() => handleEdit(todo.id, todo.title)}>
                Edit
              </button>
              </div>
              {editedTodoId === todo.id && (
                <>
                  <button onClick={handleUpdate}>Update</button>
                  <button onClick={() => setEditedTodoId(null)}>Cancel</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TodoApp;
