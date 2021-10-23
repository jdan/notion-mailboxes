## notion-mailboxes

What if notion blocks had email?

![mailboxes](https://user-images.githubusercontent.com/287268/138564098-b5f2cc7f-d436-4872-85b1-54b35cdef4ee.gif)

### usage

- [Create a new Notion integration](https://developers.notion.com/docs/getting-started#step-1-create-an-integration)
- Create a new page and note it's ID from the address bar
  - `https://www.notion.so/[username]/Title-text-[your page ID, copy this!]`
- [Share the page with your new integration](https://developers.notion.com/docs/getting-started#step-2-share-a-database-with-your-integration)
- Run the script

```sh
git clone https://github.com/jdan/notion-mailboxes.git
cd notion-mailboxes
npm i
NOTION_SECRET=[your token here] NOTION_PAGE_ID=[your id here] node main.js
# watch it do its thing
```

### frontend

A small frontend exists so you can place a "Process" button in an embed block
and click it.

Run it locally with `NOTION_SECRET=... NOTION_PAGE=... vercel dev`. You'll need to deploy it
if you want to use an embed, though (can't embed localhost)

![image](https://user-images.githubusercontent.com/287268/138574393-a50bd1cd-bedb-4a4c-ba9e-94ff53548066.png)
