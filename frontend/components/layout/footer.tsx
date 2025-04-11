export default function Footer() {
  return (
    <footer id="about" className="border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CEC</h3>
            <p className="text-gray-400 text-sm">
              Minimalist ecommerce for the modern individual.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white hover:cursor-pointer">All Products</li>
              <li className="hover:text-white hover:cursor-pointer">New Arrivals</li>
              <li className="hover:text-white hover:cursor-pointer">Best Sellers</li>
              <li className="hover:text-white hover:cursor-pointer">Sale</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white hover:cursor-pointer">About Us</li>
              <li className="hover:text-white hover:cursor-pointer">Sustainability</li>
              <li className="hover:text-white hover:cursor-pointer">Careers</li>
              <li className="hover:text-white hover:cursor-pointer">Press</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white hover:cursor-pointer">Contact Us</li>
              <li className="hover:text-white hover:cursor-pointer">Shipping & Returns</li>
              <li className="hover:text-white hover:cursor-pointer">FAQ</li>
              <li className="hover:text-white hover:cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} CEC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
