module.exports = (req, res) => {
  res.send(`
    <head>
      <style>
        body {
          background: white;
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          align-items: center;
        }

        button {
          user-select: none;
          cursor: pointer;
          border-radius: 4px;
          color: white;
          line-height: 1.2;
          background: rgb(46, 170, 220) none repeat scroll 0% 0%;
          padding: 12px 8px;
          font-size: 18px;
          font-weight: 500;
          border: none;
          font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
        }
      </style>
    </head>

    <body>
      <button>Process mail</button>
      <script>
        const btn = document.querySelector("button")
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          btn.innerHTML = "Processing...";
          btn.disabled = true;

          fetch("/api/process")
            .then(res => res.json())
            .then((data) => {
              btn.innerHTML = "Process mail";
              btn.disabled = false;
            })
        })
      </script>
    </body>
  `);
};
