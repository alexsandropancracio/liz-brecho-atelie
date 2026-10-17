
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Piece } from "../brecho.data";
import { getAvailablePieceById } from "../brecho.service";
import "./peca-detalhe.css";

export function PecaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado da peça consultada no Supabase.
  const [piece, setPiece] = useState<Piece | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Índice da imagem selecionada na galeria.
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Controla a restauração do scroll do navegador.
  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  // Recupera a posição salva ao sair do catálogo.
  const catalogPosition = (
    location.state as {
      catalogPosition?: {
        scrollY: number;
        category: "Feminino" | "Masculino" | "Infantil";
        scrollLeft: number;
        activeFilter:
          | "Todos"
          | "Feminino"
          | "Masculino"
          | "Infantil";
      };
    } | null
  )?.catalogPosition;

  function handleBackToCatalog() {
    navigate("/", {
      state: catalogPosition
        ? { restoreCatalog: catalogPosition }
        : null,
    });
  }

  // Busca a peça no Supabase sempre que o ID da URL mudar.
  useEffect(() => {
    let cancelled = false;

    async function loadPiece() {
      setIsLoading(true);
      setLoadError(null);
      setPiece(null);
      setSelectedImageIndex(0);

      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getAvailablePieceById(id);

        if (!cancelled) {
          setPiece(result);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar os detalhes da peça:",
          error
        );

        if (!cancelled) {
          setLoadError(
            "Não foi possível carregar esta peça. Tente novamente."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPiece();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Carregamento.
  if (isLoading) {
    return (
      <main className="peca-detalhe" role="status">
        <p>Carregando os detalhes da peça...</p>
      </main>
    );
  }

  // Falha na consulta ao Supabase.
  if (loadError) {
    return (
      <main className="peca-detalhe peca-detalhe--not-found">
        <span className="peca-detalhe__eyebrow">
          LIZ — BRECHÓ & ATELIÊ
        </span>

        <h1>Não foi possível carregar esta peça.</h1>

        <p>{loadError}</p>

        <button type="button" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>

        <button type="button" onClick={handleBackToCatalog}>
          Voltar ao acervo
        </button>
      </main>
    );
  }

  // ID inválido, peça inexistente ou peça indisponível.
  if (!piece) {
    return (
      <main className="peca-detalhe peca-detalhe--not-found">
        <span className="peca-detalhe__eyebrow">
          LIZ — BRECHÓ & ATELIÊ
        </span>

        <h1>Esta peça não foi encontrada.</h1>

        <p>
          Ela pode não estar mais no nosso acervo ou o endereço pode estar
          incorreto.
        </p>

        <button type="button" onClick={handleBackToCatalog}>
          Voltar ao acervo
        </button>
      </main>
    );
  }

  
  const totalImages = piece.images.length;

  const selectedImage = piece.images[selectedImageIndex];

  function handlePreviousImage() {
    setSelectedImageIndex((currentIndex) =>
      currentIndex === 0 ? totalImages - 1 : currentIndex - 1
    );
  }

  function handleNextImage() {
    setSelectedImageIndex((currentIndex) =>
      currentIndex === totalImages - 1 ? 0 : currentIndex + 1
    );
  }


  return (
    <main className="peca-detalhe">
      <header className="peca-detalhe__header">
        <button
          type="button"
          className="peca-detalhe__back"
          onClick={handleBackToCatalog}
        >
          <span aria-hidden="true">←</span>
          Voltar ao acervo
        </button>
      </header>

      <section className="peca-detalhe__content">
        {/* Galeria de imagens. */}
        <div className="peca-detalhe__gallery">
          
        <div className="peca-detalhe__main-image">
          {selectedImage?.url ? (
            <img
              key={selectedImage.url}
              src={selectedImage.url}
              alt={selectedImage.alt}
            />
          ) : selectedImage ? (
            <div className="peca-detalhe__image-placeholder">
              <span>Imagem da peça</span>
              <small>{selectedImage.alt}</small>
            </div>
          ) : (
            <div className="peca-detalhe__image-placeholder">
              <span>Imagens em breve</span>
            </div>
          )}

          {totalImages > 1 && (
            <>
              <button
                type="button"
                className="peca-detalhe__arrow peca-detalhe__arrow--previous"
                onClick={handlePreviousImage}
                aria-label="Ver foto anterior"
              >
                <span aria-hidden="true">←</span>
              </button>

              <button
                type="button"
                className="peca-detalhe__arrow peca-detalhe__arrow--next"
                onClick={handleNextImage}
                aria-label="Ver próxima foto"
              >
                <span aria-hidden="true">→</span>
              </button>


            </>
          )}
        </div>


          {piece.images.length > 1 && (
            <div
              className="peca-detalhe__thumbnails"
              aria-label="Fotos da peça"
            >
              {piece.images.map((image, index) => (
                <button
                  key={`${image.alt}-${index}`}
                  type="button"
                  className={`peca-detalhe__thumbnail ${
                    selectedImageIndex === index
                      ? "peca-detalhe__thumbnail--active"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`Ver foto ${index + 1}: ${image.alt}`}
                  aria-pressed={selectedImageIndex === index}
                >
                  {image.url ? (
                    <img src={image.url} alt="" />
                  ) : (
                    <span className="peca-detalhe__thumbnail-placeholder">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações da peça. */}
        <div className="peca-detalhe__information">
          <h1>{piece.name}</h1>

          <p className="peca-detalhe__description">
            {piece.description}
          </p>

          <p className="peca-detalhe__price">
            {piece.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          <a
            className="peca-detalhe__buy"
            href={`https://wa.me/5511981898351?text=${encodeURIComponent(
              `Olá! Tenho interesse nesta peça da LIZ.\n\n${piece.name}\nCódigo: ${piece.id}\nTamanho: ${piece.size}\nPreço: ${piece.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}\n\nLink do produto: ${window.location.origin}/brecho/peca/${encodeURIComponent(piece.id)}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Comprar ${piece.name} pelo WhatsApp`}
          >
            Comprar
          </a>

          <div className="peca-detalhe__attributes">
            <div>
              <span>Tamanho</span>
              <strong>{piece.size}</strong>
            </div>

            <div>
              <span>Conservação</span>
              <strong>{piece.condition}</strong>
            </div>

            <div>
              <span>Categoria</span>
              <strong>{piece.category}</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
