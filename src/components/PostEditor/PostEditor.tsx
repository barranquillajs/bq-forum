import { useState } from "react";

type Mode = "write" | "preview";

export const PostEditor = () => {
  const [mode, setMode] = useState<Mode>("write");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      title,
      content,
    });
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
          />
        ) : (
          <div className="rounded-lg border p-6">
            {content ? (
              <pre className="whitespace-pre-wrap">{content}</pre>
            ) : (
              <p className="text-gray-400">No hay contenido para mostrar.</p>
            )}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-success">
        Publicar
      </button>
    </form>
  );
};
