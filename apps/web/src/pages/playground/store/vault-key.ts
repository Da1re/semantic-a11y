const STORE_NAME = 'keys';

function toPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDb(): Promise<IDBDatabase> {
  const request = indexedDB.open('semantic-a11y-vault', 1);
  request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
  return toPromise(request);
}

async function readKey(db: IDBDatabase): Promise<CryptoKey | undefined> {
  const stored: unknown = await toPromise(db.transaction(STORE_NAME).objectStore(STORE_NAME).get('ai-connection'));
  return stored instanceof CryptoKey ? stored : undefined;
}

// 암호화 키는 추출 불가(extractable: false)로 만들어 IndexedDB에 둔다. 스크립트가 키 값 자체를 꺼내 갈 수는 없고,
// 암호문(sessionStorage)과 키(IndexedDB)가 따로 있어서 저장소 한쪽만 복사해서는 API 키를 되살릴 수 없다
async function readOrCreateKey(db: IDBDatabase): Promise<CryptoKey> {
  const existing = await readKey(db);
  if (existing) return existing;
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  await toPromise(db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(key, 'ai-connection'));
  return key;
}

export async function getVaultKey(): Promise<CryptoKey> {
  const db = await openDb();
  try {
    return await readOrCreateKey(db);
  } finally {
    db.close();
  }
}
