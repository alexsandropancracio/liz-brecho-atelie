import "./navbar.css";
import { useEffect, useRef, useState } from "react";
import { useGsap } from "../../animations/hooks/useGsap";
import {
  animateNavbar,
  animateMobileMenuOpen,
  animateMobileMenuClose,
} from "./navbar.animation";
import { Menu, X, User, ShoppingBag } from "lucide-react";
import { NavLink } from "react-router-dom";

const MOBILE_BREAKPOINT = 1024;

export function Navbar() {
  const ref = useGsap(animateNavbar);

  const [isOpen, setIsOpen] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleResize() {
      const isDesktop = window.innerWidth > MOBILE_BREAKPOINT;

      if (isDesktop) {
        setIsOpen(false);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const button = menuButtonRef.current;
    const links = linksRef.current;

    if (!overlay || !button) return;

    if (isOpen) {
      animateMobileMenuOpen(overlay, links, button);
    } else {
      animateMobileMenuClose(overlay, links, button);
    }
  }, [isOpen]);

  return (
    <>
      <nav ref={ref} className="navbar">
        <div className="navbar-container">
          <div className="nav-left">
            <NavLink
              to="/brecho"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Brechó
            </NavLink>

            <NavLink
              to="/atelie"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Ateliê
            </NavLink>

            <NavLink
              to="/sobre"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Sobre
            </NavLink>

            <NavLink
              to="/contato"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Contato
            </NavLink>
          </div>

          <NavLink to="/" end className="nav-logo" onClick={closeMenu}>
            — LIZ — 
          </NavLink>

          <div className="nav-right">
            <button className="nav-icon" type="button" aria-label="Perfil">
              <User size={18} />
            </button>

            <button className="nav-icon" type="button" aria-label="Sacola">
              <ShoppingBag size={18} />
            </button>

            <button
              ref={menuButtonRef}
              className="nav-menu"
              type="button"
              onClick={toggleMenu}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <div ref={overlayRef} className="menu-overlay" aria-hidden={!isOpen}>
        <nav className="menu-content">
          {[
            { path: "/brecho", label: "Brechó" },
            { path: "/atelie", label: "Ateliê" },
            { path: "/sobre", label: "Sobre" },
            { path: "/contato", label: "Contato" },
          ].map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              ref={(el) => {
                if (el) linksRef.current[index] = el;
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}