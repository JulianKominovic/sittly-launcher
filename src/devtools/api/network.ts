import { fetch, ResponseType } from "@tauri-apps/api/http";
/**
 *Perform an HTTP request using the default client.

@example
 import { fetch } from '@tauri-apps/api/http';
    const response = await fetch('http://localhost:3003/users/2', {
    method: 'GET',
    timeout: 30,
    });
 */
const powerfulFetch = fetch;
export { powerfulFetch, ResponseType };
