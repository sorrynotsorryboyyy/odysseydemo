/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    /**
     * `firebase-admin` est laissé tel quel au lieu d'être recompilé : il
     * charge ses dépendances natives dynamiquement, ce que le regroupement
     * de Next gère mal.
     *
     * À noter : la version est volontairement figée à 13.x. La 14 tire
     * `jwks-rsa@4`, qui charge `jose@6` avec `require()` alors que ce
     * dernier n'expose que des modules ES — fatal en production
     * (« require() of ES Module … not supported »), invisible en local.
     * La 13 utilise `jwks-rsa@3` et `jose@4`, tous deux CommonJS.
     */
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

export default nextConfig;
