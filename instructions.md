# Practice Using Node.js by Creating a Localhost-Based Search Tool in VS Code

To search for a keyword in a directory of blog pages using JavaScript, you'll need to use a server-side language (such as Node.js) to read the content of the blog pages, as JavaScript alone cannot access the file system directly for security reasons.

## Step 1: Set up Node.js and create a new project directory

 - Make sure you have Node.js installed on your computer.
 - Create a new directory for your project and navigate into it, the initialize a new Node.js project within it by running the following commands in your terminal or command prompt:

```bash
mkdir blog_search
cd blog_search
npm init -y
```


## Step 2: Open your project's package.json file

 - Add the `"type": "module"` field at the top level of the package.json file. It should look like this:

```
json
{
  "name": "your_project_name",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    // Your project dependencies
  },
  "scripts": {
    // Your project scripts
  }
}
```


## Step 3: Install necessary packages

Use the below command to install the following packages, which are needed to handle reading files, searching for keywords, opening web pages, etc.:

```npm install fs url path http domino```

## Step 4: Create and write the search logic

 - Create a new JavaScript file (e.g., `search.js`) in the `blog_search` directory.
 - Write out the search logic in the `search.js` file.

## Step 5: Create mock blog pages

Create your mock blog pages. For example, you can create 3 mock pages named `blog_page_1.html`, `blog_page_2.html`, `blog_page_3.html`.

## Step 6: Create `index.html` file

Create your `index.html` file.

## Step 7: Run the `search.js` file

Run the `search.js` file with the following command:

```node search.js```


## Step 8: View the search page

Open your browser and go to `http://localhost:3000` to see the search page.


That's it! Now you can use the simple Node.js-based search tool to search for keywords in your blog pages. Happy searching!
