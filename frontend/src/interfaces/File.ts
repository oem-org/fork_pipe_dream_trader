import { FileTypeEnum } from "./enums/FileTypeEnum";

export default interface File {
    id: number;
    path: string;
    file_type: FileTypeEnum;
    name: string;
}
