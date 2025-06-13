import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllUsers, blockUser, unblockUser } from "../services/admin";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";

const Admin = () => {
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      toast.success("User blocked successfully.");
      refetch();
    },
    onError: (error) => {
      console.error("Failed to block user:", error);
      toast.error("Failed to block user. Please try again.");
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      toast.success("User unblocked successfully.");
      refetch();
    },
    onError: (error) => {
      console.error("Failed to unblock user:", error);
      toast.error("Failed to unblock user. Please try again.");
    },
  });

  if (isLoading) {
    return (
      <div className="px-4 py-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-10 w-48 mb-2" /> 
            <Skeleton className="h-4 w-72" /> 
          </div>

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["User", "Email", "Status", "Action"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Skeleton className="h-8 w-20 rounded-lg" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
          <p className="font-semibold mb-2">Error loading users</p>
          <p>{error.response?.data?.message || error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-600">
            Manage users' access and account status.
          </p>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersData?.data?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 text-left">
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || "https://via.placeholder.com/40"}
                        alt={user.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {user.fullName}
                        </span>
                        <span className="text-xs text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-700 truncate max-w-[250px]">
                    {user.email}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    {user.isBlocked ? (
                      <button
                        onClick={() => unblockUserMutation.mutate(user._id)}
                        disabled={unblockUserMutation.isPending}
                        className="bg-green-100 text-green-700 px-4 py-1.5 rounded hover:bg-green-200 disabled:opacity-50"
                      >
                        {unblockUserMutation.isPending
                          ? "Unblocking..."
                          : "Unblock"}
                      </button>
                    ) : (
                      <button
                        onClick={() => blockUserMutation.mutate(user._id)}
                        disabled={blockUserMutation.isPending}
                        className="bg-red-100 text-red-700 px-4 py-1.5 rounded hover:bg-red-200 disabled:opacity-50"
                      >
                        {blockUserMutation.isPending ? "Blocking..." : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
