// Returns the name of the default branch of the given repo.
// undefined if repo doesn't exist or some error while fetching.
const getDefaultBranchName = async (owner, repo) => {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    const data = await res.json();

    return data.default_branch;
  } catch (err) {
    console.log(err);
  }
};

// Returns the tree_sha of a given branch.
const getBranchTreeSha = async (owner, repo, branch) => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`
    );
    const data = await res.json();

    return data.commit.sha;
  } catch (err) {
    console.log(err);
  }
};

// Tree here refers to the list of all the files and subdirs
// inside the directory corresponding to the given tree_sha.
// Since recursive is set to true, it will also expand all the subdirs.
const getTree = async (owner, repo, tree_sha) => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${tree_sha}?recursive=true`
    );
    const data = await res.json();

    return data.tree;
  } catch (err) {
    console.log(err);
  }
};

const recGetDirectoryTree = (contents, curDir, owner, repo, branch) => {
  while (contents.length > 0) {
    const content = contents.pop();
    // All contents belong to the root directory
    // So for all other directories check if that content belongs to that directory
    if (curDir.path != "/" && !content.path.startsWith(`${curDir.path}/`)) {
      contents.push(content);
      break;
    }

    const name = content.path.split("/").pop();
    if (content.type === "tree") {
      const subDir = new Dir(name, content.path, curDir);
      curDir.addSubDir(subDir);
      recGetDirectoryTree(contents, subDir, owner, repo, branch);
    } else {
      const link = `https://github.com/${owner}/${repo}/blob/${branch}/${content.path}`;
      const file = new File_(name, content.path, link);
      curDir.addFile(file);
    }
  }
};

// Returns a tree corresponding to the directory structure.
const getDirectoryTree = async (owner, repo, branch) => {
  try {
    const tree_sha = await getBranchTreeSha(owner, repo, branch);

    const contents = await getTree(owner, repo, tree_sha);

    const root = new Dir("root", "/", undefined);
    // Note: passing the reversed array because pop() is faster than shift()
    recGetDirectoryTree(contents.reverse(), root, owner, repo, branch);

    return root;
  } catch (err) {
    console.log(err);
  }
};

// Returns the branch name of the current url.
// undefined if the url is not a repo or some error occurred.
const getBranchName = async (url, owner, repo) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;

    const data = url.split("/");
    if (data.length === 5) return await getDefaultBranchName(owner, repo);
    if (data.length === 6) return undefined;
    if (data[5] !== "blob" && data[5] !== "tree") return undefined;

    return data[6];
  } catch (err) {
    console.log(err);
  }
};
