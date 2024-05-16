// "use client";

// import React, { useEffect, useState } from 'react';
// import { fetchAttestationsByWallet, decodeData } from '~~/utils/api'; // Placeholder for actual imports
// import { useAccount } from "wagmi";

// const MyAttester = () => {
//     const { address, isConnected } = useAccount();
//     const [attestations, setAttestations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetchAttestationsByWallet(address);
//                 if (response.data) {
//                     const decodedData = response.data.attestations.map(attestation => ({
//                         ...attestation,
//                         decodedData: decodeAttestationData(attestation.data)
//                     }));
//                     setAttestations(decodedData);
//                 } else {
//                     setError("No data found");
//                 }
//             } catch (error) {
//                 setError("Failed to fetch data");
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [address]);

//     return (
//         <div>
//             {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
//                 <ul>
//                     {attestations.map(attestation => (
//                         <li key={attestation.id}>
//                             <p>Project ID: {attestation.decodedData.appId}</p>
//                             <p>Star Rating: {attestation.decodedData.starRating}</p>
//                             <p>Review Text: {attestation.decodedData.reviewText}</p>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default MyAttester;
