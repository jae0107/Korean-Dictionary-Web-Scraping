import { useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import { gql } from "../generated/gql";
import { useLazyQuery } from "@apollo/client";
import { useSnackbar } from "./useSnackbar";

const getMySessionVersionQuery = gql(`
  query GetUser($getUserId: ID!) {
    getUser(id: $getUserId) {
      sessionVersion
    }
  }
`);

export function useCheckSessionVersion(checkTestMode = false) {
  const [getMySessionVersion] = useLazyQuery(getMySessionVersionQuery);
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  useEffect(() => {
    async function fetchData() {
      const session = await getSession();
      if (!session) return;
      
      const res = await getMySessionVersion({ 
        variables: { 
          getUserId: session.user.id
        } 
      });

      if (checkTestMode && session.user.isInTestMode) {
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: '테스트 중엔 검색을 할 수 없습니다.',
          },
        });
        signOut();
      } else if (!res.loading && res.data?.getUser?.sessionVersion !== session.user.sessionVersion) {
        signOut(); 
      }
    }

    fetchData();
  }, []);
}
