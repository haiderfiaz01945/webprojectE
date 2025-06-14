"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  HomeIcon,
  EnvelopeIcon,
  UserCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const products = [
  {
    name: "Watches",
    description: "Elegant timepieces for every occasion",
    to: "/item/watches",
    icon: ClockIcon,
  },
  {
    name: "Shoes",
    description: "Stylish footwear for all lifestyles",
    to: "/item/shoes",
    icon: ShoppingBagIcon,
  },
  {
    name: "Phones",
    description: "Cutting-edge mobile technology",
    to: "/item/phones",
    icon: DevicePhoneMobileIcon,
  },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("Guest");
  const { cartCount = 0 } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.displayName) {
        const firstName = currentUser.displayName.split(" ")[0];
        setDisplayName(firstName);
      } else {
        setDisplayName("Guest");
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setDisplayName("Guest");
    navigate("/");
  };

  return (
    <header className="bg-[#222831] shadow-lg">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Branding */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-9 w-9 rounded-full bg-[#00ADB5] flex items-center justify-center">
                <span className="text-white font-bold text-lg">👋</span>
              </div>
              <span className="ml-2 text-white font-bold text-lg hidden sm:block">
                Hi, {displayName}
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <PopoverGroup className="flex space-x-4">
                <Popover className="relative">
                  <PopoverButton className="text-[#EEEEEE] hover:bg-[#393E46] hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    Products
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </PopoverButton>
                  <PopoverPanel className="absolute z-10 mt-2 w-64 rounded-lg shadow-lg bg-[#393E46] p-2 z-50">
                    {products.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-3 rounded-md p-3 text-sm hover:bg-[#222831]"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#00ADB5] text-white">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <Link
                            to={item.to}
                            className="block font-medium text-[#EEEEEE]"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-[#b5b5b5]">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </PopoverPanel>
                </Popover>

                <Link
                  to="/"
                  className="text-[#EEEEEE] hover:bg-[#393E46] hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <HomeIcon className="h-5 w-5 mr-1" />
                  Home
                </Link>
              </PopoverGroup>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Link
                to="/cart"
                className="relative p-1 text-[#EEEEEE] hover:text-white"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#00ADB5] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-[#EEEEEE] hover:bg-[#393E46] hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-[#EEEEEE] hover:bg-[#393E46] hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#EEEEEE] hover:text-white hover:bg-[#393E46] focus:outline-none"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#222831] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center">
              <div className="h-9 w-9 rounded-full bg-[#00ADB5] flex items-center justify-center">
                <span className="text-white font-bold text-lg">👋</span>
              </div>
              <span className="ml-2 text-white font-bold text-lg">
                Hi, {displayName}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-[#EEEEEE]"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-[#393E46]">
              <div className="space-y-2 py-6">
                <Disclosure>
                  <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold text-[#EEEEEE] hover:bg-[#393E46]">
                    Products
                    <ChevronDownIcon className="h-5 w-5" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {products.map((item) => (
                      <Link
                        onClick={() => setMobileMenuOpen(false)}
                        key={item.name}
                        to={item.to}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-[#EEEEEE] hover:bg-[#393E46] flex gap-2 items-center"
                      >
                        <item.icon className="h-5 w-5 text-[#00ADB5]" />
                        {item.name}
                      </Link>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  to="/"
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-[#EEEEEE] hover:bg-[#393E46] flex items-center gap-2"
                >
                  <HomeIcon className="h-5 w-5 text-[#00ADB5]" />
                  Home
                </Link>
              </div>

              <div className="py-6">
                <Link
                  to="/cart"
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-[#EEEEEE] hover:bg-[#393E46] flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}

                >
                  <ShoppingCartIcon className="h-5 w-5 text-[#00ADB5]" />
                  Cart ({cartCount})
                </Link>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left rounded-lg px-3 py-2.5 mt-2 text-base font-semibold text-[#EEEEEE] hover:bg-[#393E46] flex items-center gap-2"
                  >
                    <UserCircleIcon className="h-5 w-5 text-[#00ADB5]" />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block rounded-lg px-3 py-2.5 mt-2 text-base font-semibold text-[#EEEEEE] hover:bg-[#393E46] flex items-center gap-2"
                  >
                    <UserCircleIcon className="h-5 w-5 text-[#00ADB5]" />
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}