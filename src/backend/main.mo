import List "mo:core/List";
import Types "types/interactions";
import InteractionsMixin "mixins/interactions-api";
import AiMixin "mixins/ai-api";

actor {
  let interactions = List.empty<Types.InteractionRecord>();
  // Mutable counters stored as single-element Lists (mixin params don't support `var`)
  let nextIdRef = List.empty<Nat>();
  // API key stored as single-element List for mutability
  let groqApiKeyRef = List.empty<Text>();

  include InteractionsMixin(interactions, nextIdRef);
  include AiMixin(groqApiKeyRef);
};
