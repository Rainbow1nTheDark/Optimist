"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useWriteContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

const RegisterProject: NextPage = () => {
  const { data: hash, isPending, writeContract } = useWriteContract();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    parsedUrl: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    const parseUrl = (url: string | URL) => {
      try {
        const newUrl = new URL(url);
        let hostname = newUrl.hostname.replace("www.", "");
        hostname = hostname.substring(0, hostname.lastIndexOf("."));
        return hostname;
      } catch (error) {
        console.error("Invalid URL", error);
        return "";
      }
    };

    if (name === "url") {
      const parsed = parseUrl(value);
      setFormData(prev => ({
        ...prev,
        parsedUrl: parsed,
      }));
    }
  };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string;

    writeContract({
      address: deployedContracts[11155420].DappRatingSystem.address,
      abi: deployedContracts[11155420].DappRatingSystem.abi,
      functionName: "registerDapp",
      args: [name, description, url],
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col items-center pt-10 w-full">
      <div className="space-y-4 w-full max-w-md">
        {" "}
        {/* max-w-md or another appropriate width can be adjusted to fit your design */}
        <div className="flex flex-col">
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-300 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="block mb-2">Website:</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-300 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="block mb-2">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-300 focus:outline-none focus:border-red-500"
          />
        </div>
        <button
          disabled={isPending}
          type="submit"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2.5 px-4 mt-4"
        >
          {isPending ? "Confirming..." : "Register"}
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
      </div>
    </form>
  );
};
export default RegisterProject;
