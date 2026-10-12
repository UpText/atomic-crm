import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useDataProvider,
  useGetIdentity,
  useLocaleState,
  useNotify,
  type UserIdentity,
} from "ra-core";
import { hasSqlWebApiUrl } from "../providers/sqlwebapi/runtimeConfig";
import type { CrmDataProvider } from "../providers/types";

/** Apply immediately, persist to the current user's profile, and roll back on failure. */
export const useProfileLanguage = () => {
  const [locale, setLocale] = useLocaleState();
  const { identity } = useGetIdentity();
  const dataProvider = useDataProvider<CrmDataProvider>();
  const queryClient = useQueryClient();
  const notify = useNotify();
  const mutationKey = ["profileLanguage", identity?.id];
  const isPending = useIsMutating({ mutationKey }) > 0;
  const { mutate } = useMutation({
    mutationKey,
    mutationFn: async (language: string) => {
      if (!identity) throw new Error("No authenticated user");
      await dataProvider.salesUpdate(identity.id, { language });
    },
    onMutate: (language) => {
      const previous = locale;
      setLocale(language);
      return { previous, userId: identity?.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
    onError: (_error, _language, context) => {
      const currentIdentity = queryClient.getQueryData<UserIdentity>([
        "auth",
        "getIdentity",
      ]);
      // A save finishing after logout must not change the next user's language.
      if (!context || currentIdentity?.id !== context.userId) return;
      setLocale(context.previous);
      notify("crm.profile.update_error", { type: "error" });
    },
  });
  const isSqlWebApi = hasSqlWebApiUrl();
  return {
    locale,
    setLocale: isSqlWebApi ? mutate : setLocale,
    isPending: isSqlWebApi && (isPending || !identity),
  };
};
