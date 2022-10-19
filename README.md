<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url] -->


<h3 align="center">alisdairScraper</h3>

  <p align="center">
    Simple scraper to fetch data from a website and push the data to ReatailOps
    <br />
    <a href="https://github.com/atcervantes/alisdairScraper"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <!-- <a href="https://github.com/atcervantes/alisdairScraper">View Demo</a>
    ·
    <a href="https://github.com/atcervantes/alisdairScraper/issues">Report Bug</a>
    ·
    <a href="https://github.com/atcervantes/alisdairScraper/issues">Request Feature</a> -->
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <!-- <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Simple scraper to fetch data from a website and push the data to ReatailOps

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [node.js](http://nodejs.org/)
* [npm](https://www.npmjs.com/)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Download and install the following technologies:

* [node.js](https://nodejs.org/en/download/)

### Installation

1. Under the project folder install the NPM packages
   ```sh
   npm install
   ```
2. Enter your API in `index.js`
   ```js
    const API_KEY = 'ENTER YOUR API'
    const LOGIN_MAIL = 'ENTER YOUR USER NAME'
    const LOGIN_PASSWORD = 'ENTER YOUR PASSWORD'
   ```
3. Run the following command. The number after index.js is the page group that will be visited.
```
  node index.js 1
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

You can configure the pages that will be visited by adding them to the batch_1.conf or batch_2.conf files.
Currently they represent the categories from a specific website.

### Graphic Mode

You can turn on/off the UI to see how the Browser is scraping the website by toggling the property `headless` (true/false) in the file `index.js`.

```js
async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 250, // slow down by 250ms
        //defaultViewport: {width: 1920, height: 4000}
    });
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Angel Cervantes - [@atcervantes](https://twitter.com/atcervantes) - angel.cervantes.x@gmail.com

Project Link: [https://github.com/atcervantes/alisdairScraper](https://github.com/atcervantes/alisdairScraper)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
