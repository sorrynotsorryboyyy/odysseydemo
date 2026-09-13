/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    /**
     * `firebase-admin` est laissé tel quel au lieu d'être recompilé.
     *
     * Une de ses dépendances, `jwks-rsa`, charge `jose` avec `require()`
     * alors que `jose@6` n'expose que des modules ES. Le regroupement opéré
     * par Next pour les fonctions serverless rend ce conflit fatal :
     *   « require() of ES Module … not supported »
     *
     * Déclarer le paquet comme externe le laisse résoudre ses propres
     * dépendances à l'exécution, ce qui évite le conflit. L'erreur
     * n'apparaît qu'en déploiement, jamais en développement local.
     */
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

export default nextConfig;
