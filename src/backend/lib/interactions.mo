import List "mo:core/List";
import Set "mo:core/Set";
import Types "../types/interactions";
import Common "../types/common";

module {
  public type InteractionRecord = Types.InteractionRecord;
  public type UpdateInteractionRequest = Types.UpdateInteractionRequest;

  /// Log a new interaction; auto-increments ID via nextIdRef List.
  public func logInteraction(
    interactions : List.List<InteractionRecord>,
    nextIdRef : List.List<Nat>,
    hcpName : Text,
    interactionType : Text,
    datetime : Text,
    topics : Text,
    materialsShared : Text,
    samples : Nat,
    sentiment : Text,
    outcomes : Text,
    followUp : Text,
    createdAt : Common.Timestamp,
  ) : Nat {
    // Get current ID from ref (default 1)
    let currentId : Nat = if (nextIdRef.size() == 0) 1 else nextIdRef.at(0);
    let record : InteractionRecord = {
      id = currentId;
      hcpName;
      interactionType;
      datetime;
      topics;
      materialsShared;
      samples;
      sentiment;
      outcomes;
      followUp;
      createdAt;
    };
    interactions.add(record);
    // Increment the id ref
    if (nextIdRef.size() == 0) {
      nextIdRef.add(currentId + 1);
    } else {
      nextIdRef.put(0, currentId + 1);
    };
    currentId;
  };

  /// Edit an existing interaction by ID with optional field updates.
  public func editInteraction(
    interactions : List.List<InteractionRecord>,
    id : Nat,
    req : UpdateInteractionRequest,
  ) : Common.Result<Bool, Text> {
    switch (interactions.findIndex(func(r : InteractionRecord) : Bool { r.id == id })) {
      case null { #err("Interaction not found") };
      case (?idx) {
        let existing = interactions.at(idx);
        let updated : InteractionRecord = {
          existing with
          hcpName = switch (req.hcpName) { case (?v) v; case null existing.hcpName };
          interactionType = switch (req.interactionType) { case (?v) v; case null existing.interactionType };
          datetime = switch (req.datetime) { case (?v) v; case null existing.datetime };
          topics = switch (req.topics) { case (?v) v; case null existing.topics };
          materialsShared = switch (req.materialsShared) { case (?v) v; case null existing.materialsShared };
          samples = switch (req.samples) { case (?v) v; case null existing.samples };
          sentiment = switch (req.sentiment) { case (?v) v; case null existing.sentiment };
          outcomes = switch (req.outcomes) { case (?v) v; case null existing.outcomes };
          followUp = switch (req.followUp) { case (?v) v; case null existing.followUp };
        };
        interactions.put(idx, updated);
        #ok(true);
      };
    };
  };

  /// Return all interactions sorted by createdAt descending.
  public func getInteractions(interactions : List.List<InteractionRecord>) : [InteractionRecord] {
    let arr = interactions.toArray();
    arr.sort(func(a : InteractionRecord, b : InteractionRecord) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });
  };

  /// Return an interaction by ID, or null if not found.
  public func getInteractionById(interactions : List.List<InteractionRecord>, id : Nat) : ?InteractionRecord {
    interactions.find(func(r : InteractionRecord) : Bool { r.id == id });
  };

  /// Return all unique HCP names across all stored interactions.
  public func getHcpNames(interactions : List.List<InteractionRecord>) : [Text] {
    let seen = Set.empty<Text>();
    let result = List.empty<Text>();
    interactions.forEach(func(r : InteractionRecord) {
      if (not seen.contains(r.hcpName)) {
        seen.add(r.hcpName);
        result.add(r.hcpName);
      };
    });
    result.toArray();
  };
};
