import { env } from "./env";

const BASE_URL = "https://api.pandadoc.com/public/v1";

async function pandadocsFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `API-Key ${env.PANDADOCS_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `PandaDocs API error ${res.status}: ${res.statusText} - ${body}`
    );
  }

  return res.json() as Promise<T>;
}

type CreateDocumentInput = {
  templateId: string;
  name: string;
  recipientEmail: string;
  recipientName: string;
  metadata: Record<string, string>;
  tokens: { name: string; value: string }[];
};

type DocumentResponse = {
  id: string;
  status: string;
  name: string;
};

export async function createDocumentFromTemplate(
  input: CreateDocumentInput
): Promise<DocumentResponse> {
  return pandadocsFetch<DocumentResponse>("/documents", {
    method: "POST",
    body: JSON.stringify({
      template_uuid: input.templateId,
      name: input.name,
      recipients: [
        {
          email: input.recipientEmail,
          first_name: input.recipientName.split(" ")[0] || input.recipientName,
          last_name: input.recipientName.split(" ").slice(1).join(" ") || "",
          role: "Signer",
        },
      ],
      tokens: input.tokens,
      metadata: input.metadata,
    }),
  });
}

export async function getDocumentDetails(
  documentId: string
): Promise<DocumentResponse & { metadata: Record<string, string> }> {
  return pandadocsFetch(`/documents/${documentId}`);
}

export async function sendDocument(documentId: string): Promise<void> {
  await pandadocsFetch(`/documents/${documentId}/send`, {
    method: "POST",
    body: JSON.stringify({
      silent: true,
      subject: "NDA - Harbor Partners",
    }),
  });
}

type SigningSessionResponse = {
  id: string;
  expires_at: string;
};

export async function createSigningSession(
  documentId: string,
  recipientEmail: string
): Promise<SigningSessionResponse> {
  return pandadocsFetch<SigningSessionResponse>(
    `/documents/${documentId}/session`,
    {
      method: "POST",
      body: JSON.stringify({ recipient: recipientEmail }),
    }
  );
}

type ListDocumentsResponse = {
  results: DocumentResponse[];
};

export async function listDocuments(
  query: string
): Promise<DocumentResponse[]> {
  const params = new URLSearchParams({ q: query });
  const data = await pandadocsFetch<ListDocumentsResponse>(
    `/documents?${params.toString()}`
  );
  return data.results;
}

/**
 * Polls until the document leaves "document.uploaded" status (becomes draft),
 * then returns the document. Gives up after maxAttempts.
 */
export async function waitForDocumentDraft(
  documentId: string,
  maxAttempts = 10,
  intervalMs = 1000
): Promise<DocumentResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    const doc = await getDocumentDetails(documentId);
    if (doc.status !== "document.uploaded") {
      return doc;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error("Document did not reach draft status in time");
}

export function getSigningUrl(sessionId: string): string {
  return `https://app.pandadoc.com/s/${sessionId}`;
}
