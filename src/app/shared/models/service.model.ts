// Модель класса Услуга
export class Service {
    public id_service: number;
    public name: string;
    public name_specialization: string;
    public description: string;
    public price: string;
    public filename: string;
    constructor(id_service:number, name:string, name_specialization: string, description:string, price:string, filename: string){
        this.id_service=id_service;
        this.name=name;
        this.name_specialization=name_specialization;
        this.description=description;
        this.price=price;
        this.filename=filename;
    }
}