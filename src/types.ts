import { r2rClient } from 'r2r-js';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface SortCriteria<T> {
  key: keyof T;
  order: 'asc' | 'desc';
}

export interface FilterCriteria<T> {
  [key: string]: any;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  initialSort?: SortCriteria<T>;
  initialFilters?: FilterCriteria<T>;
  onRowSelect?: (selectedIds: string[]) => void;
  pagination?: {
    itemsPerPage: number;
    initialPage?: number;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  userRole: 'admin' | 'user' | null;
}

export interface BarChartProps {
  data: {
    filtered_logs?: {
      [key: string]: Array<{ value: string }>;
    };
  };
  selectedFilter: string;
}

export interface DefaultQueriesProps {
  setQuery: (query: string) => void;
  mode: 'rag' | 'rag_agent';
}

export interface DeleteButtonProps {
  selectedDocumentIds: string[];
  onDelete: () => void;
  onSuccess: () => void;
  showToast: (message: {
    title: string;
    description: string;
    variant: 'default' | 'destructive' | 'success';
  }) => void;
}

export interface Document {
  id: string;
  text: string;
  metadata: any;
  collection_ids?: string[];
}

export interface User {
  id: string;
  user_id?: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  collection_ids: string[];

  // Optional fields
  hashed_password?: string;
  verification_code_expiry?: string;
  name?: string;
  profile_picture?: string;
}

export interface DocumentFilterCriteria {
  sort: 'title' | 'date';
  order: 'asc' | 'desc';
}

export enum IngestionStatus {
  PENDING = 'pending',
  PARSING = 'parsing',
  CHUNKING = 'chunking',
  EMBEDDING = 'embedding',
  STORING = 'storing',
  FAILURE = 'failure',
  SUCCESS = 'success',
}

export interface DocumentInfoType {
  id: string;
  user_id: string;
  collection_ids: string[];
  type: string;
  metadata: Record<string, any>;
  title: string;
  version: string;
  size_in_bytes: number;
  ingestion_status: IngestionStatus;
  restructuring_status: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentInfoDialogProps {
  id: string;
  apiUrl?: string;
  open: boolean;
  onClose: () => void;
}

export interface DocumentChunk {
  fragment_id: string;
  extraction_id: string;
  document_id: string;
  user_id: string;
  collection_ids: string[];
  text: string;
  metadata: { [key: string]: any };
}

export interface EditPromptDialogProps {
  open: boolean;
  onClose: () => void;
  promptName: string;
  promptTemplate: string;
  onSaveSuccess: () => void;
}

export interface GenerationConfig {
  // RAG Configuration
  temperature?: number;
  setTemperature?: (value: number) => void;
  top_p?: number;
  setTopP?: (value: number) => void;
  top_k?: number;
  setTop_k?: (value: number) => void;
  max_tokens_to_sample?: number;
  setMax_tokens_to_sample?: (value: number) => void;
  model?: string;
  setModel?: (value: string) => void;
  stream?: boolean;
  setStream?: (value: boolean) => void;
  functions?: Array<Record<string, any>> | null;
  setFunctions?: (value: Array<Record<string, any>> | null) => void;
  skip_special_tokens?: boolean;
  setSkipSpecialTokens?: (value: boolean) => void;
  stop_token?: string | null;
  setStopToken?: (value: string | null) => void;
  num_beams?: number;
  setNumBeams?: (value: number) => void;
  do_sample?: boolean;
  setDoSample?: (value: boolean) => void;
  generate_with_chat?: boolean;
  setGenerateWithChat?: (value: boolean) => void;
  add_generation_kwargs?: Record<string, any>;
  setAddGenerationKwargs?: (value: Record<string, any>) => void;
  api_base?: string | null;
  setApiBase?: (value: string | null) => void;

