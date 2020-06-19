// Модель класса Продукт
export class Product{
    public id: number;
    public name: string;
    public filename: string;
    public artikul: string;
    public number: string;
    public price: string;
    public weight: string;
    public description: string;
    public ingredients: string;
    constructor(id:number, name:string, filename:string, artikul:string, number:string, price:string, weight:string, description:string, ingredients:string){
        this.id=id;
        this.name=name;
        this.filename=filename;
        this.artikul=artikul;
        this.number=number;
        this.price=price;
        this.weight=weight;
        this.description=description;
        this.ingredients=ingredients;
    }
}