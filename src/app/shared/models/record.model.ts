// Модель класса Запись
export class Record {
    public id_record: number;
    public id_master: string;
    public id_service: number;
    public id: number;
    public phone: string;
    public date: string;
    public time: string;
    public price: string;
    constructor(id_record:number, id_master:string, id_service:number, id:number, phone:string, date:string, time:string, price:string){
        this.id_record=id_record;
        this.id_master=id_master;
        this.id_service=id_service;
        this.id=id;
        this.phone=phone;
        this.date=date;
        this.time=time;
        this.price=price;
    }
}