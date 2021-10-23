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
