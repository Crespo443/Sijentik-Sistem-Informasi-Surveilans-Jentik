import { ReportService } from './report.service';
import type { Response } from 'express';
export declare class ReportController {
    private reportService;
    constructor(reportService: ReportService);
    downloadCSV(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
