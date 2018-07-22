/**
 * This is a test program written to test the functionality of TranQueue.
 *
 * @author Alfredo Rivero
 * @version 1.0
 */

/**
 * The main function used to test the TranQueue
 */
function main() {
  // Create TranQueue object
  var tranQueue = new TranQueue();

  // Create invalid objects
  var invI = math.matrix([[0, 0, 0, 0], [1, 2, 3, 4], [5, 6, 7, 9]]);
  var invI2 = math.matrix([[0, 0, 0], [1, 2, 3], [5, 6, 7], [42, 0, 6]]);
  var invI3 = math.identity([12, 12]);
  var invI4 = math.identity([1,1]);
  var invNum = 8;

  // Create valid objects
  var I4x4 = math.identity([4,4]);
  var I3x3 = math.identity([3,3]);
  var test1 = math.identity([4,4]);
  var test2 = math.matrix([[0, 0, 0, 0], [1, 2, 3, 4], [5, 6, 7, 9], [42, 0, 6, 9]]);
  var test3 = math.matrix([[4, 4, 4, 4], [5, 6, 73, 8], [8, 0, 0, 8], [3, 3, 63, 39]]);
  var test4 = math.matrix([[2, 4, 6, 8], [1.4, 2.52, .3, 8], [5.0, 6.7, 7.8, 6.9], [5.0, 6.7, 7.8, 6.9]]);

  // THESE TEST SHOULD THROW EXCEPTIONS
  tranQueue.addMatrix(invI, 0);
  tranQueue.addMatrix(invI, 2);
  tranQueue.addMatrix(invI3, 9);
  tranQueue.addMatrix(invI4, 8);
  tranQueue.addMatrix(invNum, 8);

  // THESE TEST SHOULD WORK
  tranQueue.addMatrix(I4x4, 0);
  tranQueue.addMatrix(I3x3, tranQueue.getLength());

  // THESE TESTS SHOULD THROW EXCEPTIONS
  tranQueue.addMatrix(test1, tranQueue.getLength() + 1);
  tranQueue.addMatrix(test1, -1);

  // THESE TESTS SHOULD WORK
  tranQueue.addMatrix(test1, tranQueue.getLength());
  tranQueue.addMatrix(test2, tranQueue.getLength() - 1);
  tranQueue.addMatrix(test3, 2);
  tranQueue.addMatrix(test4, 1);

  // tranQueue should have: I4x4, I3x3, test4, test2, test3, test1

  tranQueue.removeMatrix(I4x4);
  tranQueue.moveMatrix(I3x3, -1);
  tranQueue.moveMatrix(I3x3, 2);
  tranQueue.moveMatrix(I3x3, 0);
  tranQueue.moveMatrix(I3x3, 2000);
  tranQueue.moveMatrix(test3, 2);

  // Verify results
  console.log(tranQueue.getQueue());
  console.log(tranQueue.threeToFour(I3x3));
  console.log(tranQueue.threeMatrix);
}
