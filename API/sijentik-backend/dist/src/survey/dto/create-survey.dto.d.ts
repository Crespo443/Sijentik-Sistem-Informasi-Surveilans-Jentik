declare enum ContainerCategory {
    DAILY = "DAILY",
    NON_DAILY = "NON_DAILY",
    NATURAL = "NATURAL"
}
declare class SurveyContainerDto {
    category: ContainerCategory;
    containerName: string;
    inspectedCount: number;
    positiveCount: number;
}
declare class SurveyInterventionDto {
    activityName: string;
    isDone: boolean;
}
export declare class CreateSurveyDto {
    houseOwner: string;
    villageId: string;
    surveyDate: string;
    rtRw: string;
    address: string;
    occupantCount: number;
    latitude: number;
    longitude: number;
    notes: string;
    containers: SurveyContainerDto[];
    interventions: SurveyInterventionDto[];
}
export {};
