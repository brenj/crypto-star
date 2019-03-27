Crypto Star
===========

About
-----

From Udacity:
> In this project you will build a smart contract, create a notary service, and deploy it on Ethereum blockchain. You will then use this API to notarize your favorite star. This service can be extended to notarize any digital asset such as a document, agreement, or media.

Supporting courses:
* Identity and Smart Contracts

Deployment to Rinkeby
---------------------
```console
$> truffle deploy --reset --network rinkeby
Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0xe1ef6c4ecb1b2b58a4ebb7ba77d72177566ce81e08eab05243c102fda8073466
  Migrations: 0x931a0172ef4898969c6ef32d3b4cddd4440e35cc
Saving successful migration to network...
  ... 0x92e350ead3f80ea01629cd1d247f07377f7a733ba3d75d82c4e7dfc58c13832f
Saving artifacts...
Running migration: 2_star_notary_migration.js
  Replacing StarNotary...
  ... 0x6043fe89f8dd90d60e651ba3e2e2bd847798c0e018ea139c7967ab343c077b2d
  StarNotary: 0x26c6ea538b9627ef68bc98e1a06b2c6923884779
Saving successful migration to network...
  ... 0x55eea72defe069e5e6089ae3b4a3814c8ef8f08f223280b72c35e44f5fdf8251
Saving artifacts...

$> truffle networks

Network: rinkeby (id: 4)
  Migrations: 0x931a0172ef4898969c6ef32d3b4cddd4440e35cc
  StarNotary: 0x26c6ea538b9627ef68bc98e1a06b2c6923884779
```

Requirements
------------
* Node
* Node Package Manager (npm)

Install & Run
-------------
1. `npm install`
2. `truffle test`
3. `npm run web`

Screenshot
----------
![Web Screenshot](/web_screenshot.png?raw=true)

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

Grading (by Udacity)
--------------------

Criteria                  |Highest Grade Possible  |Grade Recieved
--------------------------|------------------------|--------------
Smart Contract            |Meets Specifications    |Meets Specifications
Test Smart Contract       |Meets Specifications    |Meets Specifications
Deploy Smart Contract     |Meets Specifications    |Meets Specifications
Modify Client Code        |Meets Specifications    |Meets Specifications
