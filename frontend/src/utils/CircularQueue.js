/**
 * A Circular Queue data structure with a fixed size.
 * When the queue is full, adding a new item overwrites the oldest item.
 * Useful for maintaining a fixed-size history of chat context.
 */
class CircularQueue {
  constructor(capacity = 5) {
    this.capacity = capacity;
    this.queue = new Array(capacity);
    this.front = 0;
    this.rear = 0;
    this.size = 0;
  }

  /**
   * Adds an item to the queue.
   * If full, it overwrites the oldest item (advances front).
   * @param {any} item - The item to add.
   */
  enqueue(item) {
    if (this.isFull()) {
      this.front = (this.front + 1) % this.capacity;
      this.size--; 
    }

    this.queue[this.rear] = item;
    this.rear = (this.rear + 1) % this.capacity;
    this.size++;
  }

  /**
   * Returns all items in the queue in generic order (oldest to newest).
   * Does NOT clear the queue.
   * @returns {Array} Array of items.
   */
  getItems() {
    if (this.isEmpty()) {
      return [];
    }

    const items = [];
    let current = this.front;
    for (let i = 0; i < this.size; i++) {
        items.push(this.queue[current]);
        current = (current + 1) % this.capacity;
    }
    return items;
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean}
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Checks if the queue is full.
   * @returns {boolean}
   */
  isFull() {
    return this.size === this.capacity;
  }

  /**
   * Clears the queue.
   */
  clear() {
    this.front = 0;
    this.rear = 0;
    this.size = 0;
    this.queue = new Array(this.capacity);
  }
}

export default CircularQueue;
