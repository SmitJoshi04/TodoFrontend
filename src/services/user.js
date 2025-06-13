import axiosInstance from "../lib/axios";

export const fetchCurrentUser = async () => {
  const { data } = await axiosInstance.get("/user/current-user"); // Adjust endpoint
  return data.data;
};

export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await axiosInstance.patch("/user/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateAccount = async (values) => {
  const { data } = await axiosInstance.patch("/user/update-profile", values);
  return data.data;
};

export const changePassword = async (formData) => {
  const { data } = await axiosInstance.patch("/user/change-password", formData);
  return data.data;
};
