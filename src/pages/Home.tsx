import React, { useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";

export default function Home() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddTask = () => {
    setSelectedTask(null); 
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setSelectedTask(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        {!isFormVisible && (
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            + Add Task
          </button>
        )}
      </div>

      {isFormVisible ? (
        <TaskForm
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          onClose={handleFormClose}
        />
      ) : (
        <TaskList
          setSelectedTask={(task) => {
            setSelectedTask(task);
            setIsFormVisible(true); 
          }}
        />
      )}
    </div>
  );
}
