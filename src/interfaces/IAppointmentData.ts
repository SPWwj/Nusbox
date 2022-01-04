import { Guid } from "guid-typescript";

export interface IAppointmentData {
    id: string;
    timeTableLinkId: string;
    subject: string;
    userDataId: string;
    location: string;
    startTime: Date | string;
    endTime: Date | string;
    description: string | null;
    isAllDay: boolean | null;
    recurrenceRule: string | null;
    recurrenceException: string;
    recurrenceID: number | null;


}