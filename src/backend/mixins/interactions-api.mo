import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/interactions";
import Common "../types/common";
import InteractionsLib "../lib/interactions";

mixin (
  interactions : List.List<Types.InteractionRecord>,
  nextIdRef : List.List<Nat>,
) {
  /// Log a new HCP interaction and return the assigned ID.
  public shared func logInteraction(
    hcpName : Text,
    interactionType : Text,
    datetime : Text,
    topics : Text,
    materialsShared : Text,
    samples : Nat,
    sentiment : Text,
    outcomes : Text,
    followUp : Text,
  ) : async Nat {
    let id = InteractionsLib.logInteraction(
      interactions,
      nextIdRef,
      hcpName,
      interactionType,
      datetime,
      topics,
      materialsShared,
      samples,
      sentiment,
      outcomes,
      followUp,
      Time.now(),
    );
    id;
  };

  /// Edit an existing interaction by ID with optional field overrides.
  public shared func editInteraction(
    id : Nat,
    req : Types.UpdateInteractionRequest,
  ) : async Common.Result<Bool, Text> {
    InteractionsLib.editInteraction(interactions, id, req);
  };

  /// Return all interactions sorted by createdAt descending.
  public query func getInteractions() : async [Types.InteractionRecord] {
    InteractionsLib.getInteractions(interactions);
  };

  /// Return a single interaction by ID.
  public query func getInteractionById(id : Nat) : async ?Types.InteractionRecord {
    InteractionsLib.getInteractionById(interactions, id);
  };

  /// Return an array of unique HCP names.
  public query func getHcpNames() : async [Text] {
    InteractionsLib.getHcpNames(interactions);
  };
};
