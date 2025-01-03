import { $ } from "bun";
import { indexHTMLContent, monthHTMLContent, likeHTMLContent } from "./lib/htmlParts";

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

type LikeDataType = {
  orderedItems: string[];
};

const OUTBOX_JSON_DATA: DataType = await Bun.file(
  "./archive/outbox.json"
).json();

const LINKS_JSON_DATA: LikeDataType = await Bun.file(
  "./archive/likes.json"
).json();

const extractContent = (data: DataType) => {
  const monthData: { [key: string]: string } = {};
  data.orderedItems.forEach((item) => {
    let content = item.object.content;
    if (!content) {
      return;
    }
    if (item.object.summary !== null) {
      content = `<details><summary>${item.object.summary}</summary>${content}</details>`;
    }
    const published = item.published;
    if (item.object.attachment.length > 0) {
      item.object.attachment.forEach((attachment) => {
        content += `<div><img src="/2024-activityPub-contents${attachment.url}" alt="${attachment.name}"></div>`;
      });
    }
    const url = item.object.url;
    const month = new Date(published).getMonth() + 1;
    if (!monthData[month]) {
      monthData[month] = "";
    }
    monthData[month] += `
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
  });
  return monthData;
};

const extractLikesContent = (data: LikeDataType) => {
  const likesData: string[] = [];
  data.orderedItems.forEach((item) => {
    likesData.push(item);
  });
  return likesData;
};

const contentArray = extractContent(OUTBOX_JSON_DATA);
const likesArray = extractLikesContent(LINKS_JSON_DATA);

await $`rm -rf build`;

await Bun.write("build/index.html", indexHTMLContent(contentArray));

for (const month in contentArray) {
  await Bun.write(
    `build/month-${month.padStart(2, "0")}.html`,
    monthHTMLContent(month, contentArray)
  );
}

await Bun.write("build/likes.html", likeHTMLContent(likesArray));

await $`cp -r archive/media_attachments build/media_attachments`;
