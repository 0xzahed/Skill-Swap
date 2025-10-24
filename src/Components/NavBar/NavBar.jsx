import React, { use } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { CiUser } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";

const NavBar = () => {
  const { user, logOut } = use(AuthContext);

  const handleLogout = () => {
    logOut()
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };
  const links = (
    <>
      <li>
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            `px-3 py-2 transition ${
              isActive
                ? "text-[#422AD5] bg-[#EBE9FA] rounded-lg font-semibold"
                : "text-gray-700 hover:text-[#422AD5] bg-transparent"
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <a
          href="/#services"
          className="px-3 py-2 transition text-gray-700 hover:text-[#422AD5] bg-transparent"
        >
          Service
        </a>
      </li>
      <li>
        <NavLink
          to={"/about"}
          className={({ isActive }) =>
            `px-3 py-2 transition ${
              isActive
                ? "text-[#422AD5] bg-[#EBE9FA] rounded-lg font-semibold"
                : "text-gray-700 hover:text-[#422AD5] bg-transparent"
            }`
          }
        >
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/contact_us"}
          className={({ isActive }) =>
            `px-3 py-2 transition ${
              isActive
                ? "text-[#422AD5] bg-[#EBE9FA] rounded-lg font-semibold"
                : "text-gray-700 hover:text-[#422AD5] bg-transparent"
            }`
          }
        >
          Contact Us
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="px-10 navbar bg-base-100 shadow-sm sticky top-0 z-40">
      <div className="navbar-start flex items-center gap-2">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow flex flex-col gap-2 "
          >
            {links}
          </ul>
        </div>

        <NavLink
          to="/"
          className="btn btn-ghost text-2xl font-bold text-[#422AD5]"
        >
          SkillSwap
        </NavLink>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 flex items-center gap-2 text-lg font-semibold">
          {links}
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-3">
            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                title={user.displayName || "User Profile"}
              >
                <div className="w-10 rounded-full ring-2 ring-[#422AD5] ring-offset-2">
                  <img
                    alt="User Avatar"
                    src={
                      user.photoURL ||
                      "https://i.postimg.cc/5y8zTvMg/default-avatar.png"
                    }
                    onError={(e) => {
                      e.target.src =
                        "https://i.postimg.cc/5y8zTvMg/default-avatar.png";
                    }}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border absolute right-0"
              >
                <li className="menu-title px-3 py-2">
                  <span className="text-[#422AD5] font-semibold">
                    {user.displayName || "User"}
                  </span>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#EBE9FA] rounded-lg"
                  >
                    <CiUser></CiUser>
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 hover:text-red-600 rounded-lg w-full text-left"
                  >
                    <FiLogOut></FiLogOut>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/auth/login"
              className="btn btn-outline btn-sm text-[#422AD5] border-[#422AD5] hover:bg-[#422AD5] hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="btn btn-sm text-white bg-[#422AD5] hover:bg-[#3a1fb8]"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
