// Модель класса Мастер
export class Master {
    public id_master: any;
    public fio: any;
    public name_specializaion: any;
    public start_schedule: any;
    public end_schedule: any;
    public id_specialization?:any;

    constructor(id_master:any, fio:any, name_specializaion:any, start_schedule:any, end_schedule:any, id_specialization:any = null){
        this.id_master=id_master;
        this.fio=fio;
        this.name_specializaion=name_specializaion;
        this.start_schedule=start_schedule;
        this.end_schedule=end_schedule;
        this.id_specialization=id_specialization;
    }
}