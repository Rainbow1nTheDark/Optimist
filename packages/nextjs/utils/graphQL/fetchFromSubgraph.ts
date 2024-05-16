import axios, { AxiosResponse } from "axios";
import * as dotenv from "dotenv";

dotenv.config();
const ALCHEMY_SUBGRAPH_KEY = process.env.ALCHEMY_SUBGRAPH_API_KEY;
const ENDPOINT_DAPP_RATING_SYSTEM = `https://subgraph.satsuma-prod.com/${ALCHEMY_SUBGRAPH_KEY}/alexanders-team--782474/DappRatingSystem/version/v0.0.1-new-version/api`;
//const ENDPOINT_DAPP_RATER_SCHEMA_RESOLVER = `https://subgraph.satsuma-prod.com/${ALCHEMY_SUBGRAPH_KEY}/alexanders-team--782474/DappRaterSchemaResolver/api`;
// Define a TypeScript type for the function parameters

interface GraphQLRequestConfig {
  endpoint: string;
  query: string;
}

// Define a generic TypeScript type for the response data
export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

// Generic function to execute GraphQL queries
async function fetchGraphQL<T>(config: GraphQLRequestConfig): Promise<GraphQLResponse<T> | null> {
  try {
    const response: AxiosResponse<GraphQLResponse<T>> = await axios.post(
      config.endpoint,
      JSON.stringify({ query: config.query }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log("GraphQL Error: ${error}");
  }
  return null;
}
// Usage example with specific type for the response data
export type DappRegistered = {
  id: string;
  dappId: string;
  description: string;
  name: string;
  url: string;
  averageRating?: number;
};

export type DappRating = {
  id: string;
  attestationId: string;
  dappId: string;
  starRating: number;
  reviewText: string;
};

export async function fetchGraphQLRegisteredDapps(): Promise<GraphQLResponse<{
  dappRegistereds: DappRegistered[];
}> | null> {
  try {
    const query = `{ dappRegistereds { id, dappId, description, name, url } }`;
    const endpoint = ENDPOINT_DAPP_RATING_SYSTEM;
    return await fetchGraphQL<{ dappRegistereds: DappRegistered[] }>({ endpoint, query });
  } catch (error) {
    console.log("GraphQL Error: ${error}");
  }
  return null;
}

export async function fetchGraphQLRegisteredDappByID(
  id: string | null,
): Promise<GraphQLResponse<{ dappRegistered: DappRegistered }> | null> {
  try {
    if (id == null) {
      throw Error("Dapp ID is undefined");
    }

    const query = `{ dappRegistered(id:"${id}") { id, dappId, description, name, url } }`;
    console.log(query);
    const endpoint = ENDPOINT_DAPP_RATING_SYSTEM;
    return await fetchGraphQL<{ dappRegistered: DappRegistered }>({ endpoint, query });
  } catch (error) {
    console.log(`GraphQL Error: ${error}`);
  }
  return null;
}

export async function fetchDappRatings(): Promise<GraphQLResponse<{
  dappRatingSubmitteds: DappRating[];
}> | null> {
  try {
    const query = `{ dappRatingSubmitteds {id, attestationId, dappId, starRating, reviewText}}`;
    const endpoint = ENDPOINT_DAPP_RATING_SYSTEM;
    return await fetchGraphQL<{ dappRatingSubmitteds: DappRating[] }>({ endpoint, query });
  } catch (error) {
    console.log("GraphQL Error: ${error}");
  }
  return null;
}

export async function fetchAttestationsByWallet(): Promise<GraphQLResponse<{
  dappRatingSubmitteds: DappRating[];
}> | null> {
  try {
    const query = `{ dappRatingSubmitteds {id, attestationId, dappId, starRating, reviewText}}`;
    const endpoint = ENDPOINT_DAPP_RATING_SYSTEM;
    return await fetchGraphQL<{ dappRatingSubmitteds: DappRating[] }>({ endpoint, query });
  } catch (error) {
    console.log("GraphQL Error: ${error}");
  }
  return null;
}
