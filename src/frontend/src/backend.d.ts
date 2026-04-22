import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Result = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export interface AiChatResponse {
    tool: string;
    message: string;
    structuredData: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface UpdateInteractionRequest {
    interactionType?: string;
    materialsShared?: string;
    hcpName?: string;
    sentiment?: string;
    followUp?: string;
    outcomes?: string;
    samples?: bigint;
    topics?: string;
    datetime?: string;
}
export interface InteractionRecord {
    id: bigint;
    interactionType: string;
    materialsShared: string;
    hcpName: string;
    createdAt: Timestamp;
    sentiment: string;
    followUp: string;
    outcomes: string;
    samples: bigint;
    topics: string;
    datetime: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    editInteraction(id: bigint, req: UpdateInteractionRequest): Promise<Result>;
    getGroqApiKey(): Promise<string>;
    getHcpNames(): Promise<Array<string>>;
    getInteractionById(id: bigint): Promise<InteractionRecord | null>;
    getInteractions(): Promise<Array<InteractionRecord>>;
    logInteraction(hcpName: string, interactionType: string, datetime: string, topics: string, materialsShared: string, samples: bigint, sentiment: string, outcomes: string, followUp: string): Promise<bigint>;
    processAiChat(userMessage: string, interactionContext: string | null): Promise<AiChatResponse>;
    setGroqApiKey(key: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
