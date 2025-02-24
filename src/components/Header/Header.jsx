import React, { useState } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'  // For responsive menu icons

function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const navItems = [
        { name: 'Home', slug: "/", active: true },
        { name: "Login", slug: "/login", active: !authStatus },
        { name: "Signup", slug: "/signup", active: !authStatus },
        { name: "All Posts", slug: "/all-posts", active: authStatus },
        { name: "Add Post", slug: "/add-post", active: authStatus },
    ]

    return (
        <header className="bg-gray-900 text-white shadow-md">
            <Container>
                <nav className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/">
                            <Logo width="80px" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) =>
                            item.active ? (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.slug)}
                                        className="px-4 py-2 rounded-full bg-transparent hover:bg-blue-500 hover:text-white transition duration-300"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}
                        {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                {menuOpen && (
                    <ul className="md:hidden flex flex-col items-center bg-gray-800 text-white py-4">
                        {navItems.map((item) =>
                            item.active ? (
                                <li key={item.name} className="w-full text-center">
                                    <button
                                        onClick={() => {
                                            navigate(item.slug);
                                            setMenuOpen(false);
                                        }}
                                        className="block w-full px-4 py-2 text-lg hover:bg-blue-500 transition"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}
                        {authStatus && (
                            <li className="w-full text-center">
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>
                )}
            </Container>
        </header>
    )
}

export default Header
