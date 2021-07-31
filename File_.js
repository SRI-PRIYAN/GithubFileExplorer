class File_ {
  #name;
  #path;
  #link;
  constructor(name, path, link) {
    this.#name = name;
    this.#path = path;
    this.#link = link;
  }

  get name() {
    return this.#name;
  }

  get path() {
    return this.#path;
  }

  get link() {
    return this.#link;
  }

  fileIcon() {
    const icon = document.createElement("i");
    icon.classList.add("far", "fa-file-code");

    return icon;
  }
}
