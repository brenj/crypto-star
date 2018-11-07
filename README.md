Decentralized Star Notary
=========================

About
-----

From Udacity:
> In this project you will build a smart contract, create a notary service, and deploy it on Ethereum blockchain. You will then use this API to notarize your favorite star. This service can be extended to notarize any digital asset such as a document, agreement, or media.

Supporting courses:
* Identity and Smart Contracts

Requirements
------------
* Node
* Node Package Manager (npm)

Install & Run
-------------
1. `npm install`
2. `truffle test`
3. `npm run web`

Code Organization
-----------------
```console
├── README.md
├── build
│   └── contracts
│       ├── Address.json
│       ├── ERC165.json
│       ├── ERC721.json
│       ├── IERC165.json
│       ├── IERC721.json
│       ├── IERC721Receiver.json
│       ├── Migrations.json
│       ├── SafeMath.json
│       └── StarNotary.json
├── contracts
│   ├── Migrations.sol
│   └── StarNotary.sol
├── migrations
│   ├── 1_initial_migration.js
│   └── 2_star_notary_migration.js
├── package-lock.json
├── package.json
├── test
│   └── StarNotaryTest.js
├── truffle-config.js
├── truffle.js
└── web
    ├── css
    │   ├── normalize.css
    │   └── skeleton.css
    ├── images
    │   └── favicon.png
    └── index.html

8 directories, 23 files
```

Screenshot
----------


Grading (by Udacity)
--------------------

Criteria                  |Highest Grade Possible  |Grade Recieved
--------------------------|------------------------|--------------
Smart Contract            |Meets Specifications    |
Test Smart Contract       |Meets Specifications    |
Deploy Smart Contract     |Meets Specifications    |
Modify Client Code        |Meets Specifications    |
