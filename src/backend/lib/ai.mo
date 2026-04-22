import Text "mo:core/Text";
import Types "../types/interactions";

module {
  public type AiChatResponse = Types.AiChatResponse;

  // Primary model: gemma2-9b-it
  // Fallback note: use llama-3.3-70b-versatile if gemma2-9b-it is unavailable

  /// Build the system prompt for entity extraction tool.
  public func entityExtractionPrompt() : Text {
    "You are an AI assistant that extracts structured data from natural language text about healthcare professional (HCP) interactions for pharma field reps. " #
    "Extract the following fields and return them as a JSON object with exactly these keys: " #
    "hcpName (name of the HCP), interactionType (e.g. in-person visit, phone call, email), " #
    "date (date of interaction), topics (topics discussed), materials (materials shared), " #
    "samples (number of samples given as a number), sentiment (positive/neutral/negative). " #
    "Return ONLY valid JSON, no extra text.";
  };

  /// Build the system prompt for log interaction tool.
  public func logInteractionAiPrompt() : Text {
    "You are an AI assistant helping pharma field reps log HCP interactions. " #
    "Extract all interaction details from the user message and confirm logging with a concise summary. " #
    "Include HCP name, interaction type, date, topics discussed, materials shared, samples given, sentiment, outcomes, and follow-up actions. " #
    "Present the extracted data clearly and confirm it has been logged.";
  };

  /// Build the system prompt for edit interaction tool.
  public func editInteractionAiPrompt() : Text {
    "You are an AI assistant helping pharma field reps edit existing HCP interaction records. " #
    "Parse the edit request and return a JSON object with only the fields that need to be updated. " #
    "Valid field keys: hcpName, interactionType, datetime, topics, materialsShared, samples, sentiment, outcomes, followUp. " #
    "Return ONLY valid JSON with the fields to update, no extra text.";
  };

  /// Build the system prompt for summarize tool.
  public func summarizePrompt() : Text {
    "You are an AI assistant that summarizes HCP interaction records for pharma field reps. " #
    "Create a concise 2-3 sentence summary of the interaction, highlighting key discussion points, " #
    "outcomes, and any important notes. Keep it professional and factual.";
  };

  /// Build the system prompt for suggest follow-ups tool.
  public func suggestFollowUpsPrompt() : Text {
    "You are an AI assistant that suggests follow-up actions for pharma field reps after HCP interactions. " #
    "Based on the interaction details, suggest exactly 3 specific, actionable follow-up items. " #
    "Return them as a JSON array of strings, e.g. [\"Send product brochure\", \"Schedule next visit\", \"Submit sample request\"]. " #
    "Return ONLY valid JSON array, no extra text.";
  };

  /// Route user message to the appropriate AI tool name.
  public func routeTool(userMessage : Text) : Text {
    let lower = userMessage.toLower();
    if (lower.contains(#text "extract") or lower.contains(#text "who") or lower.contains(#text "find entities")) {
      "extractEntities"
    } else if (lower.contains(#text "summarize") or lower.contains(#text "summary")) {
      "summarize"
    } else if (lower.contains(#text "follow")) {
      "suggestFollowUps"
    } else if (lower.contains(#text "edit") or lower.contains(#text "change") or lower.contains(#text "update")) {
      "editInteraction"
    } else {
      "logInteraction"
    };
  };

  /// Select temperature based on tool — lower for structured, higher for generative.
  func temperatureForTool(toolName : Text) : Text {
    if (toolName == "extractEntities" or toolName == "editInteraction") {
      "0.3"
    } else {
      "0.7"
    };
  };

  /// Build Groq API JSON request body.
  public func buildRequestBody(model : Text, systemPrompt : Text, userMessage : Text, context : Text, toolName : Text) : Text {
    let temp = temperatureForTool(toolName);
    let fullUserMessage = if (context == "") {
      userMessage
    } else {
      userMessage # "\n\nContext:\n" # context
    };
    // Escape quotes and newlines for JSON safety
    let escapedSystem = escapeJson(systemPrompt);
    let escapedUser = escapeJson(fullUserMessage);
    "{\"model\":\"" # model # "\"," #
    "\"messages\":[" #
      "{\"role\":\"system\",\"content\":\"" # escapedSystem # "\"}," #
      "{\"role\":\"user\",\"content\":\"" # escapedUser # "\"}" #
    "]," #
    "\"max_tokens\":1024," #
    "\"temperature\":" # temp # "}";
  };

  /// Simple JSON string escaper — handles quotes and newlines.
  func escapeJson(s : Text) : Text {
    let withBackslashes = s.replace(#char '\\', "\\\\");
    let withNewlines = withBackslashes.replace(#char '\n', "\\n");
    let withTabs = withNewlines.replace(#char '\t', "\\t");
    // Replace double-quote char using unicode escape to avoid parser ambiguity
    withTabs.replace(#char '\u{22}', "\\u0022");
  };

  /// Parse Groq API JSON response to extract choices[0].message.content.
  /// Simple text-based extraction without a JSON parser.
  public func parseGroqResponse(raw : Text) : Text {
    // Look for "content":"<value>" pattern after "message"
    let marker = "\"content\":\"";
    switch (findAfter(raw, marker)) {
      case null { "Could not parse AI response." };
      case (?rest) {
        // Extract until the closing unescaped quote
        extractUntilUnescapedQuote(rest);
      };
    };
  };

  /// Find the text after the first occurrence of needle in haystack.
  func findAfter(haystack : Text, needle : Text) : ?Text {
    // Split on needle and return the part after first occurrence
    let iter = haystack.split(#text needle);
    // skip the first part (before needle)
    switch (iter.next()) {
      case null null;
      case (?_) {
        // return the next part (after needle)
        iter.next();
      };
    };
  };

  /// Extract text until the first unescaped double-quote.
  func extractUntilUnescapedQuote(s : Text) : Text {
    var result = "";
    var prevWasBackslash = false;
    let iter = s.toIter();
    label chars while (true) {
      switch (iter.next()) {
        case null { break chars };
        case (?c) {
          if (prevWasBackslash) {
            // Handle escape sequences
            if (c == 'n') {
              result := result # "\n";
            } else if (c == 't') {
              result := result # "\t";
            } else if (c == '\\') {
              result := result # "\\";
            } else {
              // includes escaped quote and others — output as-is
              result := result # Text.fromChar(c);
            };
            prevWasBackslash := false;
          } else if (c == '\\') {
            prevWasBackslash := true;
          } else if (c == '\u{22}') {
            // unescaped double-quote: end of value
            break chars;
          } else {
            result := result # Text.fromChar(c);
          };
        };
      };
    };
    result;
  };

  /// Return the tool name for a given user message (alias of routeTool).
  public func parseTool(userMessage : Text) : Text {
    routeTool(userMessage);
  };

  /// Get the system prompt for a given tool name.
  public func getSystemPrompt(toolName : Text) : Text {
    if (toolName == "extractEntities") {
      entityExtractionPrompt()
    } else if (toolName == "summarize") {
      summarizePrompt()
    } else if (toolName == "suggestFollowUps") {
      suggestFollowUpsPrompt()
    } else if (toolName == "editInteraction") {
      editInteractionAiPrompt()
    } else {
      logInteractionAiPrompt()
    };
  };

  /// Build a friendly human-readable message for the response.
  public func buildFriendlyMessage(toolName : Text, content : Text) : Text {
    if (toolName == "extractEntities") {
      "I've extracted the following entities from your text."
    } else if (toolName == "summarize") {
      content
    } else if (toolName == "suggestFollowUps") {
      "Here are 3 suggested follow-up actions based on the interaction."
    } else if (toolName == "editInteraction") {
      "I've identified the fields to update in the interaction record."
    } else {
      "Interaction details have been extracted and are ready to log."
    };
  };
};
