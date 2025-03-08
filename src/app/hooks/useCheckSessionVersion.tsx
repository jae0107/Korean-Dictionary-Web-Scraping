import { useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import { gql } from "../generated/gql";
import { useLazyQuery } from "@apollo/client";

const getMySessionVersionQuery = gql(`
  query GetUser($getUserId: ID!) {
    getUser(id: $getUserId) {
      sessionVersion
    }
  }
`);

export function useCheckSessionVersion() {
  const [getWordByTitle] = useLazyQuery(getMySessionVersionQuery);
  
  useEffect(() => {
    async function fetchData() {
      const session = await getSession();
      if (!session) return;

      const res = await getWordByTitle({ 
        variables: { 
          getUserId: session.user.id
        } 
      });
      
      if (!res.loading && res.data?.getUser?.sessionVersion !== session.user.sessionVersion) {
        signOut(); 
      }
    }

    fetchData();
  }, []);
}
