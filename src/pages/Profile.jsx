import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCurrentUser,
  updateAccount,
  updateAvatar,
} from "../services/user";
import ResetPassword from "../components/ResetPassword";
import { queryClient } from "../lib/queryClient";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";

const updateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
});

export default function Profile() {
  const [isPasswordChange, setPasswordChange] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    if (user) {
      reset({ fullName: user.fullName, email: user.email });
    }
  }, [user, reset]);

  const avatarMutation = useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Avatar updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update avatar:", error);
      toast.error("Failed to update avatar.");
    },
  });

  const accountMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      toast.success("Account updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("Failed to update account:", error);
      toast.error("Failed to update account.");
    },
  });

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) avatarMutation.mutate(file);
  };

  const onSubmit = (values) => {
    accountMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/80 backdrop-blur shadow-xl rounded-3xl p-6 sm:p-10 space-y-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="flex flex-col items-center gap-6">
            <Skeleton className="rounded-full w-32 h-32" />
            <Skeleton className="w-24 h-5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="col-span-full h-10 w-36 rounded-lg mt-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/80 backdrop-blur shadow-xl rounded-3xl p-6 sm:p-10 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">Your Profile</h2>

        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={user?.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm text-white cursor-pointer transition duration-300">
              Change
              <input
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          {avatarMutation.isLoading && (
            <p className="text-sm text-gray-500">Uploading avatar...</p>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <div className="col-span-full sm:col-span-1">
            <label className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullName")}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="col-span-full sm:col-span-1">
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="col-span-full">
            <button
              type="submit"
              disabled={accountMutation.isLoading}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {accountMutation.isLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>

        {/* Password Change Toggle */}
        <div className="border-t pt-6">
          <button
            onClick={() => setPasswordChange((prev) => !prev)}
            className="text-sm font-medium text-green-600 hover:underline"
          >
            {isPasswordChange ? "Cancel Password Change" : "Change Password"}
          </button>

          {isPasswordChange && (
            <div className="mt-4">
              <ResetPassword />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
