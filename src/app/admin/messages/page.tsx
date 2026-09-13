import { Badge, Card } from '@/components/ui';
import { listMessages } from '@/server/services/admin';

export const dynamic = 'force-dynamic';

export default async function AdminMessages() {
  const messages = await listMessages();
  const pending = messages.filter((message) => !message.handledAt).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Messages</h1>
        <p className="mt-2 text-ink-muted">
          {pending} message{pending > 1 ? 's' : ''} en attente sur {messages.length}.
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <p className="text-ink-muted">Aucun message reçu.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={message.handledAt ? 'opacity-70' : ''}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">
                    {message.subject}
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    {message.name} · {message.email}
                    {message.orderId ? ` · commande ${message.orderId}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {message.handledAt ? (
                    <Badge tone="neutral">Traité</Badge>
                  ) : (
                    <Badge tone="warm">À traiter</Badge>
                  )}
                  <span className="text-sm tabular-nums text-ink-soft">
                    {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <p className="mt-4 border-l-2 border-warm-100 pl-4 text-sm text-ink-muted text-pretty">
                {message.message}
              </p>

              <div className="mt-4">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(`Re : ${message.subject}`)}`}
                  className="text-sm font-semibold text-warm-700 hover:underline"
                >
                  Répondre par e-mail
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
