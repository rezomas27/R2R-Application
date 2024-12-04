import { Loader, FileSearch2, Settings } from 'lucide-react';
import { useRouter } from 'next/router';
import { CollectionResponse, DocumentResponse, User } from 'r2r-js/dist/types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { RemoveButton } from '@/components/ChatDemo/remove';
import Table, { Column } from '@/components/ChatDemo/Table';
import CollectionDialog from '@/components/ChatDemo/utils/collectionDialog';
import DocumentInfoDialog from '@/components/ChatDemo/utils/documentDialogInfo';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/UserContext';
import { IngestionStatus, KGExtractionStatus } from '@/types';

const PAGE_SIZE = 100;
const ITEMS_PER_PAGE = 10;

const CollectionIdPage: React.FC = () => {
  const router = useRouter();
  const { getClient } = useUserContext();

  const [collection, setCollection] = useState<CollectionResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [totalDocumentEntries, setTotalDocumentEntries] = useState<number>(0);

  const [users, setUsers] = useState<User[]>([]);
  const [totalUserEntries, setTotalUserEntries] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const { toast } = useToast();
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [isDocumentInfoDialogOpen, setIsDocumentInfoDialogOpen] =
    useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState('documents');
  const itemsPerPage = ITEMS_PER_PAGE;

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({
    ingestion_status: ['success', 'failed', 'pending', 'enriched'],
    extraction_status: ['success', 'failed', 'pending'],
  });

  const currentCollectionId =
    typeof router.query.id === 'string' ? router.query.id : '';

  console.log(
    'currentCollectionId outside of fetchAllDocuments:',
    currentCollectionId
  );

  const fetchCollection = useCallback(async () => {
    if (!currentCollectionId) {
      return;
    }

    try {
      setLoading(true);
      const client = await getClient();
      if (!client) {
        throw new Error('Failed to get authenticated client');
      }

      const collection = await client.collections.retrieve({
        id: currentCollectionId,
      });

      setCollection(collection.results);
    } catch (error) {
      console.error('Error fetching collection:', error);
      setError(error.message);
    }
  }, [currentCollectionId, getClient]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  /*** Fetching Documents in Batches ***/
  const fetchAllDocuments = useCallback(async () => {
    if (!currentCollectionId) {
      return;
    }

    try {
      setLoading(true);
      const client = await getClient();
      if (!client) {
        throw new Error('Failed to get authenticated client');
      }

      let offset = 0;
      let allDocs: DocumentResponse[] = [];
      let totalDocumentEntries = 0;

      // Fetch first batch
      console.log(
        'currentCollectionId inside of fetchAllDocuments:',
        currentCollectionId
      );
      const firstBatch = await client.collections.listDocuments({
        id: currentCollectionId,
        offset: offset,
        limit: PAGE_SIZE,
      });

      if (firstBatch.results.length > 0) {
        totalDocumentEntries = firstBatch.total_entries;
        setTotalDocumentEntries(totalDocumentEntries);

        allDocs = firstBatch.results;
        setDocuments(allDocs);

        // Set loading to false after the first batch is fetched
        setLoading(false);
      } else {
        setLoading(false);
        return;
      }

      offset += PAGE_SIZE;

      // Continue fetching in the background
      while (offset < totalDocumentEntries) {
        const batch = await client.collections.listDocuments({
          id: currentCollectionId,
          offset: offset,
          limit: PAGE_SIZE,
        });

        if (batch.results.length === 0) {
          break;
        }

        allDocs = allDocs.concat(batch.results);
        setDocuments([...allDocs]);

        offset += PAGE_SIZE;
      }

      setDocuments(allDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  }, [currentCollectionId, getClient]);

  useEffect(() => {
    fetchAllDocuments();
  }, [fetchAllDocuments]);

  /*** Fetching Users in Batches ***/
  const fetchAllUsers = useCallback(async () => {
    if (!currentCollectionId) {
      return;
    }

    try {
      setLoading(true);
      const client = await getClient();
      if (!client) {
        throw new Error('Failed to get authenticated client');
      }

      let offset = 0;
      let allUsers: User[] = [];
      let totalUserEntries = 0;

      // Fetch first batch
      const firstBatch = await client.collections.listUsers({
        id: currentCollectionId,
        offset: offset,
        limit: PAGE_SIZE,
      });

      if (firstBatch.results.length > 0) {
        totalUserEntries = firstBatch.total_entries;
        setTotalUserEntries(totalUserEntries);

        allUsers = firstBatch.results;
        setUsers(allUsers);

        // Set loading to false after the first batch is fetched
        setLoading(false);
      } else {
        setLoading(false);
        return;
      }

      offset += PAGE_SIZE;

      // Continue fetching in the background
      while (offset < totalUserEntries) {
        const batch = await client.collections.listUsers({
          id: currentCollectionId,
          offset: offset,
          limit: PAGE_SIZE,
        });

        if (batch.results.length === 0) {
          break;
        }

        allUsers = allUsers.concat(batch.results);
        setUsers([...allUsers]);

        offset += PAGE_SIZE;
      }

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  }, [currentCollectionId, getClient]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const refetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchAllDocuments(), fetchAllUsers()]);
    setSelectedDocumentIds([]);
  }, [fetchAllDocuments, fetchAllUsers]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const { id } = router.query;
    if (typeof id === 'string') {
      refetchData();
    }
  }, [router.isReady, router.query.id, refetchData]);

  /*** Client-Side Filtering and Pagination ***/
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0 && Array.isArray(value)) {
        filtered = filtered.filter((doc) => {
          switch (key) {
            case 'ingestion_status':
              return value.includes(doc.ingestion_status);
            case 'extraction_status':
              return value.includes(doc.extraction_status);
            default:
              return true;
          }
        });
      }
    });

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title?.toLowerCase().includes(query) ||
          doc.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [documents, filters, searchQuery]);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedDocumentIds(filteredDocuments.map((doc) => doc.id));
      } else {
        setSelectedDocumentIds([]);
      }
    },
    [filteredDocuments]
  );

  const handleSelectItem = useCallback((itemId: string, selected: boolean) => {
    setSelectedDocumentIds((prev) => {
      if (selected) {
        return [...prev, itemId];
      } else {
        return prev.filter((id) => id !== itemId);
      }
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const renderActionButtons = () => {
    return (
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-white">{collection?.name}</h1>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setIsCollectionDialogOpen(true);
            }}
            className={`pl-4 pr-4 py-2 px-4`}
            color="filled"
            shape="rounded"
            style={{ zIndex: 20 }}
          >
            <Settings className="mr-2 h-4 w-4 mt-1" />
            Manage
          </Button>
        </div>
      </div>
    );
  };

  const renderDocumentActions = (doc: DocumentResponse) => (
    <div className="flex space-x-1 justify-end">
      <RemoveButton
        itemId={doc.id}
        collectionId={currentCollectionId}
        itemType="document"
        onSuccess={() => refetchData()}
        showToast={toast}
      />
      <Button
        onClick={() => {
          setSelectedDocumentId(doc.id);
          setIsDocumentInfoDialogOpen(true);
        }}
        color="text_gray"
        shape="slim"
        disabled={
          doc.ingestion_status !== IngestionStatus.SUCCESS &&
          doc.ingestion_status !== IngestionStatus.ENRICHED
        }
        tooltip="View Document Info"
      >
        <FileSearch2 className="h-6 w-6" />
      </Button>
    </div>
  );

  const documentColumns: Column<DocumentResponse>[] = [
    {
      key: 'title',
      label: 'Title',
      truncatedSubstring: true,
      sortable: true,
      copyable: true,
    },
    { key: 'id', label: 'Document ID', truncate: true, copyable: true },
    {
      key: 'ingestion_status',
      label: 'Ingestion',
      filterable: true,
      filterType: 'multiselect',
      filterOptions: ['success', 'failed', 'pending', 'enriched'],
      renderCell: (doc) => (
        <Badge
          variant={
            doc.ingestion_status === IngestionStatus.SUCCESS ||
            doc.ingestion_status === IngestionStatus.ENRICHED
              ? 'success'
              : doc.ingestion_status === IngestionStatus.FAILED
                ? 'destructive'
                : 'pending'
          }
        >
          {doc.ingestion_status}
        </Badge>
      ),
    },
    {
      key: 'extraction_status',
      label: 'Extraction',
      filterable: true,
      filterType: 'multiselect',
      filterOptions: ['success', 'failed', 'pending'],
      renderCell: (doc) => (
        <Badge
          variant={
            doc.extraction_status === KGExtractionStatus.SUCCESS
              ? 'success'
              : doc.extraction_status === KGExtractionStatus.FAILED
                ? 'destructive'
                : 'pending'
          }
        >
          {doc.extraction_status}
        </Badge>
      ),
      selected: false,
    },
  ];

  const userColumns: Column<User>[] = [
    { key: 'id', label: 'User ID', truncate: true, copyable: true },
    { key: 'email', label: 'Email', truncate: true, copyable: true },
  ];

  const renderUserActions = (user: User) => (
    <div className="flex space-x-1 justify-end">
      <RemoveButton
        itemId={user.id?.toString() || ''}
        collectionId={currentCollectionId}
        itemType="user"
        onSuccess={() => refetchData()}
        showToast={toast}
      />
    </div>
  );

  if (loading) {
    return (
      <Layout pageTitle="Loading..." includeFooter={false}>
        <main className="w-full flex flex-col container h-screen-[calc(100%-4rem)] justify-center items-center">
          <Loader className="animate-spin" size={64} />
          <p className="mt-4">Loading page data...</p>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout pageTitle="Error" includeFooter={false}>
        <main className="w-full flex flex-col container h-screen-[calc(100%-4rem)] justify-center items-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p>{error}</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout
      pageTitle={`Collection ${currentCollectionId} Overview`}
      includeFooter={false}
    >
      <main className="flex flex-col container h-screen-[calc(100%-4rem)] mt-5 pb-4">
        {renderActionButtons()}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1 mt-4 overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center">
              Documents
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              Users
            </TabsTrigger>
          </TabsList>
          <TabsContent value="documents" className="flex-1 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              {/* Search Input */}
              <div className="flex-grow mx-4">
                <Input
                  placeholder="Search by Title or Document ID"
                  value={searchQuery}
                  onChange={(e) => {
                    handleSearchQueryChange(e.target.value);
                  }}
                />
              </div>
            </div>
            <Table
              data={filteredDocuments}
              columns={documentColumns}
              itemsPerPage={itemsPerPage}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              selectedItems={selectedDocumentIds}
              actions={renderDocumentActions}
              initialSort={{ key: 'title', order: 'asc' }}
              initialFilters={filters}
              currentPage={currentPage}
              totalEntries={totalDocumentEntries}
              onPageChange={handlePageChange}
              loading={loading}
              showPagination={true}
              filters={filters} // Add this line
              onFilter={handleFiltersChange}
            />
          </TabsContent>
          <TabsContent value="users" className="flex-1 overflow-auto">
            <Table
              data={users}
              columns={userColumns}
              itemsPerPage={itemsPerPage}
              onSelectAll={() => {}}
              onSelectItem={() => {}}
              selectedItems={[]}
              actions={renderUserActions}
              initialSort={{ key: 'id', order: 'asc' }}
              initialFilters={{}}
              currentPage={currentPage}
              totalEntries={totalUserEntries}
              onPageChange={handlePageChange}
              loading={loading}
              showPagination={true}
            />
          </TabsContent>
        </Tabs>
      </main>
      <DocumentInfoDialog
        id={selectedDocumentId}
        open={isDocumentInfoDialogOpen}
        onClose={() => {
          setIsDocumentInfoDialogOpen(false);
          setSelectedDocumentId('');
        }}
      />
      <CollectionDialog
        id={currentCollectionId}
        open={isCollectionDialogOpen}
        onClose={() => setIsCollectionDialogOpen(false)}
      />
    </Layout>
  );
};

export default CollectionIdPage;
