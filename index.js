const fs = require('fs');
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');
const puppeteer = require('puppeteer');
const generateHTML = require('./generateHTML');
const writeFileAsync = util.promisify(fs.writeFile);

let img = '';
let location = '';
let gitProfile = '';
let userBlog = '';
let userBio = '';
let repoNum = 0;
let followers = 0;
let following = 0;
let starNum = 0;
let color = '';

// initialize
function init() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Input your GitHub User Name: ',
        name: 'username'
      },
      {
        type: 'input',
        message:
          'What color do you want to use as your theme green/red/pink/blue?',
        name: 'color'
      }
    ])
    .then(function({ username, color }) {
      // setup axios config to get data from github api
      const config = {
        headers: {
          accept: 'application/json'
        }
      };

      // Get GitHub API data by the axios get method
      let queryUrl = `https://api.github.com/users/${username}`;

      return axios.get(queryUrl, config).then(userData => {
        let newUrl = `https://api.github.com/users/${username}/starred`;

        axios.get(newUrl, config).then(starredRepos => {
          data = {
            img: userData.data.avatar_url,
            location: userData.data.location,
            gitProfile: userData.data.html_url,
            userBlog: userData.data.blog,
            userBio: userData.data.bio,
            repoNum: userData.data.public_repos,
            followers: userData.data.followers,
            following: userData.data.following,
            starNum: starredRepos.data.length,
            username: username,
            color: color
          };
          console.log(data);
          // Function call
          generateHTML(data);
          creatHTML(generateHTML(data));
          generatePDF(username);
        });
      });
    });
}

// Create index.html file using generateHTML.js
const creatHTML = function(generateHTML) {
  writeFileAsync('index.html', generateHTML);
};

init();

// generatePDF Funcion puppeteer accoding to puppeteer guide line
async function generatePDF(username) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // setup index.html file location
    await page.goto(
      'file:///D:/ToTo/Berkeley_bootcamp/Homework/homework-8/index.html'
    );
    await page.emulateMediaType('screen');

    // setup puppeteer pdf generation options
    await page.pdf({
      path: `${username}.pdf`,
      format: 'Letter',
      printBackground: true,
      landscape: true
    });
    console.log('Generated PDF sucessfully !');

    await browser.close();
  } catch (err) {
    console.log('Oh no no no! PDF generate error !!!');
  }
}
