import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../services/user";
import toast from "react-hot-toast";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password is required"),
    password: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      reset();
      toast.success("Password changed successfully.");
    },
    onError: (err) => {
      console.error("Password change failed:", err);
      console.log(err?.response?.data);
      toast.error(
        "Unable to change password. Please check your current password and try again."
      );
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.password,
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md p-6 sm:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            {...register("oldPassword")}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.oldPassword ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            {...register("password")}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {mutation.isPending ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
