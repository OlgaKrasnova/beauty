// Модель класса Услуга
export class Service {
    public id_service: number;
    public name: string;
    public description: string;
    public price: string;
    public filename: string;
    constructor(id_service:number, name:string, description:string, price:string, filename: string){
        this.id_service=id_service;
        this.name=name;
        this.description=description;
        this.price=price;
        this.filename=filename;
    }
}