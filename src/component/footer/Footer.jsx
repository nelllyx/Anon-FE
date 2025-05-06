import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-yellow-500 text-lg font-bold uppercase">About Us</h3>
            <hr className="border-gray-400 border-t-1 mb-4" />
            <p className="text-gray-700 text-sm leading-relaxed">
              Providing accessible mental health support and professional therapy services to help you on your journey to better mental wellness.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-500 text-lg font-bold uppercase mb-4">Quick Links</h3>
            <hr className="border-gray-400 border-t-1 mb-4" />
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-yellow-500 transition-colors">Anonymous Therapy</a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-yellow-500 transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-yellow-500 transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-yellow-500 transition-colors">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-yellow-500 text-lg font-bold uppercase mb-4">Get Started</h3>
            <hr className="border-gray-400 border-t-1 mb-4" />
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-yellow-500 transition-colors">Therapy</a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-yellow-500 transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-yellow-500 transition-colors">Payment</a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-yellow-500 transition-colors">Your Account</a>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-yellow-500 text-lg font-bold uppercase mb-4">Let Us Help</h3>
            <hr className="border-gray-400 border-t-1 mb-4" />
            <ul className="space-y-2">
              <li className="text-gray-700">24/7 Online Support</li>
              <li>
                <a href="#" className="text-gray-700 hover:text-yellow-500 transition-colors">Help Center</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Anonymous Therapy. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-yellow-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-yellow-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 hover:text-yellow-500 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;