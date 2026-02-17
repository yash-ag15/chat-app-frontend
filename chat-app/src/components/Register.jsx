const Register = () => {
  return (
    <form className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-gray-400
                     transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-gray-400
                     transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-gray-400
                     transition"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium
                   hover:bg-gray-800 transition mt-6"
      >
        Register
      </button>

    </form>
  );
};

export default Register;
