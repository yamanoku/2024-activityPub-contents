const commonHTMLHead = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="//cdn.skypack.dev/yama-normalize" />
`;

const commonHTMLFooter = `
    </main>
    <footer style="text-align: center">
        <p>© Copyright ${new Date().getFullYear()}, Okuto Oyama</p>
        <p>Source :<a href="https://github.com/yamanoku/2024-activityPub-contents/">yamanoku/2024-activityPub-contents</a></p>
    </footer>
</body>
</html>
`;

const indexHTMLContent = (contentArray: { [key: string]: string }) => `
${commonHTMLHead}
<title>2024 yamanoku's ActivityPub Contents</title>
</head>
<body>
    <main>
        <h1>2024 yamanoku's ActivityPub Contents</h1>
        <p>このページはyamanokuこと大山奥人がMastodonで投稿してきたログを収集したまとめページです。</p>
        <ul>
                ${Object.keys(contentArray)
                  .map(
                    (month) =>
                      `<li><a href="month-${month.padStart(
                        2,
                        "0"
                      )}.html">${month}月</a></li>`
                  )
                  .join("")}
        </ul>
        <p><a href="likes.html">ActivityPub Likes List</a></p>
${commonHTMLFooter}
`;

const monthHTMLContent = (month: string, contentArray: { [key: string]: string }) => `
${commonHTMLHead}
<title>2024 yamanoku's ActivityPub - ${month.padStart(2, "0")} Month</title>
</head>
<body>
    <main>
        <h1>2024 yamanoku's ActivityPub Contents - ${month.padStart(
          2,
          "0"
        )} Month</h1>
        ${contentArray[month]}
${commonHTMLFooter}
`;

const likeHTMLContent = (extractLikesContent: string[]) => `
${commonHTMLHead}
<title>2024 yamanoku's ActivityPub Likes List</title>
</head>
<body>
    <main>
        <h1>2024 yamanoku's ActivityPub Likes List</h1>
        <ul>
            ${extractLikesContent
              .map(
                (link) =>
                  `<li><a href="${link}" target="_blank">${link}</a></li>`
              )
              .join("")}
        </ul>
${commonHTMLFooter}
`;

export { indexHTMLContent, monthHTMLContent, likeHTMLContent };