import axiosInstance from "../lib/axios";

export const getAllTask = async ({ queryKey }) => {
  const [_key, { search = "", sort = "createdAt", order = "desc" } = {}] =
    queryKey;

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  const response = await axiosInstance.get(`/task?${params.toString()}`);
  return response.data;
};

export const createTask = async (formData) => {
  const response = await axiosInstance.post("/task", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateTask = async ({ id, data }) => {
  const response = await axiosInstance.put(`/task/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axiosInstance.delete(`/task/${taskId}`);
  return response.data;
};
