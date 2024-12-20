import { FileTypeEnum } from "./enums/FileTypeEnum";

export interface File {
    id: number;
    path: string;
    file_type: FileTypeEnum;
    name: string;
}

export interface FileResponse {
    file: File;
    data: string;
    columns: Array<string>
}
