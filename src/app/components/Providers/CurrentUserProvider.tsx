import { useQuery } from "@apollo/client";
import { ReactNode } from "react";
import { CurrentUserContext } from "./Providers";
import { usePathname, useRouter } from 'next/navigation';
import { gql } from "@/app/generated/gql";

const getMyRoleQuery = gql(`
  query GetMyRole {
    getCurrentUser {
      id
      role
    }
  }
`);

export function CurrentUserProvider({ 
  children 
} : {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, loading, refetch, networkStatus } = useQuery(getMyRoleQuery, {
    fetchPolicy: 'network-only',
    onError: (e) => {
      if (e && pathname !== '/signup') {
        router.push('/signin');
      }
    },
    notifyOnNetworkStatusChange: true,
  });
  
  const value = {
    myId: data?.getCurrentUser?.id ?? null,
    myRole: data?.getCurrentUser?.role ?? null,
    loading: loading,
    refetch: refetch,
    networkStatus: networkStatus
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}