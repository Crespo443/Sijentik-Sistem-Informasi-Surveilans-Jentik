import { PrismaService } from '../prisma/prisma.service';
export declare class ReportService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCSV(user: any): Promise<string>;
}
