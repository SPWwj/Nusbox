export class DateHelper{
    NumberOfDays(weekDay:string) {
        return "Sunday" === weekDay
        ? 6
        : "Tuesday" === weekDay
        ? 1
        : "Wednesday" === weekDay
        ? 2
        : "Thursday" === weekDay
        ? 3
        : "Friday" === weekDay
        ? 4
        : "Saturday" === weekDay
        ? 5
        : 0;
    }

}