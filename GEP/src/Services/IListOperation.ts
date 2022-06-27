
export interface IAllItems {
    listName: string;
    Id?: string;
    selectQuery?: string;
    filterQuery?: string;
    expandQuery?: string;
    orderByQuery?: { columnName: string, ascending: boolean };
    topQuery?: number;
  }
export interface IListOperationsService {
    getAllListItems(Item: IAllItems): Promise<any[]>;
    getLibraryFolders(library: string): Promise<any[]>;
    getAllLibraryItemsByFolder(libraryPath: string): Promise<any[]>;
}