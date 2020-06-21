// Модель класса Обратный звонок
export class Request {
    public id_request: number;
    public fio: string;
    public phone: string;
    public status: string;
    public purpose: string;

    constructor(id_request:number, fio:string, phone:string, status:string, purpose:string){
        this.id_request=id_request;
        this.fio=fio;
        this.phone=phone;
        this.status=status;
        this.purpose=purpose;
    }
}