class CircularQueue {
  constructor(capacity = 5) {
    this.capacity = capacity;
    this.queue = new Array(capacity);
    this.front = 0;
    this.rear = 0;
    this.size = 0;
  }

  enqueue(item) {
    if (this.isFull()) {
      this.front = (this.front + 1) % this.capacity;
      this.size--; 
    }

    this.queue[this.rear] = item;
    this.rear = (this.rear + 1) % this.capacity;
    this.size++;
  }

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

  isEmpty() {
    return this.size === 0;
  }

  isFull() {
    return this.size === this.capacity;
  }

  clear() {
    this.front = 0;
    this.rear = 0;
    this.size = 0;
    this.queue = new Array(this.capacity);
  }
}

export default CircularQueue;
