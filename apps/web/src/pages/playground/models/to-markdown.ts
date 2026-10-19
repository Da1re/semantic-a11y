import type { ReportDocument, ReportDocumentItem } from './report-document';

// 코드 안에 ``` 가 있어도 블록이 끊기지 않도록, 코드 속 가장 긴 백틱 묶음보다 하나 길게 감싼다
function toCodeBlock(code: string): string {
  const longest = Math.max(0, ...Array.from(code.matchAll(/`+/g), (match) => match[0].length));
  const fence = '`'.repeat(Math.max(3, longest + 1));
  return `${fence}html\n${code}\n${fence}`;
}

function toFixMarkdown(item: ReportDocumentItem, labels: ReportDocument['labels']): string[] {
  if (!item.fix) return [`_${labels.noFix}_`];
  return [`**${labels.before}**`, toCodeBlock(item.fix.before), `**${labels.after}**`, toCodeBlock(item.fix.after)];
}

function toItemMarkdown(item: ReportDocumentItem, index: number, labels: ReportDocument['labels']): string {
  return [
    `### ${index + 1}. ${item.title}`,
    item.meta.map(({ label, value }) => `- ${label}: ${value}`).join('\n'),
    item.reason,
    `**${labels.snippet}**`,
    toCodeBlock(item.snippet),
    ...toFixMarkdown(item, labels),
  ].join('\n\n');
}

export function toMarkdown(doc: ReportDocument): string {
  const summaryRows = doc.summary.map(({ label, value }) => `| ${label} | ${value} |`);
  return [
    `# ${doc.title}`,
    doc.meta.map(({ label, value }) => `- ${label}: ${value}`).join('\n'),
    [`| ${doc.labels.summaryItem} | ${doc.labels.summaryValue} |`, '| --- | ---: |', ...summaryRows].join('\n'),
    `## ${doc.itemsTitle}`,
    ...doc.items.map((item, index) => toItemMarkdown(item, index, doc.labels)),
  ].join('\n\n');
}
