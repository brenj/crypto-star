/* eslint no-undef:0 */
/* eslint func-names:0 */
/* eslint prefer-arrow-callback:0 */

const StarNotary = artifacts.require('StarNotary');
const REVERT_ERROR_MSG = 'VM Exception while processing transaction: revert';

contract('StarNotary', (accounts) => {
  beforeEach(async function () {
    this.contract = await StarNotary.new({ from: accounts[0] });
  });

  describe('can create a star', () => {
    it('can create a star and get its details', async function () {
      await this.contract.createStar(
        'awesome star!', 'dec_121.874', 'mag_245.978', 'ra_032.155',
        'awesome star story', 1, { from: accounts[0] });
      assert.deepEqual(
        await this.contract.tokenIdToStarInfo(1),
        [
          'awesome star!', 'dec_121.874', 'mag_245.978',
          'ra_032.155', 'awesome star story',
        ]);
    });
    it('can create two stars with different coordinates', async function () {
      await this.contract.createStar(
        'awesome star #1!', 'dec_121.874', 'mag_245.978', 'ra_032.155',
        'awesome star story #1', 1, { from: accounts[0] });
      assert.deepEqual(
        await this.contract.tokenIdToStarInfo(1),
        [
          'awesome star #1!', 'dec_121.874', 'mag_245.978',
          'ra_032.155', 'awesome star story #1',
        ]);

      await this.contract.createStar(
        'awesome star #2!', 'dec_121.875', 'mag_245.979', 'ra_032.156',
        'awesome star story #2', 2, { from: accounts[1] });
      assert.deepEqual(
        await this.contract.tokenIdToStarInfo(2),
        [
          'awesome star #2!', 'dec_121.875', 'mag_245.979',
          'ra_032.156', 'awesome star story #2',
        ]);
    });
    it('can\'t create two stars with same coordinates', async function () {
      await this.contract.createStar(
        'awesome star #1!', 'dec_121.874', 'mag_245.978', 'ra_032.155',
        'awesome star story #1', 1, { from: accounts[0] });

      let errorThrown;

      try {
        await this.contract.createStar(
          'awesome star #2!', 'dec_121.874', 'mag_245.978', 'ra_032.155',
          'awesome star story #2', 2, { from: accounts[1] });
      } catch (error) {
        errorThrown = error;
      }

      assert.notEqual(errorThrown, undefined, 'Error should be thrown');
      assert.isAbove(
        errorThrown.message.search(REVERT_ERROR_MSG),
        -1, `Error: ${REVERT_ERROR_MSG}`);
    });
  });

  describe('can buy and sell stars', () => {
    const user1 = accounts[1];
    const user2 = accounts[2];

    const tokenId = 1;
    const starPrice = web3.toWei(0.01, 'ether');

    beforeEach(async function () {
      await this.contract.createStar(
        'awesome star #1!', 'dec_121.874', 'mag_245.978', 'ra_032.155',
        'awesome star story #1', tokenId, { from: user1 });
    });

    it('can put up star for sale', async function () {
      assert.equal(await this.contract.ownerOf(tokenId), user1);
      await this.contract.putStarUpForSale(
        tokenId, starPrice, { from: user1 });

      assert.equal(await this.contract.starsForSale(tokenId), starPrice);
    });

    describe('can buy a star that was put up for sale', () => {
      beforeEach(async function () {
        await this.contract.putStarUpForSale(
          tokenId, starPrice, { from: user1 });
      });

      it('user2 is the owner of star after they buy it', async function () {
        await this.contract.buyStar(
          tokenId, { from: user2, value: starPrice, gasPrice: 0 });
        assert.equal(await this.contract.ownerOf(tokenId), user2);
      });

      it('user2 ether balance changed correctly', async function () {
        const overpaidAmount = web3.toWei(0.05, 'ether');
        const balanceBeforeTransaction = web3.eth.getBalance(user2);
        await this.contract.buyStar(
          tokenId, { from: user2, value: overpaidAmount, gasPrice: 0 });
        const balanceAfterTransaction = web3.eth.getBalance(user2);

        assert.equal(
          balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice);
      });
    });
  });

  describe('can check existence of a star', () => {
    const tokenId = 1;
    const nonexistentStarId = 2;

    beforeEach(async function () {
      await this.contract.createStar(
        'awesome star #1!', 'dec_121.874', 'mag_245.978', 'ra_032.155',
        'awesome star story #1', tokenId, { from: accounts[0] });
    });

    it('can check if star exists', async function () {
      assert.equal(await this.contract.checkIfStarExist(tokenId), true);
    });

    it('can check if star doesn\'t exist', async function () {
      assert.equal(
        await this.contract.checkIfStarExist(nonexistentStarId), false);
    });
  });

  describe('can mint a token', () => {
    const tokenId = 1;
    const user = accounts[0];

    let tx;

    beforeEach(async function () {
      tx = await this.contract.mint(tokenId, { from: user });
    });

    it('owner of tokenId is user', async function () {
      assert.equal(await this.contract.ownerOf(tokenId), user);
    });

    it('balance of user is incremented by 1', async function () {
      const balance = await this.contract.balanceOf(user);
      assert.equal(balance.toNumber(), 1);
    });

    it('emits correct event during minting of new token', async function () {
      assert.equal(tx.logs[0].event, 'Transfer');
    });
  });

  describe('can safely transfer token', () => {
    const tokenId = 1;
    const user1 = accounts[0];
    const user2 = accounts[1];

    let tx;

    beforeEach(async function () {
      await this.contract.mint(tokenId, { from: user1 });
      tx = await this.contract.safeTransferFrom(
        user1, user2, tokenId, { from: user1 });
    });

    it('token has new owner', async function () {
      assert.equal(await this.contract.ownerOf(tokenId), user2);
    });

    it('emits the correct event', async function () {
      assert.equal(tx.logs[0].event, 'Transfer');
      assert.equal(tx.logs[0].args.tokenId, tokenId);
      assert.equal(tx.logs[0].args.to, user2);
      assert.equal(tx.logs[0].args.from, user1);
    });
  });

  describe('can grant approval to transfer', () => {
    const tokenId = 1;
    const user1 = accounts[0];
    const user2 = accounts[1];

    let tx;

    beforeEach(async function () {
      await this.contract.mint(tokenId, { from: user1 });
      tx = await this.contract.approve(user2, tokenId, { from: user1 });
    });

    it('user can be set as an approved address', async function () {
      assert.equal(await this.contract.getApproved(tokenId), user2);
    });

    it('approved user can receive transfer', async function () {
      await this.contract.transferFrom(
        user1, user2, tokenId, { from: user2 });
      assert.equal(await this.contract.ownerOf(tokenId), user2);
    });

    it('emits the correct event during approval', async function () {
      assert.equal(tx.logs[0].event, 'Approval');
    });
  });

  describe('can set an operator', () => {
    const operator = accounts[0];
    const tokenId = 1;
    const user = accounts[1];

    beforeEach(async function () {
      await this.contract.mint(tokenId, { from: user });
      await this.contract.setApprovalForAll(operator, true, { from: user });
    });

    it('can set an operator and check approval status', async function () {
      assert.equal(
        await this.contract.isApprovedForAll(user, operator), true);
    });
  });

  describe('can utilize star contract mappings', () => {
    const tokenId = 1;
    const starPrice = web3.toWei(0.01, 'ether');
    const user = accounts[0];

    beforeEach(async function () {
      await this.contract.createStar(
        'awesome star!', 'dec_121.874', 'mag_245.978', 'ra_032.155',
        'awesome star story', tokenId, { from: user });
    });

    it('can get price of a star for sale', async function () {
      await this.contract.putStarUpForSale(
        tokenId, starPrice, { from: user });
      assert.equal(await this.contract.starsForSale(tokenId), starPrice);
    });

    it('can get star info by tokenId', async function () {
      assert.deepEqual(
        await this.contract.tokenIdToStarInfo(1),
        [
          'awesome star!', 'dec_121.874', 'mag_245.978',
          'ra_032.155', 'awesome star story',
        ]);
    });
  });
});
