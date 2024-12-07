export interface FileDataSource {
    fileId: number;
    fileName: string;
    filePath: string;
}

export interface DatabaseDataSource {
    tableName: string;
    query: string;
}
