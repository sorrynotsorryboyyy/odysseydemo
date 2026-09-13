import { Badge, Card } from '@/components/ui';
import { listUsers } from '@/server/services/admin';

export const dynamic = 'force-dynamic';

export default async function AdminUsers() {
  const users = await listUsers();
  const admins = users.filter((user) => user.role === 'admin').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Comptes</h1>
        <p className="mt-2 text-ink-muted">
          {users.length} compte{users.length > 1 ? 's' : ''}, dont {admins} administrateur
          {admins > 1 ? 's' : ''}.
        </p>
      </div>

      <Card className="border-accent-700/30 bg-accent-50">
        <h2 className="font-display text-base font-bold text-ink">
          Attribuer le rôle administrateur
        </h2>
        <p className="mt-2 text-sm text-ink-muted text-pretty">
          Le rôle se change en ligne de commande, jamais depuis cette page : une
          promotion accessible par le web serait une porte de plus à défendre.
        </p>
        <pre className="mt-3 overflow-x-auto border-2 border-ink bg-white px-4 py-3 font-mono text-xs text-ink">
{`npm run admin -- adresse@exemple.fr
npm run admin -- adresse@exemple.fr --revoke
npm run admin -- --list`}
        </pre>
      </Card>

      <div className="overflow-x-auto border-2 border-ink bg-white">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <thead className="border-b border-ink/15 bg-cream-50">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold text-ink">Adresse</th>
              <th scope="col" className="px-4 py-3 font-bold text-ink">Rôle</th>
              <th scope="col" className="px-4 py-3 font-bold text-ink">Inscription</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-ink/10 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{user.email}</td>
                <td className="px-4 py-3">
                  {user.role === 'admin' ? (
                    <Badge tone="accent">Administrateur</Badge>
                  ) : (
                    <span className="text-ink-soft">Client</span>
                  )}
                </td>
                <td className="px-4 py-3 tabular-nums text-ink-soft">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
