"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useWriteContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { DappRegistered, fetchGraphQLRegisteredDappByID } from "~~/utils/graphQL/fetchFromSubgraph";

const RateDapp = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: hash, isPending, writeContract } = useWriteContract();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [dappDetails, setDappDetails] = useState<DappRegistered | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchGraphQLRegisteredDappByID(id);
        if (result && result.data && result.data.dappRegistered) {
          console.log(result);
          setDappDetails(result.data.dappRegistered);
          setError("");
        } else {
          setError("No data returned");
        }
      } catch (err) {
        setError(`An error occurred while fetching data: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  async function submitReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(`${comment} ${rating}`);
    if (dappDetails?.dappId) {
      writeContract({
        address: deployedContracts[11155420].DappRatingSystem.address,
        abi: deployedContracts[11155420].DappRatingSystem.abi,
        functionName: "addDappRating",
        args: [dappDetails.dappId, rating, comment],
      });
    } else {
      console.log(`Wrong ID: ${id}`);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <form onSubmit={submitReview} className="flex flex-col items-center pt-10 w-full">
      <div className="space-y-4 w-full max-w-md">
        {dappDetails ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              Review{" "}
              <a
                href={dappDetails.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:underline"
              >
                {dappDetails.name.charAt(0).toUpperCase() + dappDetails.name.slice(1)}
              </a>
            </h1>
            <p className="mb-4">{dappDetails.description}</p>
          </div>
        ) : (
          <p>DApp details not found.</p>
        )}

        {/* Star Rating Input */}
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setRating(index + 1)}
              className={`h-16 w-16 rounded-full text-3xl leading-none ${
                rating > index ? "text-white-500 bg-white" : "text-black-400 bg-white"
              }`}
              style={{ color: rating > index ? "red" : "", backgroundColor: "white" }}
            >
              ★
            </button>
          ))}
        </div>

        {/* Optional Comment */}
        <div className="flex flex-col w-full">
          <label htmlFor="comment" className="block mb-2">
            Comment (optional):
          </label>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 focus:outline-none focus:border-red-500"
            placeholder="Add your comment here..."
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={isPending}
          type="submit"
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2.5 px-4"
        >
          {isPending ? "Sending..." : "Submit Review"}
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
      </div>
    </form>
  );
};

export default RateDapp;
