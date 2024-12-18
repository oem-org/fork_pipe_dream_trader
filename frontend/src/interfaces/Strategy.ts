
export interface FileSource {
    fk_file_id: number;
    timeperiod?: string
}

export interface DatabaseSource {
    table: string;
    pair: string;
    timeperiod?: string;
}

export interface Strategy {
    id: number;
    name: string;
    fk_file_id?: number;
    description: string;
    data_source?: FileSource | DatabaseSource;
    timeperiod?: string;
}

