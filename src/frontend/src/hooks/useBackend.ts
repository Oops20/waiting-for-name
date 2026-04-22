import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { AiChatResponse, InteractionRecord } from "../types";

export function useGetInteractions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InteractionRecord[]>({
    queryKey: ["interactions"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getInteractions();
      return result as InteractionRecord[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetHcpNames() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<string[]>({
    queryKey: ["hcpNames"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHcpNames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInteractionById(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InteractionRecord | null>({
    queryKey: ["interaction", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getInteractionById(id) as Promise<InteractionRecord | null>;
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useMutateLogInteraction() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    bigint,
    Error,
    {
      hcpName: string;
      interactionType: string;
      datetime: string;
      topics: string;
      materialsShared: string;
      samples: bigint;
      sentiment: string;
      outcomes: string;
      followUp: string;
    }
  >({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logInteraction(
        params.hcpName,
        params.interactionType,
        params.datetime,
        params.topics,
        params.materialsShared,
        params.samples,
        params.sentiment,
        params.outcomes,
        params.followUp,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
      queryClient.invalidateQueries({ queryKey: ["hcpNames"] });
    },
  });
}

export function useMutateEditInteraction() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    { __kind__: "ok"; ok: boolean } | { __kind__: "err"; err: string },
    Error,
    {
      id: bigint;
      req: {
        hcpName?: string;
        interactionType?: string;
        datetime?: string;
        topics?: string;
        materialsShared?: string;
        samples?: bigint;
        sentiment?: string;
        outcomes?: string;
        followUp?: string;
      };
    }
  >({
    mutationFn: async ({ id, req }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.editInteraction(id, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    },
  });
}

export function useProcessAiChat() {
  const { actor } = useActor(createActor);
  return useMutation<
    AiChatResponse,
    Error,
    { userMessage: string; interactionContext?: string | null }
  >({
    mutationFn: async ({ userMessage, interactionContext = null }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.processAiChat(userMessage, interactionContext);
      return result as AiChatResponse;
    },
  });
}
