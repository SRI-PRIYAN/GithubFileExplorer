const newBody = `<nav id="navbar">
                  <header>
                    <h4 id="nav-title"></h4>
                    <span id="nav-branch">
                      <i class="fas fa-code-branch"></i>
                    </span>
                  </header>
                  <ul id="file-explorer"></ul>
                </nav>
                <div id="others">
                  <div id="resizer"></div>
                  ${document.body.innerHTML}
                </div>`;

const main = async () => {
  const [owner, repo] = document.baseURI.split("/").slice(3, 5);

  const branch = await getBranchName(document.baseURI, owner, repo);
  if (!branch) return;

  document.body.innerHTML = newBody;
  const others = document.getElementById("others");
  const navbar = document.getElementById("navbar");
  const explorer = document.getElementById("file-explorer");
  const resizer = document.getElementById("resizer");

  const scrollBarWidth = window.innerWidth - document.body.offsetWidth;
  others.style.width = `calc(80vw - ${scrollBarWidth}px)`;
  others.style.minWidth = `calc(70vw - ${scrollBarWidth}px)`;

  document.getElementById("nav-title").append(`${owner} / ${repo}`);
  document.getElementById("nav-branch").append(` ${branch}`);

  const root = await getDirectoryTree(owner, repo, branch);
  if (!root) return;

  explorer.appendChild(root.toggle());

  let x;
  resizer.addEventListener("mousedown", (event) => {
    document.body.style.cursor = "ew-resize";
    x = event.clientX;
    document.addEventListener("mousemove", mousemoveHandler);
    document.addEventListener("mouseup", mouseupHandler);
  });

  const mousemoveHandler = (event) => {
    navbar.style.userSelect = "none";
    others.style.userSelect = "none";

    const dx = event.clientX - x;
    navbar.style.width = `${navbar.offsetWidth + dx}px`;
    others.style.width = `${others.offsetWidth - dx}px`;
    x = event.clientX;
  };

  const mouseupHandler = (event) => {
    document.body.style.removeProperty("cursor");
    navbar.style.removeProperty("user-select");
    others.style.removeProperty("user-select");

    document.removeEventListener("mousemove", mousemoveHandler);
    document.removeEventListener("mouseup", mouseupHandler);
  };
};

main().catch(console.log);
