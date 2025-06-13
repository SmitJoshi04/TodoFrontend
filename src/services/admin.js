import axiosInstance from '../lib/axios'

export const getAllUsers = async () => {
  const response = await axiosInstance.get('/admin/users')
  return response.data
}

export const blockUser = async (userId) => {
  const response = await axiosInstance.patch(`/admin/block/${userId}`)
  return response.data
}

export const unblockUser = async (userId) => {
  const response = await axiosInstance.patch(`/admin/unblock/${userId}`)
  return response.data
} 