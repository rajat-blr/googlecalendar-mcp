import { getAuthClient } from './auth';
import { createEvent, listEvents } from './calendar';

async function main() {
  const auth = await getAuthClient();
  await createEvent(auth);
  await listEvents(auth);
}

main().catch(console.error);
