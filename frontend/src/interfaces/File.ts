import { FileTypeEnum } from "./enums/FileTypeEnum";

export default interface File {
    id: number;
    file_type: FileTypeEnum;
}
