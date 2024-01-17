import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";
import { users } from "../utils/data.js";
import { useSelector } from "react-redux";

function MenuList({ user, onClick }) {
  const handleLogout = () => {};

  return (
    <div>
      <Menu as="div" className="inline-block text-left">
        <div className=" flex">
          <Menu.Button className="inline-flex gap-2 w-full rounded-md bg-white md:px-4 py-2 text-sm font-medium text-slate-700 :bg-opacity-20">
            <div className="leading[80px] flex flex-col items-start">
              <p className="text-   font-semibold">
                {user?.firstName ?? user?.name}
              </p>
              <span className="text-sm text-green-600">
                {user?.jobTitle ?? user?.email}
              </span>
            </div>

            <img
              src={user?.profileUrl}
              alt="user-profile"
              className="w-10 h-10 rounded-full object-cover"
            ></img>
            <BiChevronDown
              className="h-8 w-8 text-state-600 "
              aria-hidden="true"
            ></BiChevronDown>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="trasition ease-out duration-100"
          enterForm="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-50 right-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none">
            <div className="p-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`${
                      user?.accountType ? "user-profile" : "company-profile"
                    }`}
                    className={`${
                      active ? "bg-[#00BF63] text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md p-2 text-sm hover:text-black`}
                    onClick={onClick}
                  >
                    <CgProfile
                      className={`${
                        active ? "text-white" : "text-gray-900"
                      } mr-2 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {user?.accountType ? "User Profile" : "Company Profile"}
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleLogout()}
                    className={`${
                      active ? "bg-[#00BF63] text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <AiOutlineLogout
                      className={`${
                        active ? "text-white" : "text-gray-600"
                      } mr-2 h-5 w-5  `}
                      aria-hidden="true"
                    />
                    Log Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

const Navbar = () => {
  const user = users[1];

  const [isOpen, setIsOpen] = useState(false);

  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      <div className="relative bg-white z-50">
        <nav className="container mx-auto flex items-center justify-between p-5">
          <div>
            <Link to="/user-auth" className="text-green-900 font-bold text-xl">
              Work<span className="text-green-600">Shift</span>
            </Link>
          </div>
          <ul className="hidden lg:flex gap-10 text-base">
            <li>
              <Link to="/">Find Job</Link>
            </li>
            <li>
              <Link to="/companies">Companies</Link>
            </li>
            <li>
              <Link to="/upload-job">Upload Job</Link>
            </li>
            <li>
              <Link to="/about-us">About</Link>
            </li>
          </ul>

          <div className="hidden lg:block">
            {!user?.token ? (
              <Link to="/user-auth">
                <CustomButton
                  title="Sign-in"
                  containerStyles="text-green-600 py-1.5 px-5 focus:outlione-none :bg-green-800 :text-white rounded-full text-base border border-green-600"
                />
              </Link>
            ) : (
              <div>
                <MenuList user={user} />
              </div>
            )}
            <Link to="/user-auth"></Link>
          </div>
          <button
            className="block lg:hidden text-slate-900"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </nav>
        {/* mobile menu */}
        <div
          className={`${
            isOpen ? "absolute flex bg-[#F1FFEB] " : "hidden"
          } container mx-auto lg:hidden flex-col pl-8 gap-3 py-5`}
        >
          <Link to="/" onClick={handleCloseNavbar}>
            Find Job
          </Link>
          <Link to="/companies" onClick={handleCloseNavbar}>
            Companies
          </Link>
          <Link
            onClick={handleCloseNavbar}
            to={
              user?.accountType === "seeker" ? "applly-gistory" : "upload-job"
            }
          >
            {user?.accountType === "seeker" ? "Applications" : "Upload Job"}
          </Link>
          <Link to="/about-us" onClick={handleCloseNavbar}>
            About
          </Link>

          <div className="w-full py-10">
            {!user?.token ? (
              <a href="/user-auth">
                <CustomButton
                  title="Sign In"
                  containerStyles={`text-[#00BF63] py-1.5 px-5 focus:outline-none hover:bg-[#00BF63] hover:text-white rounded-full text-base border border-[#00BF63]`}
                />
              </a>
            ) : (
              <div>
                <MenuList user={user} onClick={handleCloseNavbar} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;