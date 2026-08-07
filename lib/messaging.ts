import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  fetchZoteroData(url: string): string;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
