/**
 * Inserisce formattazione Markdown attorno al testo selezionato
 * in una textarea, o aggiunge un template se nulla è selezionato.
 */
export function applyMarkdown(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder = ''
): string {
  const start  = textarea.selectionStart;
  const end    = textarea.selectionEnd;
  const value  = textarea.value;
  const selected = value.substring(start, end) || placeholder;
  const replacement = `${before}${selected}${after}`;

  const newValue = value.substring(0, start) + replacement + value.substring(end);

  // Sposta il cursore all'interno della formattazione
  setTimeout(() => {
    textarea.focus();
    const cursorPos = start + before.length + selected.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
  }, 0);

  return newValue;
}
