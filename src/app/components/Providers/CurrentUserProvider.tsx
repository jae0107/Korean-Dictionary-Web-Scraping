import { useQuery } from "@apollo/client";
import { ReactNode } from "react";
import { CurrentUserContext } from "./Providers";
import { useRouter } from 'next/navigation';
import { gql } from "@/app/generated/gql";

const getMyRoleQuery = gql(`
  query GetMyRole {
    getCurrentUser {
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

  const { data, loading, refetch } = useQuery(getMyRoleQuery, {
    fetchPolicy: 'network-only',
    onError: (e) => {
      e && router.push('/signin');
    },
  });

  const value = {
    // user: data?.getCurrentUser ?? null,
    userRole: data?.getCurrentUser?.role ?? null,
    loading: loading,
    refetch: refetch,
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}