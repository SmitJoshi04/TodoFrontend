import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createTask, updateTask } from "../services/task";
import toast from "react-hot-toast";
import { queryClient } from "../lib/queryClient";

const taskSchema = (isEditing) =>
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: isEditing
      ? z.any().optional()
      : z
          .any()
          .refine(
            (fileList) =>
              fileList instanceof FileList &&
              fileList.length > 0 &&
              fileList[0].size > 0,
            { message: "Image is required" }
          ),
  });

export default function TaskForm({ selectedTask, setSelectedTask, onClose }) {
  const isEditing = !!selectedTask;
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema(isEditing)),
  });

  const addMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task created successfully!");
      reset();
      setPreview(null);
      queryClient.invalidateQueries(["tasks"]);
      onClose?.();
    },
    onError: (error) => {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task. Please try again.");
    },
  });

  const editMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast.success("Task updated successfully!");
      reset();
      setPreview(null);
      setSelectedTask(null);
      queryClient.invalidateQueries(["tasks"]);
      onClose?.();
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task. Please try again.");
    },
  });

  useEffect(() => {
    if (selectedTask) {
      reset({
        title: selectedTask.title,
        description: selectedTask.description,
        image: undefined,
      });
      setPreview(selectedTask.image || null);
    } else {
      reset();
      setPreview(null);
    }
  }, [selectedTask, reset]);

  const watchImage = watch("image");
  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  }, [watchImage]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    if (data.image && data.image.length > 0) {
      const file = data.image[0];
      if (file instanceof File && file.size > 0) {
        formData.append("image", file);
      }
    }

    if (isEditing) {
      editMutation.mutate({ id: selectedTask._id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-4 shadow rounded-md"
      encType="multipart/form-data"
    >
      <div>
        <input
          type="text"
          placeholder="Title"
          {...register("title")}
          className="border p-2 w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          placeholder="Description"
          {...register("description")}
          className="border p-2 w-full"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="border p-2 w-full"
        />
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover mt-2 rounded"
          />
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={addMutation.isPending || editMutation.isPending}
        >
          {isEditing ? "Update Task" : "Add Task"}
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setSelectedTask(null);
            setPreview(null);
            onClose?.();
          }}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
