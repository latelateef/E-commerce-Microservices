import { Card, CardTitle, CardDescription } from "@/components/ui/product-card";
// import { useEffect, useState } from 'react';
// import axios from 'axios';
import { cn } from "@/lib/utils";
import { HashLink as Link } from "react-router-hash-link";


// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   stock: number;
// };

export default function Products() {
  // const [projects, setProjects] = useState<Product[]>([]);

  // useEffect(() => {
  //   axios.get('http://localhost:8000/api/products/products')
  //   .then(res => setProjects(res.data))
  //   .catch(err => console.error(err));
  // }, []);

  // if (projects.length === 0) {
  //   return (
  //     <div className="max-w-8xl mx-auto px-8 py-10">
  //       <h1 className="text-center text-2xl text-white">Loading...</h1>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-8xl mx-auto px-8">
      <ProductCard items={projects} />
    </div>
  );
}

export const projects = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "https://meta.com",
  },
  {
    title: "Amazon",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    link: "https://amazon.com",
  },
  {
    title: "Microsoft",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    link: "https://microsoft.com",
  },
];


export const ProductCard = ({ items } ) => {

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4 py-10"
      )}
    >
      {items.map((item) => (
        <Link
          to={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
        >
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
};

