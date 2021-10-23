const { Client } = require("@notionhq/client");

const NOTION_SECRET = "secret_6N8i14byoy5Q9luOdvYkA1p0Lf1JtfBGXhidGl8TWGQ";
const NOTION_PAGE = "71fb14f581a244a2a16de7a2a8018be5";

const notion = new Client({
  auth: NOTION_SECRET,
});

function concatenateText(arr) {
  return arr.map((i) => i.text.content).join("");
}

const mailboxes = [];
async function getAllMailboxes(parentId) {
  const blocks = await getAllChildren(parentId);

  mailboxes.push(
    ...findSpanAll(blocks, [
      // any block
      (_) => true,
      // inbox
      (b) =>
        b.type === "toggle" && concatenateText(b.toggle.text).startsWith("📥"),
      // outbox
      (b) =>
        b.type === "toggle" && concatenateText(b.toggle.text).startsWith("📤"),
    ])
  );

  await Promise.all(
    blocks.map((block) => {
      if (block.type !== "unsupported" && block.has_children) {
        return getAllMailboxes(block.id);
      }
    })
  );
}

async function getAllChildren(parentId) {
  // todo: paginate
  const res = await notion.blocks.children.list({
    block_id: parentId,
    page_size: 100,
  });
  return res.results;
}

// findSpanAll(
//   [1, 2, 4, 5, 6, 8, 9, 11],
//   [(v) => v % 2 === 0, (v) => v % 2 === 1]
// )
// => [ [ 4, 5 ], [ 8, 9 ] ]
function findSpanAll(arr, predicates) {
  const res = [];
  for (let i = 0; i < arr.length - predicates.length + 1; i++) {
    if (predicates.every((fn, j) => fn(arr[i + j]))) {
      res.push(arr.slice(i, i + predicates.length));
    }
  }
  return res;
}

(async () => {
  await getAllMailboxes(NOTION_PAGE);
  console.log(mailboxes);
})();
