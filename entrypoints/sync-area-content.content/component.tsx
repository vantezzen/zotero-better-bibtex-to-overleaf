import {
  BookMarked,
  Check,
  Loader2,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import React, { useEffect, useRef } from "react";

import updateBibtexFile from "@/lib/overleaf/updateBibtexFile";
import useHostColorScheme from "@/lib/useHostColorScheme";
import { cn } from "@/lib/utils";

import { Button } from "../../components/ui/button";

type SyncState =
  | { status: "idle" }
  | { status: "syncing" }
  | { status: "synced"; at: Date }
  | { status: "error"; detail: string };

function SyncAreaContent() {
  const [url, setUrl] = React.useState("");
  const [state, setState] = React.useState<SyncState>({ status: "idle" });
  const root = useRef<HTMLDivElement>(null);
  const isDark = useHostColorScheme(root);

  useEffect(() => {
    const cmContent = document.querySelector(".cm-content") as HTMLDivElement;
    if (!cmContent) return;

    const updateUrl = () => {
      setTimeout(() => {
        const content = cmContent.innerText.split("\n");
        if (!content[0] || content[0].trim() !== "# BETTER BIBTEX") {
          setUrl("");
          return;
        }

        setUrl(content[1]?.replace("# ", "") ?? "");
      }, 100);
    };
    updateUrl();

    const observer = new MutationObserver(updateUrl);
    observer.observe(cmContent, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const sync = async () => {
    setState({ status: "syncing" });
    try {
      await updateBibtexFile(url);
      setState({ status: "synced", at: new Date() });
    } catch (error) {
      setState({ status: "error", detail: describeError(error) });
    }
  };

  useEffect(() => {
    const forceFetch = async (e: MessageEvent) => {
      if (!url) return;

      if (
        e.data.type !== "better-bibtex" ||
        e.data.action !== "update-bibtex-file"
      )
        return;

      await sync();
    };

    window.addEventListener("message", forceFetch);
    return () => {
      window.removeEventListener("message", forceFetch);
    };
  }, [url]);

  if (!url) return null;

  const isSyncing = state.status === "syncing";
  const format = formatOf(url);

  return (
    <div
      ref={root}
      className={cn(
        isDark && "dark",
        "w-full font-sans text-foreground antialiased",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border bg-orange-50  px-4 py-2.5">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
        >
          <BookMarked size={17} strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold leading-5">
              Synced with Zotero
            </span>
            {format && (
              <span className="rounded border border-border px-1.5 text-[10px] font-medium uppercase leading-4 tracking-wide text-muted-foreground">
                {format}
              </span>
            )}
          </div>

          <p
            aria-live="polite"
            title={url}
            className="truncate text-xs leading-5 text-muted-foreground"
          >
            {isSyncing ? (
              "Fetching references from Zotero…"
            ) : state.status === "synced" ? (
              <span className="inline-flex items-center gap-1.5">
                <Check
                  size={12}
                  strokeWidth={3}
                  className="text-emerald-600 dark:text-emerald-400"
                />
                Updated at {timeOf(state.at)} · edits here are replaced on each
                sync
              </span>
            ) : (
              "Edits made here are replaced on each sync"
            )}
          </p>
        </div>

        <Button
          size="sm"
          onClick={sync}
          disabled={isSyncing}
          className="gap-2 shadow-sm disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          data-bibtex-sync-button
        >
          {isSyncing ? (
            <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
          ) : (
            <RefreshCw size={14} strokeWidth={2.5} />
          )}
          {isSyncing ? "Syncing…" : "Sync now"}
        </Button>
      </div>

      {state.status === "error" && (
        <div className="flex items-start gap-2 border-t border-destructive/25 bg-destructive/10 px-4 py-2 text-xs leading-5 text-destructive">
          <TriangleAlert size={14} className="mt-0.5 shrink-0" />
          <p className="min-w-0">
            <span className="font-semibold">Couldn't reach Zotero.</span> Make
            sure Zotero is running with Better BibTeX installed, then try again.
            <span className="block truncate opacity-70" title={state.detail}>
              {state.detail}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

/** `…/collection?/1/123456.biblatex` → `biblatex` */
function formatOf(url: string) {
  const extension = url.split(".").pop();
  return extension && /^[a-z]{3,10}$/i.test(extension) ? extension : null;
}

function timeOf(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function describeError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default SyncAreaContent;
