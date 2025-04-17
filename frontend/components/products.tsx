import { Card, CardTitle, CardDescription, CardPrice } from "@/components/product-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { getAllProducts } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

const mockProducts: Product[] = [
  { id: '67f6c173e4c28516e2cb740f', name: 'Bottle', price: 199.0, stock: 148 },
  { id: '67f6c1a3e4c28516e2cb7410', name: 'Handwash', price: 60.0, stock: 100 },
  { id: '67f6c1bce4c28516e2cb7411', name: 'Watch', price: 1999.0, stock: 49 },
  { id: '67f6c1dae4c28516e2cb7412', name: 'Earbuds', price: 1499.0, stock: 70 },
];

export default function Products() {

  // State to hold products, loading status, and errors
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the backend when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetched = await getAllProducts();
        setProducts(fetched); // Update state with fetched products
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products'); // Capture any errors
        setProducts(mockProducts); // Fallback to mock data
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchProducts(); // Call the fetch function

  }, []); // Empty dependency array means this runs once on mount

  // Conditional rendering based on loading and error states
  if (loading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  // if (error) {
  //   return <div className="flex items-center justify-center text-red-900">Internal Server Error: Failed to fetch products.</div>;
  // }

  return (
    <div className="max-w-8xl mx-auto px-8" id="products">
      <ProductCard items={products} />
    </div>
  );
}


export const ProductCard = ({ items }: any ) => {

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4 py-10"
      )}
    >
      {items.map((item: any) => (
        <Link
          href="/"
          // key={item?.link}
          className="group block p-2 h-full w-full"
        >
          <Card>
            <CardTitle>{item.name}</CardTitle>
            <CardPrice>{item.price}</CardPrice>
            <CardDescription>{item.stock}</CardDescription>
            <Button variant="secondary" className="w-full mt-4">
              Add to Cart
            </Button>
          </Card>
        </Link>
      ))}
    </div>
  );
};

