import fs from 'fs'; // Import the 'fs' module which provides an API for interacting with the file system
import { fileURLToPath } from 'url'; // Import the 'fileURLToPath' function from the 'url' module which converts a file URL to a file path
import { join, dirname } from 'path'; // Import the 'join' and 'dirname' functions from the 'path' module which are used to construct file paths
import http from 'http'; // Import the 'http' module which provides an API for creating HTTP servers
import domino from 'domino'; // Import the 'domino' module which is a lightweight implementation of the W3C DOM intended for use with Node.js

// The 'searchKeywordInBlogPage' function takes the file path of a blog page and a keyword to search for as arguments
function searchKeywordInBlogPage(filePath, keyword) {
  const content = fs.readFileSync(filePath, 'utf8');
  const document = domino.createDocument(content);
  const bodyText = document.body.textContent.toLowerCase(); // Convert the body content to lowercase for case-insensitive search
  return bodyText.includes(keyword.toLowerCase());
}

// The 'searchKeywordInDirectory' function takes the path of a directory and a keyword to search for as arguments
function searchKeywordInDirectory(directoryPath, keyword) {
  const files = fs.readdirSync(directoryPath);

  const foundFiles = files.filter((file) => {
    const filePath = join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && filePath.endsWith('.html')) {
      return searchKeywordInBlogPage(filePath, keyword);
    }
    return false;
  });

  return foundFiles.map((file) => {
    return {
      title: file,
      url: `/blog/${file}`, // Serve the blog pages at the '/blog' route
    };
  });
}

// The '__filename' and '__dirname' variables are not available in ES modules, so we need to use the 'fileURLToPath' and 'dirname' functions to get the current file path and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an HTTP server that listens for requests and responds with the search results
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/search')) {
    const urlParams = new URLSearchParams(req.url.slice(req.url.indexOf('?') + 1));
    const keyword = urlParams.get('keyword');
    if (keyword) {
      const blogDirectory = join(__dirname, './'); // Set the blogDirectory to the current directory

      const foundBlogPages = searchKeywordInDirectory(blogDirectory, keyword);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(foundBlogPages));
    }
  } else if (req.url.startsWith('/blog')) {
    // Serve the blog pages from the '/blog' route
    const filePath = join(__dirname, req.url.replace('/blog', ''));
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream('./index.html').pipe(res);
  }
});

// Start the server on port 3000
const PORT = 3000; // You can change this to any desired port number
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});



//  *************  Below were ealier iterations of code**********************

// ================================================================
/* import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import cheerio from 'cheerio';
import http from 'http';

function searchKeywordInBlogPage(filePath, keyword) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const bodyText = $('body').text().toLowerCase(); // Convert the body content to lowercase for case-insensitive search
  return bodyText.includes(keyword.toLowerCase());
}

function searchKeywordInDirectory(directoryPath, keyword) {
  const files = fs.readdirSync(directoryPath);

  const foundFiles = files.filter((file) => {
    const filePath = join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && filePath.endsWith('.html')) {
      return searchKeywordInBlogPage(filePath, keyword);
    }
    return false;
  });

  return foundFiles.map((file) => {
    return {
      title: file,
      url: `/blog/${file}`, // Serve the blog pages at the '/blog' route
    };
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/search')) {
    const urlParams = new URLSearchParams(req.url.slice(req.url.indexOf('?') + 1));
    const keyword = urlParams.get('keyword');
    if (keyword) {
      const blogDirectory = join(__dirname, './'); // Set the blogDirectory to the current directory

      const foundBlogPages = searchKeywordInDirectory(blogDirectory, keyword);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(foundBlogPages));
    }
  } else if (req.url.startsWith('/blog')) {
    // Serve the blog pages from the '/blog' route
    const filePath = join(__dirname, req.url.replace('/blog', ''));
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream('./index.html').pipe(res);
  }
});

const PORT = 3000; // You can change this to any desired port number
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
}); */

// ================================================================

