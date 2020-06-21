// Модель класса Мастер
export class Master {
    public id_master: number;
    public fio: string;
    public specialization: string;
    public schedule: string;

    constructor(id_master:number, fio:string, specialization:string, schedule:string){
        this.id_master=id_master;
        this.fio=fio;
        this.specialization=specialization;
        this.schedule=schedule;
    }
}