import { useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getMockPieceById } from "../brecho.data";
import "./peca-detalhe.css";

export function PecaDetalhe() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    useLayoutEffect(() => {
    // Guarda a configuração original do navegador.
    const previousRestoration = window.history.scrollRestoration;

    // Impede que o navegador recupere o scroll anterior automaticamente.
    window.history.scrollRestoration = "manual";

    // Abre os detalhes sempre no topo.
    window.scrollTo(0, 0);

    return () => {
        // Restaura a configuração anterior ao sair da página.
        window.history.scrollRestoration = previousRestoration;
    };
    }, []);

    // Recupera a posição salva quando a pessoa clicou na peça.
    const catalogPosition = (
    location.state as {
        catalogPosition?: {
        scrollY: number;
        category: "Feminino" | "Masculino" | "Infantil";
        scrollLeft: number;
        activeFilter: "Todos" | "Feminino" | "Masculino" | "Infantil";
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

  // Procura a peça correspondente ao ID da URL.
  const piece = id ? getMockPieceById(id) : undefined;

  // Guarda o índice da imagem selecionada na galeria.
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


  // Trata IDs inválidos ou peças que não existem.
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

        <button
          type="button"
          onClick={handleBackToCatalog}
        >
          Voltar ao acervo
        </button>
      </main>
    );
  }

  // Obtém a imagem selecionada. Caso não existam imagens, usa undefined.
  const selectedImage = piece.images[selectedImageIndex];

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
        {/* Galeria: foto principal e miniaturas selecionáveis. */}
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

          <a className="peca-detalhe__buy"
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

