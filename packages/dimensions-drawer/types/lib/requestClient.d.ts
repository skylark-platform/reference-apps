import { RequestDocument, Variables } from "graphql-request";
export declare const skylarkRequest: <T>({ uri, token, query, variables, }: {
    uri: string;
    token: string;
    query: RequestDocument | string;
    variables?: Variables | undefined;
}) => Promise<T>;
