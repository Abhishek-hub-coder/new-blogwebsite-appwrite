import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
    return (
        <section className="relative overflow-hidden py-10 bg-gray-900 text-white">
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="flex flex-wrap justify-between">
                   
                    <div className="w-full p-6 md:w-1/3">
                        <div className="flex flex-col">
                            <div className="mb-4 inline-flex items-center">
                                <Logo width="100px" />
                            </div>
                            <p className="text-sm text-gray-400">
                                &copy; {new Date().getFullYear()} All Rights Reserved by DevUI.
                            </p>
                        </div>
                    </div>

                  
                    <div className="w-full p-6 md:w-1/3 grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4">Company</h3>
                            <ul>
                                <li><Link className="text-gray-300 hover:text-white" to="/">Features</Link></li>
                                <li><Link className="text-gray-300 hover:text-white" to="/">Pricing</Link></li>
                                <li><Link className="text-gray-300 hover:text-white" to="/">Affiliate</Link></li>
                                <li><Link className="text-gray-300 hover:text-white" to="/">Press Kit</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4">Support</h3>
                            <ul>
                                <li><Link className="text-gray-300 hover:text-white" to="/">Account</Link></li>
                                <li><Link className="text-gray-300 hover:text-white" to="/">Help</Link></li>
                                <li><Link className="text-gray-300 hover:text-white" to="/">Contact Us</Link></li>
                                <li><Link className="text-gray-300 hover:text-white" to="/">Customer Support</Link></li>
                            </ul>
                        </div>
                    </div>

                   
                    <div className="w-full p-6 md:w-1/3">
                        <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4">Stay Updated</h3>
                        <form className="flex">
                            <input type="email" placeholder="Your email" className="p-2 w-full text-black rounded-l-md" />
                            <button className="p-2 bg-blue-1000 text-white rounded-r-md">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Footer;
