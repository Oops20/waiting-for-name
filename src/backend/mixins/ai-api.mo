import Text "mo:core/Text";
import List "mo:core/List";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/interactions";
import AiLib "../lib/ai";

mixin (groqApiKeyRef : List.List<Text>) {
  let GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
  // Primary model: gemma2-9b-it  Fallback: llama-3.3-70b-versatile
  let GROQ_MODEL = "gemma2-9b-it";

  func getKey() : Text {
    if (groqApiKeyRef.size() == 0) "" else groqApiKeyRef.at(0);
  };

  /// Transform callback required by the IC HTTP outcall mechanism.
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Process AI chat message, route to one of 5 AI tools via Groq API.
  public shared func processAiChat(
    userMessage : Text,
    interactionContext : ?Text,
  ) : async Types.AiChatResponse {
    let toolName = AiLib.routeTool(userMessage);
    let systemPrompt = AiLib.getSystemPrompt(toolName);
    let context = switch (interactionContext) { case (?c) c; case null "" };
    let requestBody = AiLib.buildRequestBody(GROQ_MODEL, systemPrompt, userMessage, context, toolName);
    let apiKey = getKey();
    let authHeader : OutCall.Header = {
      name = "Authorization";
      value = "Bearer " # apiKey;
    };
    let contentTypeHeader : OutCall.Header = {
      name = "Content-Type";
      value = "application/json";
    };
    let rawResponse = await OutCall.httpPostRequest(GROQ_URL, [authHeader, contentTypeHeader], requestBody, transform);
    let content = AiLib.parseGroqResponse(rawResponse);
    let friendlyMessage = AiLib.buildFriendlyMessage(toolName, content);
    {
      tool = toolName;
      structuredData = content;
      message = friendlyMessage;
    };
  };

  /// Set the Groq API key.
  public shared func setGroqApiKey(key : Text) : async () {
    if (groqApiKeyRef.size() == 0) {
      groqApiKeyRef.add(key);
    } else {
      groqApiKeyRef.mapInPlace(func(_old) { key });
    };
  };

  /// Return masked API key for display (first 4 + "..." + last 4), or "not set".
  public query func getGroqApiKey() : async Text {
    let apiKey = getKey();
    if (apiKey == "") {
      "not set"
    } else {
      let len = apiKey.size();
      if (len <= 8) {
        "****"
      } else {
        // Extract first 4 chars
        let prefix = Text.fromIter(apiKey.toIter().take(4));
        // Extract last 4 chars by dropping (len - 4)
        let suffix = Text.fromIter(apiKey.toIter().drop(len - 4 : Nat));
        prefix # "..." # suffix
      };
    };
  };
};
