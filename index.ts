import { $ } from "bun";

type DataType = {
  orderedItems: {
    object: {
      content?: string;
      summary: string | null;
      attachment: {
        type: string;
        mediaType: string;
        url: string;
        name: string;
        blurhash: string;
        focalPoint: number[];
        width: number;
        height: number;
      }[];
      url: string;
    };
    published: string;
  }[];
};

const OUTBOX_JSON_DATA = (await Bun.file(
  "./archive/outbox.json"
).json()) as DataType;

const extractContent = (data: DataType) => {
  return data.orderedItems.map(
    (item) => {
      let content = item.object.content;
      if (!content) {
        return;
      }
      if (item.object.summary !== null) {
        content = `<details><summary>${item.object.summary}</summary>${content}</details>`;
      }
      const published = item.published;
      if (item.object.attachment.length > 0) {
        item.object.attachment.forEach(
          (attachment) => {
            content += `<div><img src="/2024-activityPub-contents${attachment.url}" alt="${attachment.name}"></div>`;
          }
        );
      }
      const url = item.object.url;
      return `
        <article>
          <time datetime="${published}">
            <a href="${url}" target="_blank">
              ${new Date(published)
                .toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replaceAll("/", "-")}
            </a>
          </time>
          <div>${content}</div>
        </article>
      `;
    }
  );
};

const contentArray = extractContent(OUTBOX_JSON_DATA);

// HTMLコンテンツを生成する
const htmlContent = `
<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>2024 yamanoku's ActivityPub Contents</title><link rel="stylesheet" href="//cdn.skypack.dev/yama-normalize" /></head><body><main><h1>2024 yamanoku's ActivityPub Contents</h1>${contentArray.join("\n")}</main></body></html>`;

// HTMLファイルに書き出す
await Bun.write("build/index.html", htmlContent);

await $`cp -r archive/media_attachments build/media_attachments`;