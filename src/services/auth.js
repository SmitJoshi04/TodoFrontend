import axiosInstance from "../lib/axios"

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken)
  localStorage.setItem("refreshToken", refreshToken)
}

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/user/login", credentials)
  const { accessToken, refreshToken } = response.data.data
  setTokens(accessToken, refreshToken)
  return response.data
}

export const registerUser = async (userData) => {
  const formData = new FormData()
  formData.append("email", userData.email)
  formData.append("fullName", userData.fullName)
  formData.append("password", userData.password)
  if (userData.image?.[0]) {
    formData.append("image", userData.image[0])
  }

  const response = await axiosInstance.post("/user/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export const logoutApi = async () => {
  return await axiosInstance.post("/user/logout")
}

export const getAccessToken = () => localStorage.getItem("accessToken")
export const getRefreshToken = () => localStorage.getItem("refreshToken")
export const clearTokens = () => {
  localStorage.clear()
}
