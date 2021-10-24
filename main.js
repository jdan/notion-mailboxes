const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

function concatenateText(arr) {
  return arr.map((i) => i.text.content).join("");
}

let mailboxes = [];
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

async function processAllMailboxes() {
  const remaining = await Promise.all(
    mailboxes.map(async ([block, inbox, outbox]) => {
      const inboxItems = await getAllChildren(inbox.id);
      if (inboxItems.length) {
        const item = inboxItems[0];
        await notion.blocks.delete({
          block_id: item.id,
        });
        await processItem(block, item);
        return inboxItems.length - 1;
      } else {
        return 0;
      }
    })
  );

  return remaining.some((count) => count > 0);
}

async function processItem(block, item) {
  const command = concatenateText(item.paragraph.text);
  if (command.startsWith("set text to ")) {
    await notion.blocks.update({
      block_id: block.id,
      [block.type]: {
        text: [
          {
            type: "text",
            text: {
              content: command.slice("set text to ".length),
            },
            annotations: block[block.type].text[0]
              ? block[block.type].text[0].annotations
              : [],
          },
        ],
      },
    });
  }

  if (command.startsWith("set color to")) {
    await notion.blocks.update({
      block_id: block.id,
      [block.type]: {
        text: block[block.type].text.map((text) => ({
          ...text,
          annotations: {
            ...text.annotations,
            color: command.slice("set color to ".length),
          },
        })),
      },
    });
  }
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

async function run() {
  async function loop() {
    // mailboxes get stale - a lot of API calls though
    mailboxes = [];
    await getAllMailboxes(process.env.NOTION_PAGE);
    const mailRemaining = await processAllMailboxes();
    if (mailRemaining) {
      await loop();
    }
  }

  await loop();
}

if (require.main === module) {
  (async () => {
    await run();
    console.log("All done!");
  })();
} else {
  module.exports = run;
}
