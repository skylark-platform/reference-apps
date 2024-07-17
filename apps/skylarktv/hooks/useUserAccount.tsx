import { skylarkRequestWithLocalStorage } from "@skylark-reference-apps/react";
import { useQuery } from "@tanstack/react-query";

import { GET_USER } from "../graphql/queries";
import { SkylarkApiPermission, UserDetails } from "../types";

const select = (data: {
  getUser: UserDetails;
}): UserDetails & { permissions: SkylarkApiPermission[] } => ({
  account: data.getUser.account,
  permissions: (data.getUser.permissions || []) as SkylarkApiPermission[],
  role: data.getUser.role,
});

export const useUser = () => {
  const { data, isLoading } = useQuery<
    { getUser: UserDetails },
    unknown,
    Omit<UserDetails, "permissions"> & { permissions: SkylarkApiPermission[] }
  >({
    queryKey: ["UserAccount"],
    queryFn: () => skylarkRequestWithLocalStorage(GET_USER, {}, {}),
    select,
  });

  return {
    ...data,
    isLoading,
  };
};
