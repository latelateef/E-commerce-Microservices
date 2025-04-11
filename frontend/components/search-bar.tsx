"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { Button } from "./ui/button";
import Link from "next/link";

export default function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "Water Bottle",
    "Watch",
    "Biscuit",
    "Handwash",
    "Shampoo",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-6">Monochrome</h1>
      <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-8">
        Minimalist ecommerce for the modern individual.
        </p>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      <div className="flex flex-col sm:flex-row gap-4 mt-20">
              <Button asChild size="lg">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-up">Create Account</Link>
              </Button>
        </div>
    </div>
  );
}
