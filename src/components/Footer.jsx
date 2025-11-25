import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand & Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <span className="font-bold text-lg tracking-tighter">BK</span>
              </div>
              <span className="text-xl font-extrabold text-gray-900">
                Bio<span className="text-indigo-600">Keeper</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Create professional, beautiful biodatas in seconds. 
              Secure, simple, and designed.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/dashboard" className="hover:text-indigo-600 transition">Dashboard</Link></li>
              <li><Link to="/create" className="hover:text-indigo-600 transition">Create Biodata</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-600 transition">My Account</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Help Center</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter / Contact */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Stay Connected</h3>
            <div className="flex space-x-4 mb-4">
              <SocialIcon icon={<Github size={20} />} href="https://www.github.com/imadhurgupta" />
              <SocialIcon icon={<Twitter size={20} />} href="https://www.twitter.com/xmadhurgupta" />
              <SocialIcon icon={<Linkedin size={20} />} href="https://www.linkedin.com/in/imadhurgupta" />
            </div>
            <a 
              href="mailto:support@biokpx.com" 
              className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:underline"
            >
              <Mail size={16} /> madhurguptaofficial@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} BioKeeper. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-current" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper component for social icons
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-indigo-600 hover:text-white transition duration-300"
  >
    {icon}
  </a>
);

export default Footer;