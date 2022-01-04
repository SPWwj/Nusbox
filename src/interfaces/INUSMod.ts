
export interface Attributes {
    su: boolean;
}

export interface Timetable {
    classNo: string;
    startTime: string;
    endTime: string;
    weeks: number[];
    venue: string;
    day: string;
    lessonType: string;
    size: number;
}

export interface SemesterData {
    semester: number;
    timetable: Timetable[];
    examDate: Date;
    examDuration: number;
}

export interface NUSMod {
    acadYear: string;
    preclusion: string;
    description: string;
    title: string;
    department: string;
    faculty: string;
    workload: number[];
    moduleCredit: string;
    moduleCode: string;
    attributes: Attributes;
    semesterData: SemesterData[];
    fulfillRequirements: string[];
}



