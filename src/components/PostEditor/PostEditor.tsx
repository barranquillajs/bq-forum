import { useState } from "react";

import { MarkdowWrapper } from "@components/MarkdowWrapper/MarkdowWrapper";
import { uploadPost } from "@controllers/uploadPost";
import { APP_URLS } from "@constants/urls";

type Mode = "write" | "preview";

export const PostEditor = () => {
  const [mode, setMode] = useState<Mode>("write");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    const errorMessage = "Error al publicar";
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const { data } = await uploadPost({ title, content });

      if (data.slug) return (window.location.href = APP_URLS.INDEX);
      else alert(errorMessage);
      setIsSubmitting(false);
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="mb-2 block font-medium">
          Título
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Título de la publicación"
          className="input w-full"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <div role="tablist" className="tabs tabs-border">
          <a
            role="tab"
            className={`tab ${mode === "write" ? "tab-active" : ""}`}
            onClick={() => setMode("write")}
          >
            Escribir
          </a>
          <a
            role="tab"
            className={`tab ${mode === "preview" ? "tab-active" : ""}`}
            onClick={() => setMode("preview")}
          >
            Vista Previa
          </a>
        </div>

        {mode === "write" ? (
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Escribe tu publicación en Markdown..."
            className="textarea input w-full h-125"
            required
            disabled={isSubmitting}
          />
        ) : (
          <div className="rounded-lg border p-6">
            {content ? (
              <div className="prose">
                <MarkdowWrapper textBody={content} />
              </div>
            ) : (
              <p className="text-gray-400">No hay contenido para mostrar.</p>
            )}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-info" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Publicando...
          </>
        ) : (
          "Publicar"
        )}
      </button>
    </form>
  );
};
