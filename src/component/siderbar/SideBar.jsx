import React from 'react'

const sidebarItems = [
  { icon: "fa-grind-horizontal", label: "Dashboard" },
  { icon: "fa-message", label: "Chat" },
  { icon: "fa-square-h", label: "Talk to a therapist" },
  { icon: "fa-blogger", label: "Blog" },
  { icon: "fa-user", label: "Profile" },
  { icon: "fa-credit-card", label: "Payments" },
  { icon: "fa-right-from-bracket", label: "Logout", extraClass: "mt-8" },
];

const SideBar = () => {
  return (
    <div className="flex flex-col w-30 md:w-65 p-4" style={{ backgroundColor: "#111827" }}>
      <div className="flex">
        <h2 className="text-white text-2xl font-bold p-4 mt-5">Anonymous Therapy</h2>
      </div>
      <div className="mt-4">
        <ul className="list-none space-y-2 w-59">
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              className={`cursor-pointer text-gray-500 p-4 transition text-lg duration-300 ease-in-out hover:scale-105 rounded flex items-center shadow-sm hover:bg-gray-500 hover:text-white gap-4 ${item.extraClass || ""}`}
            >
              <i className={`fa-solid ${item.icon} mr-2`}></i>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SideBar
