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

const OUTBOX_JSON_DATA: DataType = (await Bun.file(
  "./archive/outbox.json"
).json());

const extractContent = (data: DataType) => {
  const monthData: { [key: string]: string } = {};
  data.orderedItems.forEach(
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
    }
  );
  return monthData;
};

const contentArray = extractContent(OUTBOX_JSON_DATA);

const indexHTMLContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2024 yamanoku's ActivityPub Contents</title>
  <link rel="stylesheet" href="//cdn.skypack.dev/yama-normalize" />
</head>
<body>
  <main>
    <h1>2024 yamanoku's ActivityPub Contents</h1>
    <ul>
        ${Object.keys(contentArray)
        .map(
            (month) =>
            `<li><a href="month-${month.padStart(2, "0")}.html">${month}月</a></li>`
        )
        .join("")}
    </ul>
  </main>
  <footer style="text-align: center"><p>© Copyright ${new Date().getFullYear()}, Okuto Oyama</p><p>Source :<a href="https://github.com/yamanoku/2024-activityPub-contents/">yamanoku/2024-activityPub-contents</a></p></footer>
</body>
</html>
`;

const monthHTMLContent = (month: string) => `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2024 yamanoku's ActivityPub Contents - ${month} Month</title>
  <link rel="stylesheet" href="//cdn.skypack.dev/yama-normalize" />
</head>
<body>
  <main>
    <h1>2024 yamanoku's ActivityPub Contents - ${month} Month</h1>
    ${contentArray[month]}
  </main>
  <footer style="text-align: center"><p>© Copyright ${new Date().getFullYear()}, Okuto Oyama</p><p>Source :<a href="https://github.com/yamanoku/2024-activityPub-contents/">yamanoku/2024-activityPub-contents</a></p></footer>
</body>
</html>
`;

await Bun.write("build/index.html", indexHTMLContent);

for (const month in contentArray) {
  await Bun.write(`build/month-${month.padStart(2, "0")}.html`, monthHTMLContent(month));
}

await $`cp -r archive/media_attachments build/media_attachments`;