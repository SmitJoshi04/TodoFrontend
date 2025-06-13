import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteTask, getAllTask } from "../services/task";
import toast from "react-hot-toast";
import Skeleton from "./Skeleton";

export default function TaskList({ setSelectedTask }) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tasks", { search, sort, order }],
    queryFn: getAllTask,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      refetch();
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task. Please try again.");
    },
  });

  return (
    <>
      <div className="p-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border p-2 rounded flex-grow min-w-0"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex space-x-3 pt-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))
          : data?.data?.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {task.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={task.image}
                      alt={task.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-auto">
                    <button
                      className="px-3 py-1.5 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                      onClick={() => setSelectedTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      onClick={() => deleteMutation.mutate(task._id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  );
}
