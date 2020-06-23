// Модель класса Мастер
export class Master {
    public id_master: number;
    public fio: string;
    public name_specialization: string;
    public start_schedule: string;
    public end_schedule: string;

    constructor(id_master:number, fio:string, name_specialization:string, start_schedule:string, end_schedule:string){
        this.id_master=id_master;
        this.fio=fio;
        this.name_specialization=name_specialization;
        this.start_schedule=start_schedule;
        this.end_schedule=end_schedule;
    }
}