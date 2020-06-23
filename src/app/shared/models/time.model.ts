// Модель класса Мастер
export class Time {
    public start_schedule: number;
    public end_schedule: number;

    constructor(start_schedule:number, end_schedule:number){
        this.start_schedule=start_schedule;
        this.end_schedule=end_schedule;
    }
}