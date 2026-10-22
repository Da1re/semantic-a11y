import { isAiConnection, type AiConnection } from '../models/ai-connection';
import { getVaultKey } from './vault-key';

// 탭을 닫으면 지워지도록 sessionStorage를 쓴다. localStorage는 브라우저를 껐다 켜도 남아서 쓰지 않는다
const SESSION_KEY = 'semantic-a11y:ai-connection';

interface SealedConnection {
  v: 1;
  iv: string;
  data: string;
}

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function fromBase64(text: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
}

function readSealed(): SealedConnection | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  const isSealed = typeof parsed === 'object' && parsed !== null && 'iv' in parsed && 'data' in parsed;
  return isSealed ? (parsed as SealedConnection) : null;
}

/** 저장하지 못하면(사생활 보호 창, 저장소 차단) false. 그때는 메모리에만 둔다 */
export async function saveConnection(connection: AiConnection): Promise<boolean> {
  try {
    const key = await getVaultKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plain = new TextEncoder().encode(JSON.stringify(connection));
    const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain);
    const sealed: SealedConnection = { v: 1, iv: toBase64(iv), data: toBase64(data) };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sealed));
    return true;
  } catch {
    return false;
  }
}

async function openSealed(): Promise<AiConnection | null> {
  const sealed = readSealed();
  if (!sealed) return null;
  const key = await getVaultKey();
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(sealed.iv) }, key, fromBase64(sealed.data));
  const parsed: unknown = JSON.parse(new TextDecoder().decode(plain));
  return isAiConnection(parsed) ? parsed : null;
}

export function loadConnection(): Promise<AiConnection | null> {
  return openSealed().catch(() => {
    // 암호화 키가 바뀌었거나 값이 깨졌으면 되살릴 수 없으므로 지운다
    clearConnection();
    return null;
  });
}

export function clearConnection(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // 저장소가 막혀 있으면 지울 것도 없다
  }
}
