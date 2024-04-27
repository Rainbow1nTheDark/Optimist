import axios, { AxiosResponse } from "axios";

const endpoint =
  "https://subgraph.satsuma-prod.com/8913ac6ee1bc/alexanders-team--782474/DappRatingSystem/version/v0.0.1-new-version/api";
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
};

export async function fetchGraphQLRegisteredDapps(): Promise<GraphQLResponse<{
  dappRegistereds: DappRegistered[];
}> | null> {
  try {
    const query = `{ dappRegistereds { id, dappId, description, name, url } }`;
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
    return await fetchGraphQL<{ dappRegistered: DappRegistered }>({ endpoint, query });
  } catch (error) {
    console.log(`GraphQL Error: ${error}`);
  }
  return null;
}
