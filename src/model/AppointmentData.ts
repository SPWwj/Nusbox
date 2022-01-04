import { IAppointmentData } from "../interfaces/IAppointmentData";

export class AppointmentData {
    Id: string ;
    TimeTableLinkId: string;
    Subject: string;
    UserDataId: string;
    Location: string;
    StartTime: Date | string;
    EndTime: Date | string;
    Description: string | null;
    IsAllDay: boolean | null;
    RecurrenceRule: string | null;
    RecurrenceException: string;
    RecurrenceID: number | null;

    public constructor(init?: Partial<AppointmentData>) {
        Object.assign(this, init);
    }
}
export function iAptToApt(apts:IAppointmentData[]) {
    return apts.map(a => {
        return new AppointmentData({ Id: a.id, TimeTableLinkId: a.timeTableLinkId, Subject: a.subject, UserDataId: a.userDataId,Location:a.location,StartTime: new Date(a.startTime), EndTime : new Date(a.endTime), Description : a.description , IsAllDay : a.isAllDay, RecurrenceID: a.recurrenceID, RecurrenceException: a.recurrenceException, RecurrenceRule: a.recurrenceRule});
    })
}
export function aptToIApt(apts: AppointmentData[]) {
    return apts.map(a => {
        const result : IAppointmentData ={
            id: a.Id,
            timeTableLinkId: a.TimeTableLinkId,
            subject: a.Subject,
            userDataId: a.UserDataId,
            location: a.Location,
            startTime: a.StartTime,
            endTime: a.EndTime,
            description: a.Description,
            isAllDay: a.IsAllDay,
            recurrenceRule: a.RecurrenceRule,
            recurrenceException: a.RecurrenceException,
            recurrenceID: a.RecurrenceID
        }
        return result;
        
    })
}