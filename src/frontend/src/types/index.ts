export interface InteractionRecord {
  id: bigint;
  hcpName: string;
  interactionType: string;
  datetime: string;
  topics: string;
  materialsShared: string;
  samples: bigint;
  sentiment: string;
  outcomes: string;
  followUp: string;
  createdAt: bigint;
}

export interface UpdateInteractionRequest {
  hcpName?: string;
  interactionType?: string;
  datetime?: string;
  topics?: string;
  materialsShared?: string;
  samples?: bigint;
  sentiment?: string;
  outcomes?: string;
  followUp?: string;
}

export interface AiChatResponse {
  tool: string;
  structuredData: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

export interface ExtractedData {
  hcpName?: string;
  interactionType?: string;
  date?: string;
  topics?: string;
  materials?: string;
  samples?: string;
  sentiment?: string;
  outcomes?: string;
  followUp?: string;
}
