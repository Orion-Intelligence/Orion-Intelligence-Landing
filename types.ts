
export type Modality = 'SIGNAL' | 'INFRASTRUCTURE' | 'IDENTITY' | 'ASSET';

export interface EntityRecord {
  id: string;
  modality: Modality;
  identifier: string;
  relevanceWeight: number;
  timestamp: string;
  provenance: string;
}

export interface ProbeResponse {
  target: string;
  status: 'RESOLVED' | 'UNRESOLVED' | 'FLAGGED';
  observations: string[];
  intelligenceDossier?: string;
}

export enum SystemModule {
  CRAWLER = 'crawler_engine',
  INDEXER = 'indexing_service',
  HEURISTICS = 'heuristic_analyzer',
  VAULT = 'secure_storage'
}
