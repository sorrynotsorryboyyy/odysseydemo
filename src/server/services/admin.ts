import { collections, db } from '@/server/lib/firebase';
import type { OrderDocument, OrderStatus } from '@/server/lib/types';

/**
 * Lectures de l'espace d'administration.
 *
 * Firestore facture à la lecture : chaque requête est donc bornée, et les
 * compteurs s'appuient sur `count()` côté serveur plutôt que de rapatrier
 * les documents pour les dénombrer.
 */

export interface AdminStats {
  total: number;
  byStatus: Record<OrderStatus, number>;
  revenueCents: number;
  users: number;
  contactMessages: number;
}

/** Chiffres d'ensemble pour le tableau de bord. */
export async function loadStats(): Promise<AdminStats> {
  const firestore = db();

  const statuses: OrderStatus[] = [
    'pending',
    'generating',
    'ready',
    'printing',
    'shipped',
    'failed',
  ];

  const [ordersCount, usersCount, messagesCount] = await Promise.all([
    firestore.collection(collections.orders).count().get(),
    firestore.collection(collections.users).count().get(),
    firestore.collection(collections.contactMessages).count().get(),
  ]);

  const perStatus = await Promise.all(
    statuses.map(async (status) => {
      const result = await firestore
        .collection(collections.orders)
        .where('status', '==', status)
        .count()
        .get();
      return [status, result.data().count] as const;
    }),
  );

  // Le chiffre d'affaires ne compte que les commandes réellement honorées :
  // une commande en attente n'a pas été payée.
  const billable = await firestore
    .collection(collections.orders)
    .where('status', 'in', ['ready', 'printing', 'shipped'])
    .select('amountCents')
    .get();

  const revenueCents = billable.docs.reduce(
    (sum, doc) => sum + ((doc.data().amountCents as number) ?? 0),
    0,
  );

  return {
    total: ordersCount.data().count,
    byStatus: Object.fromEntries(perStatus) as Record<OrderStatus, number>,
    revenueCents,
    users: usersCount.data().count,
    contactMessages: messagesCount.data().count,
  };
}

export interface OrderListOptions {
  status?: OrderStatus;
  search?: string;
  limit?: number;
}

/** Commandes, filtrées par statut ou recherche sur le prénom de l'enfant. */
export async function listOrders({
  status,
  search,
  limit = 50,
}: OrderListOptions = {}): Promise<OrderDocument[]> {
  const firestore = db();
  let query = firestore.collection(collections.orders).orderBy('createdAt', 'desc');

  if (status) {
    query = firestore
      .collection(collections.orders)
      .where('status', '==', status)
      .orderBy('createdAt', 'desc');
  }

  const snapshot = await query.limit(limit).get();
  const orders = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as OrderDocument,
  );

  if (!search) return orders;

  // Filtrage en mémoire : Firestore ne sait pas faire de recherche partielle,
  // et la liste est déjà bornée à `limit`.
  const needle = search.trim().toLowerCase();
  return orders.filter(
    (order) =>
      order.childFirstName?.toLowerCase().includes(needle) ||
      order.id.toLowerCase().includes(needle),
  );
}

export async function loadOrder(orderId: string): Promise<OrderDocument | null> {
  const snapshot = await db().collection(collections.orders).doc(orderId).get();
  if (!snapshot.exists) return null;
  return { id: snapshot.id, ...snapshot.data() } as OrderDocument;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  orderId?: string;
  subject: string;
  message: string;
  createdAt: string;
  handledAt: string | null;
}

export async function listMessages(limit = 50): Promise<ContactMessage[]> {
  const snapshot = await db()
    .collection(collections.contactMessages)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ContactMessage);
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export async function listUsers(limit = 50): Promise<AdminUser[]> {
  const snapshot = await db().collection(collections.users).limit(limit).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as AdminUser);
}

/** Change le statut d'une commande. */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  await db().collection(collections.orders).doc(orderId).update({
    status,
    updatedAt: new Date().toISOString(),
  });
}

/** Marque un message de contact comme traité. */
export async function markMessageHandled(messageId: string): Promise<void> {
  await db().collection(collections.contactMessages).doc(messageId).update({
    handledAt: new Date().toISOString(),
  });
}
