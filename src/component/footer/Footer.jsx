import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h3 className="text-white text-xl font-bold">Anonymous Therapy</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Providing accessible mental health support and professional therapy services to help you on your journey to better mental wellness.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Online Therapy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Teen Counseling
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Group Sessions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Career Counseling
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Mental Health Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaPhone className="w-5 h-5 text-blue-500 mt-1" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <FaEnvelope className="w-5 h-5 text-blue-500 mt-1" />
                <span className="text-gray-400">support@anonymoustherapy.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-500 mt-1" />
                <span className="text-gray-400">123 Therapy Street, Mental Health City, MH 12345</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Anonymous Therapy. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-blue-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-500 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;