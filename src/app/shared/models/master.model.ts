// Модель класса Мастер
export class Master {
    public id_master: number;
    public fio: string;
    public name_specializaion: number;
    public start_schedule: number;
    public end_schedule: number;
    public id_specialization?:number;
    public hour?: number;

    constructor(id_master:number, fio:string, name_specializaion:number, start_schedule:number, end_schedule:number, id_specialization:number = null, hour:number = null){
        this.id_master=id_master;
        this.fio=fio;
        this.name_specializaion=name_specializaion;
        this.start_schedule=start_schedule;
        this.end_schedule=end_schedule;
        this.id_specialization=id_specialization;
        this.hour=hour;

    }
}