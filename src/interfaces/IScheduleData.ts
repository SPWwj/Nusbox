import { IAppointmentData } from "./IAppointmentData";
import { AppointmentData } from "../model/AppointmentData";
import { ChatMessage } from "../model/ChatMessage";
import { EventType , Event } from "../model/EventProps";
import { TimetableLink } from "../model/TimetableLink";
import { UserData } from "../model/UserData";


export interface IScheduleData {
    roomID: string; 
    name: string | null;
    connectionId: string;
    updateCount: number;
    appointments: IAppointmentData[];
    timetableLinks: TimetableLink[];
    chatMessages: ChatMessage[];
    userDatas: UserData[];
    event: Event | null;
    eventType: EventType | null;
    
}