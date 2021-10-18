const { signTitle, loadWeb3 } = require("../src/sign");

const LandTitle = artifacts.require("LandTitle");
// const { titles: TitleStruct, isDefined, isPayable, isType } = require("./ast-helper");

contract("LandTitle",  ( accounts ) => {
  const [_owner, alice, bob] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  const ID = "Special Key";
  const size = 2000 ; // in square feet
  const location = "location string";
  const image = "image url";

  describe('deployment', () => {
    it("should assert true", async () => {
      await LandTitle.deployed();
      return assert.isTrue(true);
    });
  });

  let instance;
  beforeEach(async () => {
    instance = await LandTitle.new();
  });

  describe("Variables", () => {
    it("should have a registryAddress", async () => {
      assert.equal(typeof instance.registryAddress, 'function', "the contract has no registryAddress");
    });

    it("should have an ownerAddress", async () => {
      assert.equal(typeof instance.owner, 'function', "the contract has no owner address");
    });

    it("should have a registryFee", async () => {
      assert.equal(typeof instance.registryFee, 'function', "the contract has no registryFee");
    });

    it("should have a tranferFee", async () => {
      assert.equal(typeof instance.transferFee, 'function', "the contract has no transferFee");
    });

    describe("enum State", () => {
      let enumState;
      before(() => {
        enumState = LandTitle.enums.State;
        assert(
          enumState,
          "The contract should define an Enum called State"
        );
      });

      it("should define `ToBeRegistered`", () => {
        assert(
          enumState.hasOwnProperty('ToBeRegistered'),
          "The enum does not have a `ToBeRegistered` value"
        );
      });

      it("should define `Signed`", () => {
        assert(
          enumState.hasOwnProperty('Signed'),
          "The enum does not have a `Signed` value"
        );
      });

      it("should define `Registered`", () => {
        assert(
          enumState.hasOwnProperty('Registered'),
          "The enum does not have a `Registered` value"
        );
      });

      it("should define `ToBeTransfered`", () => {
        assert(
          enumState.hasOwnProperty('ToBeTransfered'),
          "The enum does not have a `ToBeTransfered` value"
        );
      });

      it("should define `Transfered`", () => {
        assert(
          enumState.hasOwnProperty('Transfered'),
          "The enum does not have a `Transfered` value"
        );
      });
    })

    describe("Title struct", () => {
      let subjectStruct;

      let result
      before(async () => {
        await instance.addTitle(ID, size, location, image, { from: alice });
        result = await instance.fetchTitle.call(0);
        assert(
          result !== null, 
          "The contract should define a `Title Struct`"
        );
      });

      it("should have a `ID`", () => {
        assert(
          result.ID,
          "Struct Title should have an `ID` member"
        );
        assert.equal(
          typeof result.ID, 
          'string', 
          "`ID` should be of type `string`");
      });

      it("should have a `currOwner`", () => {
        assert(
          result.currOwner,
          "Struct Title should have a `currOwner` member"
        );
        assert.equal(
          typeof result.currOwner, 
          'adrress', 
          "`currOwner` should be of type `address`"
        );
        // assert.equal(
        //   result.currOwner, 
        //   'payable', 
        //   "`currOwner` should be payable"
        // );
        // assert(
        //   isPayable(subjectStruct)("currOwner"), 
        //   "`currOwner` should be payable"
        // );
      });

      it("should have a `size`", () => {
        assert(
          result.size,
          "Struct Title should have a `size` member"
        );
        assert.equal(
          typeof result.size, 
          'uint', 
          "`size` should be of type `uint`"
        );
      });

      it("should have a `location`", () => {
        assert(
          result.location,
          "Struct Title should have a `location` member"
        );
        assert.equal(
          typeof result.location, 
          'string', 
          "`location` should be of type `string`"
        );
      });

      it("should have an `image`", () => {
        assert(
          result.image,
          "Struct Title should have a `image` member"
        );
        assert.equal(
          typeof result.image, 
          'string', 
          "`image` should be of type `string`"
        );
      });

      it("should have a `state`", () => {
        assert(
          result.state,
          "Struct Item should have a `state` member"
        );
        assert.equal(
          typeof result.state, 
          'State', 
          "`state` should be of type `State`"
        );
      });
    });

    describe("Use cases", () => {
      it("should add a Land Title with the validated keycode as an ID, and prepopuldated values", async () => {
        await instance.addTitle(ID, size, location, image, { from: alice });
  
        const result = await instance.fetchTitle.call(0);
  
        assert.equal(
          result[0],
          ID,
          "the ID of the last added Land Title does not match the expected value",
        );
        // assert.equal(
        //   result[2],
        //   currOwner,
        //   "the currOwner address should be set to the currOwner when a Land Title is added",
        // );
        assert.equal(
          result[3].toString(10),
          size,
          "the size of the last added Land Title does not match the expected value",
        );
        assert.equal(
          result[4],
          location,
          "the location of the last added Land Title does not match the expected value",
        );
        assert.equal(
          result[5],
          image,
          "the image of the last added Land Title does not match the expected value",
        );
        assert.equal(
          result[6].toString(10),
          LandTitle.State.ToBeRegistered,
          'the state of the item should be "To Be Registered"',
        );
      });
  
      it("should emit a LogToBeRegistered event when a Land Title is added", async () => {
        let eventEmitted = false;
        const tx = await instance.addTitle(ID, size, location, image, { from: alice });
  
        if (tx.logs[0].event == "LogToBeRegistered") {
          eventEmitted = true;
        }
  
        assert.equal(
          eventEmitted,
          true,
          "adding a Land Title should emit a LogToBeRegistered event",
        );
      });
  
      it.skip("should check that the currOwner signed the title", async () => {
        await instance.addTitle(ID, size, location, image, { from: alice });
        var aliceBalanceBefore = await web3.eth.getBalance(alice);
        var bobBalanceBefore = await web3.eth.getBalance(bob);
        await loadWeb3();
        await signTitle(alice,2,ID, _owner, { from: bob });
  
        var aliceBalanceAfter = await web3.eth.getBalance(alice);
        var bobBalanceAfter = await web3.eth.getBalance(bob);
  
        const result = await instance.fetchItem.call(0);
  
        assert.equal(
          result[6].toString(10),
          LandTitle.State.Signed,
          'the state of the title should be "Signed"',
        );
  
        // assert.equal(
        //   result[5],
        //   bob,
        //   "the buyer address should be set bob when he purchases an item",
        // );
  
        // assert.equal(
        //   new BN(aliceBalanceAfter).toString(),
        //   new BN(aliceBalanceBefore).add(new BN(price)).toString(),
        //   "alice's balance should be increased by the price of the item",
        // );
  
        // assert.isBelow(
        //   Number(bobBalanceAfter),
        //   Number(new BN(bobBalanceBefore).sub(new BN(price))),
        //   "bob's balance should be reduced by more than the price of the item (including gas costs)",
        // );
      });

      it.skip("should allow the currOwner to encrypt the signed Land Title", async () => {
        await instance.addTitle(ID, size, location, image, { from: alice });
        var aliceBalanceBefore = await web3.eth.getBalance(alice);
        var bobBalanceBefore = await web3.eth.getBalance(bob);
  
        await instance.buyItem(0, { from: bob, value: excessAmount });
  
        var aliceBalanceAfter = await web3.eth.getBalance(alice);
        var bobBalanceAfter = await web3.eth.getBalance(bob);
  
        const result = await instance.fetchItem.call(0);
  
        assert.equal(
          result[3].toString(10),
          SupplyChain.State.Sold,
          'the state of the item should be "Sold"',
        );
  
        assert.equal(
          result[5],
          bob,
          "the buyer address should be set bob when he purchases an item",
        );
  
        assert.equal(
          new BN(aliceBalanceAfter).toString(),
          new BN(aliceBalanceBefore).add(new BN(price)).toString(),
          "alice's balance should be increased by the price of the item",
        );
  
        assert.isBelow(
          Number(bobBalanceAfter),
          Number(new BN(bobBalanceBefore).sub(new BN(price))),
          "bob's balance should be reduced by more than the price of the item (including gas costs)",
        );
      });

      it.skip("should emit LogSigned event when a Land Title is signed and encrypted", async () => {
        var eventEmitted = false;
  
        await instance.addTitle(ID, size, location, image, { from: alice });
        const tx = await instance.buyItem(0, { from: bob, value: excessAmount });
  
        if (tx.logs[0].event == "LogSold") {
          eventEmitted = true;
        }
  
        assert.equal(eventEmitted, true, "adding an item should emit a Sold event");
      });
  
      it.skip("should allow the currOwner to register the Land Title", async () => {
        await instance.addTitle(ID, size, location, image, { from: alice });
        var aliceBalanceBefore = await web3.eth.getBalance(alice);
        var bobBalanceBefore = await web3.eth.getBalance(bob);
  
        await instance.buyItem(0, { from: bob, value: excessAmount });
  
        var aliceBalanceAfter = await web3.eth.getBalance(alice);
        var bobBalanceAfter = await web3.eth.getBalance(bob);
  
        const result = await instance.fetchItem.call(0);
  
        assert.equal(
          result[3].toString(10),
          SupplyChain.State.Sold,
          'the state of the item should be "Sold"',
        );
  
        assert.equal(
          result[5],
          bob,
          "the buyer address should be set bob when he purchases an item",
        );
  
        assert.equal(
          new BN(aliceBalanceAfter).toString(),
          new BN(aliceBalanceBefore).add(new BN(price)).toString(),
          "alice's balance should be increased by the price of the item",
        );
  
        assert.isBelow(
          Number(bobBalanceAfter),
          Number(new BN(bobBalanceBefore).sub(new BN(price))),
          "bob's balance should be reduced by more than the price of the item (including gas costs)",
        );
      });

      it.skip("should error when not enough value is sent when registering a Land Title", async () => {
        await instance.addTitle(ID, size, location, image, { from: alice });
        await catchRevert(instance.buyItem(0, { from: bob, value: 1 }));
      });
  
      it.skip("should emit LogRegistered event when and item is purchased", async () => {
        var eventEmitted = false;
  
        await instance.addTitle(ID, size, location, image, { from: alice });
        const tx = await instance.buyItem(0, { from: bob, value: excessAmount });
  
        if (tx.logs[0].event == "LogSold") {
          eventEmitted = true;
        }
  
        assert.equal(eventEmitted, true, "adding an item should emit a Sold event");
      });
  
      it.skip("should revert when someone that is not the seller tries to call shipItem()", async () => {
        await instance.addItem(name, price, { from: alice });
        await instance.buyItem(0, { from: bob, value: price });
        await catchRevert(instance.shipItem(0, { from: bob }));
      });
  
      it.skip("should allow the seller to mark the item as shipped", async () => {
        await instance.addItem(name, price, { from: alice });
        await instance.buyItem(0, { from: bob, value: excessAmount });
        await instance.shipItem(0, { from: alice });
  
        const result = await instance.fetchItem.call(0);
  
        assert.equal(
          result[3].toString(10),
          SupplyChain.State.Shipped,
          'the state of the item should be "Shipped"',
        );
      });
  
      it.skip("should emit a LogShipped event when an item is shipped", async () => {
        var eventEmitted = false;
  
        await instance.addItem(name, price, { from: alice });
        await instance.buyItem(0, { from: bob, value: excessAmount });
        const tx = await instance.shipItem(0, { from: alice });
  
        if (tx.logs[0].event == "LogShipped") {
          eventEmitted = true;
        }
  
        assert.equal(
          eventEmitted,
          true,
          "adding an item should emit a Shipped event",
        );
      });
  
      it.skip("should allow the buyer to mark the item as received", async () => {
        await instance.addItem(name, price, { from: alice });
        await instance.buyItem(0, { from: bob, value: excessAmount });
        await instance.shipItem(0, { from: alice });
        await instance.receiveItem(0, { from: bob });
  
        const result = await instance.fetchItem.call(0);
  
        assert.equal(
          result[3].toString(10),
          SupplyChain.State.Received,
          'the state of the item should be "Received"',
        );
      });
  
      it.skip("should revert if an address other than the buyer calls receiveItem()", async () => {
        await instance.addItem(name, price, { from: alice });
        await instance.buyItem(0, { from: bob, value: excessAmount });
        await instance.shipItem(0, { from: alice });
  
        await catchRevert(instance.receiveItem(0, { from: alice }));
      });
  
      it.skip("should emit a LogReceived event when an item is received", async () => {
        var eventEmitted = false;
  
        await instance.addItem(name, price, { from: alice });
        await instance.buyItem(0, { from: bob, value: excessAmount });
        await instance.shipItem(0, { from: alice });
        const tx = await instance.receiveItem(0, { from: bob });
  
        if (tx.logs[0].event == "LogReceived") {
          eventEmitted = true;
        }
  
        assert.equal(
          eventEmitted,
          true,
          "adding an item should emit a Shipped event",
        );
      });
  
    });
  });
});
