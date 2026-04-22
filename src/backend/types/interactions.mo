import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  public type InteractionRecord = {
    id : Nat;
    hcpName : Text;
    interactionType : Text;
    datetime : Text;
    topics : Text;
    materialsShared : Text;
    samples : Nat;
    sentiment : Text;
    outcomes : Text;
    followUp : Text;
    createdAt : Timestamp;
  };

  public type UpdateInteractionRequest = {
    hcpName : ?Text;
    interactionType : ?Text;
    datetime : ?Text;
    topics : ?Text;
    materialsShared : ?Text;
    samples : ?Nat;
    sentiment : ?Text;
    outcomes : ?Text;
    followUp : ?Text;
  };

  public type AiChatResponse = {
    tool : Text;
    structuredData : Text;
    message : Text;
  };
};
