import { getCategories } from './categoriesService';
import { getContactMessages } from './messagesService';
import { getParts } from './partsService';
import { getPartRequests } from './requestsService';

export async function getDashboardSnapshot() {
  const [parts, requests, messages, categories] = await Promise.all([
    getParts(),
    getPartRequests(),
    getContactMessages(),
    getCategories(),
  ]);

  return { parts, requests, messages, categories };
}
