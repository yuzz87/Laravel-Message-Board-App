import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Pages.css";

import ArrowRightFromLine from "../assets/arrow-right-from-line.svg";
import ArrowLeftFromLine from "../assets/arrow-left-from-line.svg";
import coffee from "../assets/coffee.svg";

import loginicon from "../assets/database.svg";
import myprofileicon from "../assets/rabbit.svg";
import registericon from "../assets/expand.svg";
import createposticon from "../assets/brush.svg";
import mypostsicon from "../assets/view.svg";
import savedpostsicon from "../assets/bookmark-plus.svg";
import likedpostsicon from "../assets/book-heart.svg";

type LayoutProps = {
  title: string;
  children: ReactNode;
};

type MenuItem = {
  to: string;
  label: string;
  icon: string;
  alt: string;
};

const menuItems: MenuItem[] = [
  { to: "/", label: "Home", icon: coffee, alt: "home" },
  { to: "/login", label: "Login", icon: loginicon, alt: "login" },
  { to: "/register", label: "Register", icon: registericon, alt: "register" },
  { to: "/my-profile", label: "MyProfile", icon: myprofileicon, alt: "myprofile" },
  { to: "/profile/edit", label: "EditProfile", icon: myprofileicon, alt: "editprofile" },
  { to: "/posts/create", label: "CreatePost", icon: createposticon, alt: "createpost" },
  { to: "/my/posts", label: "MyPosts", icon: mypostsicon, alt: "myposts" },
  { to: "/saved-posts", label: "SavedPosts", icon: savedpostsicon, alt: "savedposts" },
  { to: "/liked-posts", label: "LikedPosts", icon: likedpostsicon, alt: "likedposts" },
];

export default function Layout({ title, children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : "sidebar-close"}`}>
        <div className="sidebar-top">
          <img src={coffee} alt="SideBar" className="coffee-icon" />

          <button
            type="button"
            className="sidebar-toggle-button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <img
              src={isSidebarOpen ? ArrowLeftFromLine : ArrowRightFromLine}
              alt={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
              className="sidebar-toggle-icon"
            />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-menu-item ${isActive ? "sidebar-menu-item-active" : ""}`
                  }
                >
                  <img src={item.icon} alt={item.alt} className="menu-icon" />
                  <span className="sidebar-item-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className={`page-content ${isSidebarOpen ? "page-content-open" : "page-content-close"}`}>
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        <main className="page-main">
          <div className="page-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}