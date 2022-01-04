import axios from "axios";
import { NUSMod } from "../interfaces/INUSMod";
import { AppointmentData } from "../model/AppointmentData";
import { TimetableLink } from "../model/TimetableLink";
import { DateHelper } from "./DateHelper";
import { UrlHelper } from "./UrlHelper";

const Semester = {
    SemOne: 0,
    SemTwo
        : 1
}
const AcadYear = "2021-2022"

const AcadStartDate = "Mon, 10 Jan 2022" //Mon, 10 Jan 2022

export class ModuleToSchedule {
    private urlHelper = new UrlHelper();


    public async DecodeUrl(timetable : TimetableLink) {
        const params = this.urlHelper.getParamsStr(timetable.url);
        const modStrArr = this.urlHelper.getModulesStr(params);

        const data = await Promise.all(modStrArr.map(async (modStr) => {
            const get = async () => {
                return await this.getData(modStr, timetable)
            }
            return await get();
        }));
        let result: AppointmentData[] = [];

        result = result.concat(...data)

        return result;

    }
    public async getData(modStr: string, timetable: TimetableLink) {
        const mod = this.urlHelper.getModule(modStr);
        return await axios.get<NUSMod>(`https://api.nusmods.com/v2/${AcadYear}/modules/${mod[0]}.json`)
            .then((response) => {
                return this.pushModuleTimeTable(response.data, mod[1], timetable );
            });
    }
    pushModuleTimeTable(module: NUSMod, roomsStr: string, timetable: TimetableLink) {
        const myClassIds = this.urlHelper.getRooms(roomsStr).map(myclass => this.urlHelper.getClasseId(myclass));
        const dateHelper = new DateHelper();
        let result: AppointmentData[] = [];
        module.semesterData[Semester.SemTwo].timetable.filter(table => myClassIds.some(s => table.lessonType.slice(0, 3).toUpperCase() === s[0] && s[1] === table.classNo)).forEach((modClass, i) => {
            modClass.weeks.forEach(w => {
                let d = new AppointmentData();
                // d.Id = Guid.create().toString();
                d.UserDataId = timetable.owerID;
                d.TimeTableLinkId = timetable.id;
                
                d.Subject = `${timetable.name}-${module.moduleCode}`;
                d.StartTime = new Date(`${AcadStartDate} ${modClass.startTime.slice(0, 2)}:${modClass.startTime.slice(2)}`);
                d.EndTime = new Date(`${AcadStartDate} ${modClass.endTime.slice(0, 2)}:${modClass.endTime.slice(2)}`);
                d.StartTime.setDate(d.StartTime.getDate() + 7 * (w - 1) + dateHelper.NumberOfDays(modClass.day));
                d.EndTime.setDate(d.EndTime.getDate() + 7 * (w - 1) + dateHelper.NumberOfDays(modClass.day));
                d.Description = `${modClass.lessonType} : ${modClass.classNo}, ${modClass.venue}`;
                result.push(d);
            });
        });

        return result;
    }
}


