import {
  ArrowRight,
  ExternalLink,
  Link2,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import React, { useEffect, useRef } from "react";

import createBibtexFile from "@/lib/overleaf/createBibtexFile";
import useHostColorScheme from "@/lib/useHostColorScheme";
import { cn } from "@/lib/utils";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const DOCS_URL = "https://retorque.re/zotero-better-bibtex/exporting/pull/";

/** The default `disabled:opacity-50` washes the label out on dark backgrounds. */
const BUTTON =
  "gap-2 shadow-sm disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none";

const PLACEHOLDER =
  "http://127.0.0.1:23119/better-bibtex/export/collection?/1/123456.biblatex";

const STEPS = [
  {
    title: "Open Zotero",
    body: (
      <>
        It has to stay running for the sync to work, with the{" "}
        <a
          className="font-semibold text-foreground"
          href="https://retorque.re/zotero-better-bibtex/"
          target="_blank"
          rel="noreferrer"
        >
          Better BibTeX
        </a>{" "}
        plugin installed.
      </>
    ),
  },
  {
    title: "Right-click your collection",
    body: "In Zotero's left sidebar, pick the collection you want to keep in sync.",
  },
  {
    title: (
      <>
        Choose <Menu>Better BibTeX</Menu>{" "}
        <ArrowRight size={11} className="inline align-[-1px]" />{" "}
        <Menu>Download Better BibTeX export…</Menu>
      </>
    ),
    body: "Select BibLaTeX or BibTeX, whichever your document uses.",
  },
  {
    title: "Copy the export URL",
    body: "Zotero shows a URL ending in .biblatex or .bibtex — paste it below.",
  },
];

function NewBibtexFileModalContent() {
  const [url, setUrl] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const root = useRef<HTMLDivElement>(null);
  const isDark = useHostColorScheme(root);
  const realSubmitButton = document.querySelector<HTMLButtonElement>(
    ".modal-footer button[type=submit]",
  );

  useEffect(() => {
    const sidebar = document.querySelector<HTMLDivElement>(
      ".modal-new-file-list",
    );
    if (!realSubmitButton) return;
    realSubmitButton.disabled = true;

    sidebar?.addEventListener("click", () => {
      realSubmitButton.disabled = false;
    });

    return () => {
      realSubmitButton.disabled = false;
    };
  }, []);

  const trimmed = url.trim();
  const isUrl = /^https?:\/\/\S+$/i.test(trimmed);
  const looksLikeExport = /better-bibtex\/export/i.test(trimmed);

  return (
    <div
      ref={root}
      className={cn(
        isDark && "dark",
        "font-sans text-foreground antialiased mt-3",
      )}
    >
      <header className="flex items-start gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-6">
            Import from Better BibTeX
          </h2>
          <p className="text-[13px] leading-5 text-muted-foreground">
            Create a bibliography file that stays in sync with a Zotero
            collection on this computer.
          </p>
        </div>
      </header>

      <ol className="mt-5 space-y-3.5">
        {STEPS.map((step, index) => (
          <li key={index} className="flex gap-3">
            <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold tabular-nums text-muted-foreground">
              {index + 1}
            </span>
            <div className="min-w-0 text-[13px] leading-5">
              <div className="font-medium">{step.title}</div>
              <div className="text-muted-foreground">{step.body}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-[13px] leading-5 text-amber-900 dark:text-amber-200">
        <TriangleAlert
          size={15}
          className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
        />
        <p>
          <span className="font-semibold">
            Close the export window in Zotero
          </span>{" "}
          before continuing — while it is open the export stays locked and the
          import will fail.
        </p>
      </div>

      <form
        id="create-file"
        className="mt-5 border-t border-border pt-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!isUrl || isCreating) return;

          setIsCreating(true);
          realSubmitButton?.setAttribute("disabled", "true");
          await createBibtexFile(trimmed);
        }}
      >
        <Label htmlFor="url" className="text-[13px]">
          Export URL
        </Label>

        <div className="relative mt-1.5">
          <Link2
            size={15}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder={PLACEHOLDER}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            name="url"
            id="url"
            spellCheck={false}
            autoComplete="off"
            className="pl-9 font-mono text-xs"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs leading-5 text-muted-foreground">
            {trimmed && !looksLikeExport ? (
              <span className="text-amber-700 dark:text-amber-300">
                That doesn&apos;t look like a Better BibTeX export URL.
              </span>
            ) : (
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 hover:text-foreground"
              >
                How to get this URL
                <ExternalLink size={11} />
              </a>
            )}
          </p>

          <Button
            type="submit"
            size="sm"
            className={BUTTON}
            disabled={!isUrl || isCreating}
          >
            {isCreating && (
              <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
            )}
            {isCreating ? "Loading…" : "Next step"}
          </Button>
        </div>
      </form>
    </div>
  );
}

/** A menu entry the user has to find in Zotero. */
function Menu({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border bg-muted px-1 py-px text-[12px] font-normal text-muted-foreground">
      {children}
    </span>
  );
}

export default NewBibtexFileModalContent;
