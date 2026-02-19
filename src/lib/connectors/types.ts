export interface ConnectorBase {
  name: string;
  connected: boolean;
  lastSyncAt?: string;
  orgId: string;
}

export interface SyncResult {
  connector: string;
  syncedAt: string;
  created: number;
  updated: number;
  errors: string[];
}

export interface ConnectorStatus {
  name: string;
  connected: boolean;
  lastSyncAt?: string;
  error?: string;
}
