import React, { use, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { CiUser } from "react-icons/ci";
import { FiLogOut, FiBookOpen, FiX, FiMenu } from "react-icons/fi";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const NavBar = () => {
  const { user, logOut } = use(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logOut().catch((err) => console.error("Logout error:", err));
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-semibold transition-colors duration-200 group ${
      isActive ? "text-primary" : "text-base-content/80 hover:text-primary"
    }`;

  const linkUnderline = (isActive) =>
    `absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
      isActive ? "w-full" : "w-0 group-hover:w-full"
    }`;

  const links = [
    { to: "/", label: "Home" },
    { to: "/service", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/contact_us", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          isHome && !scrolled
            ? "bg-transparent"
            : "bg-white shadow-lg border-b border-base-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">
                S
              </div>
              <span className="text-xl font-black text-primary tracking-tight">
                SkillSwap
              </span>
            </NavLink>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map(({ to, label }) => (
                <NavLink key={to} to={to} className={navLinkClass} end={to === "/"}>
                  {({ isActive }) => (
                    <>
                      {label}
                      <span className={linkUnderline(isActive)} />
                    </>
                  )}
                </NavLink>
              ))}
              <a
                href="https://wa.me/8801744546898"
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-3 py-2 text-sm font-semibold text-base-content/80 hover:text-primary transition-colors duration-200 group"
              >
                Support
                <span className="absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-primary w-0 group-hover:w-full transition-all duration-300" />
              </a>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {user ? (
                <div className="dropdown dropdown-end hidden lg:block">
                  <div
                    tabIndex={0}
                    role="button"
                    className="cursor-pointer"
                    title={user.displayName || "User Profile"}
                  >
                    <div className="w-9 h-9 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden">
                      <img
                        alt="User Avatar"
                        src={user.photoURL || "https://i.postimg.cc/5y8zTvMg/default-avatar.png"}
                        onError={(e) => { e.target.src = "https://i.postimg.cc/5y8zTvMg/default-avatar.png"; }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-56 p-2 shadow-xl border border-base-300"
                  >
                    <li className="px-3 py-2">
                      <p className="text-primary font-bold text-sm truncate">{user.displayName || "User"}</p>
                      <p className="text-base-content/50 text-xs truncate">{user.email}</p>
                    </li>
                    <div className="divider my-1" />
                    <li>
                      <NavLink to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 hover:text-primary rounded-xl text-sm">
                        <CiUser size={16} /> My Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-bookings" className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 hover:text-primary rounded-xl text-sm">
                        <FiBookOpen size={16} /> My Bookings
                      </NavLink>
                    </li>
                    <div className="divider my-1" />
                    <li>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 hover:bg-error/10 hover:text-error rounded-xl w-full text-left text-sm">
                        <FiLogOut size={16} /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link to="/auth/login" className="btn btn-ghost btn-sm font-semibold text-base-content/80 hover:text-primary">
                    Log in
                  </Link>
                  <Link to="/auth/register" className="btn btn-primary btn-sm rounded-full px-5 text-white">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button className="lg:hidden btn btn-ghost btn-sm" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <FiMenu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 z-50 bg-base-100 shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <NavLink to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">S</div>
            <span className="text-xl font-black text-primary">SkillSwap</span>
          </NavLink>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setMobileOpen(false)}><FiX size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-base-content/80 hover:bg-base-200 hover:text-primary"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://wa.me/8801744546898"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="flex items-center px-4 py-3 rounded-xl font-semibold text-sm text-base-content/80 hover:bg-base-200 hover:text-primary transition-colors"
          >
            Support
          </a>
        </nav>

        <div className="px-4 py-5 border-t border-base-300 space-y-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-2 mb-3">
                <div className="w-10 h-10 rounded-full ring-2 ring-primary overflow-hidden">
                  <img src={user.photoURL || "https://i.postimg.cc/5y8zTvMg/default-avatar.png"} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-base-content truncate">{user.displayName || "User"}</p>
                  <p className="text-xs text-base-content/50 truncate">{user.email}</p>
                </div>
              </div>
              <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="btn btn-outline btn-sm w-full rounded-xl">My Profile</NavLink>
              <NavLink to="/my-bookings" onClick={() => setMobileOpen(false)} className="btn btn-outline btn-sm w-full rounded-xl">My Bookings</NavLink>
              <button onClick={handleLogout} className="btn btn-error btn-outline btn-sm w-full rounded-xl flex items-center gap-2 justify-center">
                <FiLogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" onClick={() => setMobileOpen(false)} className="btn btn-outline btn-primary btn-sm w-full rounded-xl">Log in</Link>
              <Link to="/auth/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm w-full rounded-xl text-white">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