/* 
import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import cheerio from 'cheerio';
import http from 'http';

function searchKeywordInBlogPage(filePath, keyword) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const bodyText = $('body').text().toLowerCase(); // Convert the body content to lowercase for case-insensitive search
  return bodyText.includes(keyword.toLowerCase());
}

function searchKeywordInDirectory(directoryPath, keyword) {
  const files = fs.readdirSync(directoryPath);

  const foundFiles = files.filter((file) => {
    const filePath = join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && filePath.endsWith('.html')) {
      return searchKeywordInBlogPage(filePath, keyword);
    }
    return false;
  });

  return foundFiles.map((file) => {
    return {
      title: file,
      url: `/${file}`, // Use relative URLs instead of absolute file paths
    };
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/search')) {
    const urlParams = new URLSearchParams(req.url.slice(req.url.indexOf('?') + 1));
    const keyword = urlParams.get('keyword');
    if (keyword) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const blogDirectory = join(__dirname, './'); // Set the blogDirectory to the current directory

      const foundBlogPages = searchKeywordInDirectory(blogDirectory, keyword);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(foundBlogPages));
    }
  } else {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream('./index.html').pipe(res);
  }
});

const PORT = 3000; // You can change this to any desired port number
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
}); */


// ================================================================
/* import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import cheerio from 'cheerio';
import http from 'http';

function searchKeywordInBlogPage(filePath, keyword) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const bodyText = $('body').text().toLowerCase(); // Convert the body content to lowercase for case-insensitive search
  return bodyText.includes(keyword.toLowerCase());
}

function searchKeywordInDirectory(directoryPath, keyword) {
  const files = fs.readdirSync(directoryPath);

  const foundFiles = files.filter((file) => {
    const filePath = join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && filePath.endsWith('.html')) {
      return searchKeywordInBlogPage(filePath, keyword);
    }
    return false;
  });

  return foundFiles.map((file) => {
    return {
      title: file,
      url: `file://${directoryPath}/${file}`,
    };
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/search')) {
    const urlParams = new URLSearchParams(req.url.slice(req.url.indexOf('?') + 1));
    const keyword = urlParams.get('keyword');
    if (keyword) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const blogDirectory = join(__dirname, './'); // Set the blogDirectory to the current directory

      const foundBlogPages = searchKeywordInDirectory(blogDirectory, keyword);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(foundBlogPages));
    }
  } else {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream('./index.html').pipe(res);
  }
});

const PORT = 3000; // You can change this to any desired port number
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
 */

// ================================================================

/* To enable the user to click on the name of the result returned in the command line and open the blog page, we need 
to implement a way to capture mouse clicks in the terminal. However, capturing mouse clicks directly from the 
terminal is not straightforward in Node.js, as it requires specialized terminal emulators and packages.

An alternative approach is to number the search results and allow the user to enter the number corresponding 
to the result they want to open. We'll modify the code to display the results with numbers, prompt the user 
to enter a number, and then open the selected blog page in the default browser.

Here's how you can implement this functionality: */

/* import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import cheerio from 'cheerio';
import readline from 'readline';
import { spawn } from 'child_process'; // Import the 'spawn' function from the 'child_process' module

function searchKeywordInBlogPage(filePath, keyword) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const bodyText = $('body').text().toLowerCase(); // Convert the body content to lowercase for case-insensitive search
  return bodyText.includes(keyword.toLowerCase());
}

function searchKeywordInDirectory(directoryPath, keyword) {
  const files = fs.readdirSync(directoryPath);

  const foundFiles = files.filter((file) => {
    const filePath = join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && filePath.endsWith('.html')) {
      return searchKeywordInBlogPage(filePath, keyword);
    }
    return false;
  });

  return foundFiles;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the keyword you want to search for: ", (userKeyword) => {
  const keyword = userKeyword.trim(); // Use the user input as the keyword

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const blogDirectory = join(__dirname, './'); // Set the blogDirectory to the current directory

  const foundBlogPages = searchKeywordInDirectory(blogDirectory, keyword);

  console.log("Found blog pages containing the keyword:");
  foundBlogPages.forEach((blogPage, index) => {
    const blogPageUrl = `file://${blogDirectory}/${blogPage}`;
    console.log(`[${index + 1}] \x1b[34m\x1b[1m${blogPage}\x1b[0m`); // Display the result with a number (colored blue and bold)
  });

  // Listen for the user to enter a number to select a result
  rl.question("Enter the number of the blog page you want to open (or press Enter to exit): ", (userChoice) => {
    const choice = parseInt(userChoice, 10);

    if (!isNaN(choice) && choice > 0 && choice <= foundBlogPages.length) {
      const selectedBlogPage = foundBlogPages[choice - 1];
      const blogPageUrl = `file://${blogDirectory}/${selectedBlogPage}`;
      console.log(`Opening ${selectedBlogPage} in the default browser...`);
      spawn(/^win/.test(process.platform) ? 'start' : 'xdg-open', [blogPageUrl]);
    } else {
      console.log("Invalid input or no selection made. Exiting...");
    }

    rl.close();
  });
});
 */

