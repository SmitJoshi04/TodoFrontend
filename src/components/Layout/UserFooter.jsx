const UserFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="ml-2 text-sm text-gray-500">Todos User Panel</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Todos. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
