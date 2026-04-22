import type { backendInterface } from "../backend";

export const mockBackend: backendInterface = {
  editInteraction: async (_id, _req) => ({ __kind__: "ok", ok: true }),

  getGroqApiKey: async () => "gsk_mock_key_for_development",

  getHcpNames: async () => [
    "Dr. Priya Sharma",
    "Dr. Arjun Mehta",
    "Dr. Sunita Patel",
    "Dr. Rahul Verma",
    "Dr. Anjali Gupta",
  ],

  getInteractionById: async (_id) => ({
    id: BigInt(1),
    interactionType: "In-Person Visit",
    materialsShared: "Product brochure, clinical trial data",
    hcpName: "Dr. Priya Sharma",
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    sentiment: "positive",
    followUp: "Schedule follow-up call in 2 weeks",
    outcomes: "HCP expressed strong interest in prescribing",
    samples: BigInt(3),
    topics: "Oncology drug efficacy, side effects profile",
    datetime: "2026-04-20T10:30",
  }),

  getInteractions: async () => [
    {
      id: BigInt(1),
      interactionType: "In-Person Visit",
      materialsShared: "Product brochure, clinical trial data",
      hcpName: "Dr. Priya Sharma",
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      sentiment: "positive",
      followUp: "Schedule follow-up call in 2 weeks",
      outcomes: "HCP expressed strong interest in prescribing",
      samples: BigInt(3),
      topics: "Oncology drug efficacy, side effects profile",
      datetime: "2026-04-20T10:30",
    },
    {
      id: BigInt(2),
      interactionType: "Phone Call",
      materialsShared: "Safety data sheet",
      hcpName: "Dr. Arjun Mehta",
      createdAt: BigInt(Date.now() - 86400000) * BigInt(1_000_000),
      sentiment: "neutral",
      followUp: "Send additional literature on dosage",
      outcomes: "Discussed dosage protocol, needs more information",
      samples: BigInt(1),
      topics: "Cardiovascular medication, dosage adjustments",
      datetime: "2026-04-19T14:00",
    },
    {
      id: BigInt(3),
      interactionType: "Conference",
      materialsShared: "Poster presentation",
      hcpName: "Dr. Sunita Patel",
      createdAt: BigInt(Date.now() - 172800000) * BigInt(1_000_000),
      sentiment: "negative",
      followUp: "Address concerns about side effects in next visit",
      outcomes: "HCP raised concerns about adverse events",
      samples: BigInt(0),
      topics: "Respiratory therapy, safety concerns",
      datetime: "2026-04-18T09:00",
    },
  ],

  logInteraction: async (
    _hcpName,
    _interactionType,
    _datetime,
    _topics,
    _materialsShared,
    _samples,
    _sentiment,
    _outcomes,
    _followUp
  ) => BigInt(4),

  processAiChat: async (userMessage, _context) => ({
    tool: "extract_entities",
    message: `I've analyzed your message: "${userMessage}". I can help you log this interaction with Dr. Priya Sharma. The sentiment appears positive based on your description. Would you like me to auto-fill the form fields?`,
    structuredData: JSON.stringify({
      hcpName: "Dr. Priya Sharma",
      interactionType: "In-Person Visit",
      sentiment: "positive",
      topics: userMessage.substring(0, 100),
    }),
  }),

  setGroqApiKey: async (_key) => undefined,

  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
};