// ================================================================
/* import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import cheerio from 'cheerio';
import readline from 'readline';
import { spawn } from 'child_process'; // Import the 'spawn' function from the 'child_process' module

function searchKeywordInBlogPage(filePath, keyword) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const bodyText = $('body').text().toLowerCase(); // Convert the body content to lowercase for case-insensitive search
  return bodyText.includes(keyword.toLowerCase());
}

function searchKeywordInDirectory(directoryPath, keyword) {
  const files = fs.readdirSync(directoryPath);

  const foundFiles = files.filter((file) => {
    const filePath = join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && filePath.endsWith('.html')) {
      return searchKeywordInBlogPage(filePath, keyword);
    }
    return false;
  });

  return foundFiles;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the keyword you want to search for: ", (userKeyword) => {
  const keyword = userKeyword.trim(); // Use the user input as the keyword

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const blogDirectory = join(__dirname, './'); // Set the blogDirectory to the current directory

  const foundBlogPages = searchKeywordInDirectory(blogDirectory, keyword);

  console.log("Found blog pages containing the keyword:");
  foundBlogPages.forEach((blogPage) => {
    const blogPageUrl = `file://${blogDirectory}/${blogPage}`;
    console.log(`\x1b[34m\x1b[1m${blogPageUrl}\x1b[0m`); // Display the link as clickable text (colored blue and bold)

    // Listen for the user to press any key
    rl.question("Press any key to open this link in your default browser...", () => {
      // Use the 'spawn' function to open the URL in the default browser
      spawn(/^win/.test(process.platform) ? 'start' : 'xdg-open', [blogPageUrl]);
      rl.close();
    });
  });
});
 */

// ================================================================
/* import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import cheerio from 'cheerio';
import readline from 'readline';

function searchKeywordInBlogPage(filePath, keyword) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const bodyText = $('body').text().toLowerCase(); // Convert the body content to lowercase for case-insensitive search
  return bodyText.includes(keyword.toLowerCase());
}

function searchKeywordInDirectory(directoryPath, keyword) {
  const files = fs.readdirSync(directoryPath);

  const foundFiles = files.filter((file) => {
    const filePath = join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && filePath.endsWith('.html')) {
      return searchKeywordInBlogPage(filePath, keyword);
    }
    return false;
  });

  return foundFiles;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the keyword you want to search for: ", (userKeyword) => {
  const keyword = userKeyword.trim(); // Use the user input as the keyword

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const blogDirectory = join(__dirname, './'); // Set the blogDirectory to the current directory

  const foundBlogPages = searchKeywordInDirectory(blogDirectory, keyword);

  console.log("Found blog pages containing the keyword:");
  console.log(foundBlogPages);

  rl.close();
});
 */
// ================================================================

/* import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import cheerio from 'cheerio';

const keyword = 'third'; // Replace this with the keyword you want to search for

function searchKeywordInBlogPage(filePath, keyword) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const bodyText = $('body').text().toLowerCase(); // Convert the body content to lowercase for case-insensitive search
  return bodyText.includes(keyword.toLowerCase());
}

function searchKeywordInDirectory(directoryPath, keyword) {
  const files = fs.readdirSync(directoryPath);

  const foundFiles = files.filter((file) => {
    const filePath = join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && filePath.endsWith('.html')) {
      return searchKeywordInBlogPage(filePath, keyword);
    }
    return false;
  });

  return foundFiles;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const blogDirectory = join(__dirname, './'); // Set the blogDirectory to the current directory

const foundBlogPages = searchKeywordInDirectory(blogDirectory, keyword);

console.log("Found blog pages containing the keyword:");
console.log(foundBlogPages);
 */