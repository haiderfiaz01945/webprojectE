"use client";

import { useState } from "react";
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
  BuildingOfficeIcon,
  EnvelopeIcon,
  UserCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

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
  const { cartCount = 0 } = useCart(); // Default value as fallback

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <nav className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-xl">YC</span>
              </div>
              <span className="ml-2 text-white font-bold text-xl">
                YourCart
              </span>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <PopoverGroup className="hidden lg:flex lg:gap-x-8">
            <Popover className="relative">
              <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white hover:text-indigo-100 transition-colors">
                Products
                <ChevronDownIcon
                  className="h-5 w-5 flex-none"
                  aria-hidden="true"
                />
              </PopoverButton>

              <PopoverPanel className="absolute -left-8 top-full z-10 mt-3 w-64 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-4 rounded-lg p-3 text-sm leading-6 hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-white">
                      <item.icon
                        className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <Link
                        to={item.to}
                        className="display:block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </Link>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </PopoverPanel>
            </Popover>

            <Link
              to="/"
              className="text-sm font-semibold leading-6 text-white hover:text-indigo-100 transition-colors flex items-center gap-1"
            >
              <HomeIcon className="h-5 w-5" />
              Home
            </Link>
            <Link
              to="#"
              className="text-sm font-semibold leading-6 text-white hover:text-indigo-100 transition-colors flex items-center gap-1"
            >
              <BuildingOfficeIcon className="h-5 w-5" />
              Company
            </Link>
            <Link
              to="/aboutus"
              className="text-sm font-semibold leading-6 text-white hover:text-indigo-100 transition-colors flex items-center gap-1"
            >
              About Us
            </Link>
            <Link
              to="/contactus"
              className="text-sm font-semibold leading-6 text-white hover:text-indigo-100 transition-colors flex items-center gap-1"
            >
              <EnvelopeIcon className="h-5 w-5" />
              Contact
            </Link>
          </PopoverGroup>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-6">
            <Link
              to="/cart"
              className="flex items-center gap-1 text-sm font-semibold leading-6 text-white hover:text-indigo-100 transition-colors relative"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1 text-sm font-semibold leading-6 text-white hover:text-indigo-100 transition-colors"
            >
              <UserCircleIcon className="h-5 w-5" />
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </nav>

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">YC</span>
              </div>
              <span className="ml-2 text-gray-900 font-bold text-xl">
                YourCart
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Products
                    <ChevronDownIcon
                      className="h-5 w-5 flex-none"
                      aria-hidden="true"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {products.map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as={Link}
                        to={item.to}
                        className="display:block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-indigo-600" />
                          <div>
                            <div>{item.name}</div>
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <Link
                  to="/"
                  className="-mx-3 display:block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                >
                  <HomeIcon className="h-5 w-5" />
                  Home
                </Link>

                <Link
                  to="#"
                  className="-mx-3 display:block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                >
                  <BuildingOfficeIcon className="h-5 w-5" />
                  Company
                </Link>

                <Link
                  to="/aboutus"
                  className="-mx-3 display:block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  About Us
                </Link>

                <Link
                  to="/contactus"
                  className="-mx-3 display:block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                  Contact Us
                </Link>
              </div>

              <div className="py-6">
                <Link
                  to="/login"
                  className="-mx-3 display:block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  Log in
                </Link>
                <Link
                  to="/cart"
                  className="-mx-3 display:block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center gap-2 mt-2"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Cart ({cartCount})
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
