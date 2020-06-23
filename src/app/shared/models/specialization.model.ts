// Модель класса Специализация (категории услуг)
export class Specialization {
    public id_specialization: number;
    public name_specialization: string;
    constructor(id_specialization:number, name_specialization:string){
        this.id_specialization=id_specialization;
        this.name_specialization=name_specialization;
    }
}