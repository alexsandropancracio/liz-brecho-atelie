/**

Dados fictícios do acervo da LIZ.


Futuramente, estes dados serão obtidos do banco de dados.
O formato de cada peça será mantido para facilitar essa integração.
*/

export type Category = "Feminino" | "Masculino" | "Infantil";

export type PieceCondition =
| "Novo com etiqueta"
| "Excelente estado"
| "Bom estado"
| "Com pequenos sinais de uso";

export type PieceAvailability =
| "Disponível"
| "Reservada"
| "Vendida";

export type PieceMeasurement = {
label: string;
value: string;
};

export type PieceImage = {
url: string;
alt: string;
};

export type Piece = {
id: string;
name: string;
category: Category;
description: string;
price: number;
size: string;
condition: PieceCondition;
availability: PieceAvailability;
measurements: PieceMeasurement[];
images: PieceImage[];
details: string[];
};

export const MOCK_PIECES: Piece[] = [
{
id: "01",
name: "Blazer de Linho",
category: "Feminino",
description:
"Uma peça versátil, com modelagem elegante e uma proposta atemporal.",
price: 89.9,
size: "M",
condition: "Excelente estado",
availability: "Disponível",
measurements: [
{ label: "Busto", value: "96 cm" },
{ label: "Ombro", value: "40 cm" },
{ label: "Comprimento", value: "68 cm" },
{ label: "Manga", value: "60 cm" },
],
images: [
{
url: "",
alt: "Vista frontal do blazer de linho",
},
{
url: "",
alt: "Detalhe do tecido e acabamento do blazer",
},
],
details: [
"Tecido: linho — composição a confirmar",
"Cor: bege",
"Fechamento frontal por botões",
],
},
{
id: "02",
name: "Camisa Essencial",
category: "Masculino",
description:
"Uma camisa clássica para composições discretas e combinações versáteis.",
price: 49.9,
size: "G",
condition: "Bom estado",
availability: "Disponível",
measurements: [
{ label: "Tórax", value: "108 cm" },
{ label: "Ombro", value: "46 cm" },
{ label: "Comprimento", value: "74 cm" },
{ label: "Manga", value: "64 cm" },
],
images: [
{
url: "",
alt: "Vista frontal da camisa essencial",
},
{
url: "",
alt: "Detalhe do tecido e dos botões da camisa",
},
],
details: [
"Tecido: composição a confirmar",
"Cor: azul-claro",
"Fechamento frontal por botões",
],
},
{
id: "03",
name: "Vestido Estampado",
category: "Infantil",
description:
"Uma peça infantil delicada, pensada para unir conforto e simplicidade.",
price: 39.9,
size: "6 anos",
condition: "Excelente estado",
availability: "Disponível",
measurements: [
{ label: "Busto", value: "64 cm" },
{ label: "Cintura", value: "62 cm" },
{ label: "Comprimento", value: "65 cm" },
],
images: [
{
url: "",
alt: "Vista frontal do vestido infantil",
},
{
url: "",
alt: "Detalhe do acabamento do vestido infantil",
},
],
details: [
"Tecido: composição a confirmar",
"Cor: rosa-claro",
"Modelo com saia rodada",
],
},
];

/**

Recupera uma peça pelo identificador.
Retorna undefined caso o identificador não exista.
*/
export function getMockPieceById(id: string): Piece | undefined {
return MOCK_PIECES.find((piece) => piece.id === id);
}