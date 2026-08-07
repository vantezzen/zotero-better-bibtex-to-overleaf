import { wait } from "@/lib/utils";

export default async function createBibtexFile(url: string) {
  openNewFileMenu();
  await wait(100);

  const fileType = url.split(".").pop();
  if (!fileType) {
    console.error(`Could not determine file type from URL: ${url}`);
    return;
  }
  focusAndRewriteInputField(fileType);
  ensureCurrentFolderNotCollapsed();

  const currentTreeItems = document.querySelectorAll(
    `[role="treeitem"] .item-name-button`,
  ) as NodeListOf<HTMLButtonElement>;
  currentTreeItems.forEach((item) => {
    item.setAttribute("data-better-bibtex-exists", "true");
  });

  const label = document.querySelector(
    `[for="new-doc-name"]`,
  ) as HTMLLabelElement;
  label.textContent = "Please enter a name for the BibTeX file";

  const form = document.querySelector(
    `form[id="create-file"]`,
  ) as HTMLButtonElement;

  const onSubmit = async () => {
    await wait(1000);

    const editor = document.querySelector(`.cm-content`) as HTMLDivElement;
    editor!.textContent = `# BETTER BIBTEX\n# ${url}`;

    await wait(1000);
    window.postMessage(
      {
        type: "better-bibtex",
        action: "update-bibtex-file",
        url,
      },
      "*",
    );
  };

  form.addEventListener("submit", onSubmit);
}

function ensureCurrentFolderNotCollapsed() {
  const collapsedCurrentFolder = document.querySelector(
    `.file-tree-list .selected[expanded="false"] button`,
  ) as HTMLButtonElement;
  if (collapsedCurrentFolder) {
    collapsedCurrentFolder.click();
  }
}

function focusAndRewriteInputField(fileType: string) {
  const input = document.querySelector("#new-doc-name") as HTMLInputElement;
  input.focus();
  input.value = `.${fileType}`;
  input.setSelectionRange(0, 0);
  return input;
}

function openNewFileMenu() {
  const newFileButton = document.querySelector(
    ".modal-new-file-mode",
  ) as HTMLButtonElement;
  newFileButton!.click();
}
