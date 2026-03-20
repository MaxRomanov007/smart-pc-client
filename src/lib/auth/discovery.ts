export interface IOidcDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  revocation_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  end_session_endpoint?: string;
}

let discoveryCache: IOidcDiscovery | null = null;
let discoveryPromise: Promise<IOidcDiscovery> | null = null;

export async function getOidcDiscovery(): Promise<IOidcDiscovery> {
  if (discoveryCache) return discoveryCache;
  if (discoveryPromise) return discoveryPromise;

  const issuer = process.env.NEXT_PUBLIC_OAUTH_ISSUER;
  if (!issuer) {
    throw new Error("NEXT_PUBLIC_OAUTH_ISSUER is not set");
  }

  discoveryPromise = fetch(`${issuer}/.well-known/openid-configuration`, {
    next: { revalidate: 3600 },
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(
          `OIDC discovery failed: ${res.status} ${res.statusText}`,
        );
      }
      const data: IOidcDiscovery = await res.json();
      discoveryCache = data;
      return data;
    })
    .finally(() => {
      discoveryPromise = null;
    });

  return discoveryPromise;
}
