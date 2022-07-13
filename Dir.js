class Dir {
  #name;
  #path;
  #parent;
  #isOpen = false;
  #subDirs = [];
  #files = [];

  constructor(name, path, parent) {
    this.#name = name;
    this.#path = path;
    this.#parent = parent;
  }

  get name() {
    return this.#name;
  }

  get path() {
    return this.#path;
  }

  get parent() {
    return this.#parent;
  }

  get subDirs() {
    return this.#subDirs;
  }

  get files() {
    return this.#files;
  }

  get isOpen() {
    return this.#isOpen;
  }

  toggle() {
    this.#isOpen = !this.#isOpen;
    return this.render();
  }

  folderIcon() {
    const icon = document.createElement("i");

    if (this.isOpen) icon.classList.add("fas", "fa-folder-open");
    else icon.classList.add("fas", "fa-folder");

    return icon;
  }

  arrowIcon() {
    const icon = document.createElement("i");

    if (this.isOpen) icon.classList.add("fas", "fa-angle-down");
    else icon.classList.add("fas", "fa-angle-right");

    return icon;
  }

  addSubDir(subDir) {
    if (!(subDir instanceof Dir)) throw new Error("Not an instance of Dir");

    this.#subDirs.push(subDir);
  }

  addFile(file) {
    if (!(file instanceof File_)) throw new Error("Not an instance of File");

    this.#files.push(file);
  }

  // Returns an 'li' element which contains the current directory
  // and an 'ul' which contains the subdirectories and files in the
  // current directory if it is open.
  render() {
    const curDir = document.createElement("li");
    if (this.parent) curDir.style.paddingLeft = "1rem";
    curDir.append(this.arrowIcon(), " ", this.folderIcon(), " ");

    const folderToggler = document.createElement("span");
    folderToggler.classList.add("repo-folders");
    folderToggler.append(this.name);

    folderToggler.addEventListener("click", () => {
      // Here 'this' refers to the current 'Dir' object.
      const newChild = this.toggle();
      curDir.parentElement.replaceChild(newChild, curDir);
    });

    curDir.appendChild(folderToggler);

    if (!this.isOpen) return curDir;

    // 'ul' to hold the contents of the current directory.
    const contents = document.createElement("ul");
    curDir.appendChild(contents);

    for (const subDir of this.subDirs) {
      contents.appendChild(subDir.render());
    }

    for (const file of this.files) {
      const content = document.createElement("li");
      content.style.paddingLeft = "1.85rem";
      content.append(file.fileIcon(), " ");

      const link = document.createElement("a");
      link.classList.add("repo-files");
      // Github supports pjax => push_state + ajax. So, we make use of it.
      // This gives better user experience because only the parts of the
      // page are re-rendered as opposed to the whole page. It keeps track
      // of the state to provide functional arrow keys.
      link.setAttribute("data-pjax", "#repo-content-pjax-container");
      link.setAttribute("data-turbo-frame", "repo-content-turbo-frame");
      link.setAttribute("href", file.link);
      link.append(file.name);

      content.appendChild(link);
      contents.appendChild(content);
    }

    return curDir;
  }
}