  // Knowledge Graph Configuration
  kg_temperature?: number;
  setKgTemperature?: (value: number) => void;
  kg_top_p?: number;
  setKgTopP?: (value: number) => void;
  kg_top_k?: number;
  setKgTop_k?: (value: number) => void;
  kg_max_tokens_to_sample?: number;
  setKgMax_tokens_to_sample?: (value: number) => void;
}

export interface HighlightProps {
  color: string;
  textColor: string;
  children: React.ReactNode;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  disableLink?: boolean;
  priority?: boolean;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  id: string;
  timestamp: number;
  isStreaming?: boolean;
  sources?: Record<string, string | null>;
  searchPerformed?: boolean;
}

export interface ModelSelectorProps {
  id?: string;
}

export interface NavbarProps {
  className?: string;
}

export interface NavItemsProps {
  isAuthenticated: boolean;
  role: 'admin' | 'user';
  pathname: string;
}

export interface Pipeline {
  deploymentUrl: string;
}

export interface PipelineStatusProps {
  className?: string;
  onStatusChange?: (isConnected: boolean) => void;
}

export interface R2RServerCardProps {
  pipeline: Pipeline | null;
  onStatusChange: (status: boolean) => void;
}

export interface RagGenerationConfig {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens_to_sample?: number;
  model?: string;
  stream: boolean;
}

export interface SearchProps {
  pipeline?: Pipeline;
  setQuery: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface ServerStats {
  start_time: string;
  uptime_seconds: number;
  cpu_usage: number;
  memory_usage: number;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  switches: any;
  handleSwitchChange: (id: string, checked: boolean) => void;
  searchLimit: number;
  setSearchLimit: (limit: number) => void;
  searchFilters: string;
  setSearchFilters: (filters: string) => void;
  selectedModel: string;
  kgSearchType: 'local' | 'global';
  setKgSearchType: (type: 'local' | 'global') => void;
  max_llm_queries_for_global_search: number;
  setMax_llm_queries_for_global_search: (value: number) => void;
  top_k: number;
  setTop_k: (value: number) => void;
  max_tokens_to_sample: number;
  setMax_tokens_to_sample: (value: number) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  collections: Array<{ collection_id: string; name: string }>;
  selectedCollectionIds: string[];
  setSelectedCollectionIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface SingleSwitchProps {
  id: string;
  initialChecked: boolean;
  onChange: (id: string, checked: boolean) => void;
  label: string;
  tooltipText: string;
}

export interface Switch {
  checked: boolean;
  label: string;
  tooltipText: string;
}

export interface SpinnerProps {
  className?: string;
}

export interface UpdateButtonContainerProps {
  apiUrl?: string;
  id: string;
  onUpdateSuccess: () => void;
  showToast: (message: {
    title: string;
    description: string;
    variant: 'default' | 'destructive' | 'success';
  }) => void;
}

export interface DownloadFileContainerProps {
  apiUrl?: string;
  id: string;
  fileName: string;
  showToast: (message: {
    title: string;
    description: string;
    variant: 'default' | 'destructive' | 'success';
  }) => void;
}

export interface UpdateButtonProps {
  userId: string;
  id: string;
  onUpdateSuccess: () => void;
  showToast?: (message: {
    title: string;
    description: string;
    variant: 'default' | 'destructive' | 'success';
  }) => void;
}

export interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

export interface UserContextProps {
  pipeline: Pipeline | null;
  setPipeline: (pipeline: Pipeline) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    instanceUrl: string
  ) => Promise<{ success: boolean; userRole: 'admin' | 'user' }>;
  loginWithToken: (
    token: string,
    instanceUrl: string
  ) => Promise<{ success: boolean; userRole: 'admin' | 'user' }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    instanceUrl: string
  ) => Promise<void>;
  authState: AuthState;
  getClient: () => r2rClient | null;
  client: r2rClient | null;
  viewMode: 'admin' | 'user';
  setViewMode: React.Dispatch<React.SetStateAction<'admin' | 'user'>>;
  isSuperUser: () => boolean;
}

export type Collection = {
  name: string;
  collection_id: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export interface VectorSearchResult {
  fragment_id: string;
  extraction_id: string;
  document_id: string;
  user_id: string;
  collection_ids: string[];
  score: number;
  text: string;
  metadata: Record<string, any>;
}

export interface KGEntity {
  name: string;
  description: string;
}

export interface KGTriple {
  subject: string;
  predicate: string;
  object: string;
}

export interface KGCommunity {
  title: string;
  summary: string;
  explanation: string;
}

export interface KGLocalSearchResult {
  query: string;
  entities: KGEntity[];
  relationships: KGTriple[];
  communities: KGCommunity[];
}

export interface KGSearchResult {
  method: 'local' | 'global';
  content: any;
  result_type: 'entity' | 'relationship' | 'community' | 'global';
  fragment_ids: string[];
  document_ids: string[];
  metadata: Record<string, any>;
}
