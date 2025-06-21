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
  const [avatar, setAvatar] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.displayName) {
        const firstName = currentUser.displayName.split(" ")[0];
        setDisplayName(firstName);
        setAvatar(currentUser.photoURL);
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
    <header className="nav__header">
      <nav className="nav__container">
        <div className="nav__wrapper">
          {/* Branding */}
          <div className="nav__brand-container">
            <Link to="/" className="nav__brand-link">
              <div className="nav__avatar-container">
                {avatar ? (
                  <img src={avatar} alt="User Avatar" className="nav__avatar-image" />
                ) : (
                  <span className="nav__avatar-placeholder">👋</span>
                )}
              </div>
              <span className="nav__brand-text">
                Hi, {displayName}
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="nav__desktop-menu">
            <div className="nav__desktop-menu-items">
              <PopoverGroup className="nav__popover-group">
                <Popover className="nav__popover">
                  <PopoverButton className="nav__popover-button">
                    Products
                    <ChevronDownIcon className="nav__chevron-icon" />
                  </PopoverButton>
                  <PopoverPanel className="nav__popover-panel">
                    {products.map((item) => (
                      <div
                        key={item.name}
                        className="nav__product-item"
                      >
                        <div className="nav__product-icon-container">
                          <item.icon className="nav__product-icon" />
                        </div>
                        <div>
                          <Link
                            to={item.to}
                            className="nav__product-link"
                          >
                            {item.name}
                          </Link>
                          <p className="nav__product-description">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </PopoverPanel>
                </Popover>

                <Link
                  to="/"
                  className="nav__desktop-link"
                >
                  <HomeIcon className="nav__desktop-link-icon" />
                  Home
                </Link>
              </PopoverGroup>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="nav__desktop-right">
            <div className="nav__right-items">
              <Link
                to="/cart"
                className="nav__cart-link"
              >
                <ShoppingCartIcon className="nav__cart-icon" />
                {cartCount > 0 && (
                  <span className="nav__cart-badge">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="nav__auth-button"
                >
                  <UserCircleIcon className="nav__auth-icon" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="nav__auth-button"
                >
                  <UserCircleIcon className="nav__auth-icon" />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="nav__mobile-menu-button-container">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="nav__mobile-menu-button"
            >
              <Bars3Icon className="nav__mobile-menu-icon" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="nav__mobile-dialog">
        <div className="nav__mobile-overlay" />
        <DialogPanel className="nav__mobile-panel">
          <div className="nav__mobile-header">
            <Link to="/" className="nav__mobile-brand-link">
              <div className="nav__mobile-avatar-container">
                <span className="nav__mobile-avatar-placeholder">👋</span>
              </div>
              <span className="nav__mobile-brand-text">
                Hi, {displayName}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="nav__mobile-close-button"
            >
              <XMarkIcon className="nav__mobile-close-icon" />
            </button>
          </div>

          <div className="nav__mobile-content">
            <div className="nav__mobile-sections">
              <div className="nav__mobile-section">
                <Disclosure>
                  <DisclosureButton className="nav__mobile-disclosure-button">
                    Products
                    <ChevronDownIcon className="nav__mobile-chevron-icon" />
                  </DisclosureButton>
                  <DisclosurePanel className="nav__mobile-disclosure-panel">
                    {products.map((item) => (
                      <Link
                        onClick={() => setMobileMenuOpen(false)}
                        key={item.name}
                        to={item.to}
                        className="nav__mobile-product-link"
                      >
                        <item.icon className="nav__mobile-product-icon" />
                        {item.name}
                      </Link>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  to="/"
                  className="nav__mobile-link"
                >
                  <HomeIcon className="nav__mobile-link-icon" />
                  Home
                </Link>
              </div>

              <div className="nav__mobile-bottom-section">
                <Link
                  to="/cart"
                  className="nav__mobile-cart-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCartIcon className="nav__mobile-cart-icon" />
                  Cart ({cartCount})
                </Link>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="nav__mobile-auth-button"
                  >
                    <UserCircleIcon className="nav__mobile-auth-icon" />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="nav__mobile-auth-button"
                  >
                    <UserCircleIcon className="nav__mobile-auth-icon" />
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