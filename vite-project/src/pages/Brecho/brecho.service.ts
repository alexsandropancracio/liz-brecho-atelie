
import { supabase } from "../../lib/supabase";
import type {
  Category,
  Piece,
  PieceAvailability,
  PieceCondition,
} from "./brecho.data";

/**
 * Formato de uma peça retornada pelo banco de dados.
 *
 * Os campos correspondem à tabela public.clothing_items.
 */
type ClothingItemRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  size: string | null;
  category: string | null;
  condition: string | null;
  images: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
};

/**
 * Converte a categoria do banco para o tipo usado pela interface.
 */
function mapCategory(category: string | null): Category {
  if (
    category === "Feminino" ||
    category === "Masculino" ||
    category === "Infantil"
  ) {
    return category;
  }

  throw new Error(`Categoria inválida no cadastro: ${category ?? "vazia"}`);
}

/**
 * Converte o estado de conservação para o tipo da interface.
 */
function mapCondition(condition: string | null): PieceCondition {
  const conditions: PieceCondition[] = [
    "Novo com etiqueta",
    "Excelente estado",
    "Bom estado",
    "Com pequenos sinais de uso",
  ];

  if (condition && conditions.includes(condition as PieceCondition)) {
    return condition as PieceCondition;
  }

  return "Bom estado";
}

/**
 * Converte o status do banco para a disponibilidade exibida na interface.
 */
function mapAvailability(status: string): PieceAvailability {
  switch (status) {
    case "available":
      return "Disponível";
    case "reserved":
      return "Reservada";
    case "sold":
      return "Vendida";
    default:
      throw new Error(`Status inválido no cadastro: ${status}`);
  }
}

/**
 * Converte os caminhos das imagens em objetos aceitos pela interface.
 *
 * Exemplo de caminho armazenado:
 * vestido-floral.jpg
 *
 * O arquivo deve existir no bucket público "roupas".
 */
function mapImages(images: string[] | null, name: string): Piece["images"] {
  return (images ?? [])
    .filter((path) => path.trim().length > 0)
    .map((path, index) => {
      const { data } = supabase.storage
        .from("roupas")
        .getPublicUrl(path);

      return {
        url: data.publicUrl,
        alt: `${name} — foto ${index + 1}`,
      };
    });
}

/**
 * Converte uma linha do banco para o formato Piece do projeto.
 */
function mapClothingItem(row: ClothingItemRow): Piece {
  return {
    id: row.id,
    name: row.name,
    category: mapCategory(row.category),
    description: row.description ?? "",
    price: Number(row.price),
    size: row.size ?? "Único",
    condition: mapCondition(row.condition),
    availability: mapAvailability(row.status),
    images: mapImages(row.images, row.name),
    measurements: [],
    details: [],
  };
}

/**
 * Busca todas as peças disponíveis para o catálogo público.
 */
export async function getAvailablePieces(): Promise<Piece[]> {
  const { data, error } = await supabase
    .from("clothing_items")
    .select(
      "id, name, description, price, size, category, condition, images, status, created_at, updated_at",
    )
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar peças do brechó:", error);
    throw new Error("Não foi possível carregar o acervo da LIZ.");
  }

  return (data as ClothingItemRow[]).map(mapClothingItem);
}

/**
 * Busca uma peça disponível pelo identificador.
 * Retorna null quando não encontra uma peça disponível com esse ID.
 */
export async function getAvailablePieceById(
  id: string,
): Promise<Piece | null> {
  const { data, error } = await supabase
    .from("clothing_items")
    .select(
      "id, name, description, price, size, category, condition, images, status, created_at, updated_at",
    )
    .eq("id", id)
    .eq("status", "available")
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar detalhes da peça:", error);
    throw new Error("Não foi possível carregar os detalhes desta peça.");
  }

  if (!data) {
    return null;
  }

  return mapClothingItem(data as ClothingItemRow);
}
