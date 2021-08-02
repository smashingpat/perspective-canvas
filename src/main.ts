class Point {
  x: number;
  y: number;
  constructor(initialX: number, initialY: number) {
    this.x = initialX;
    this.y = initialY;
  }

  render(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    relativePoint: Point
  ) {
    const initialAngle = calculateAngleBetweenTwoPoints(this, relativePoint);
    const steps = 30;
    const x1 = this.x;
    const y1 = this.y;
    for (let i = 0; i < steps; i += 1) {
      const radius = Math.PI * Math.min(canvas.width, canvas.height);
      const gradientRadius = 300;
      const theta = initialAngle + ((Math.PI * 2) / steps) * i;
      const x2 = x1 + radius * Math.cos(theta);
      const y2 = y1 + radius * Math.sin(theta);
      const x3 = x1 + gradientRadius * Math.cos(theta);
      const y3 = y1 + gradientRadius * Math.sin(theta);
      const gradient = context.createLinearGradient(x1, y1, x3, y3);
      gradient.addColorStop(0, 'red');
      gradient.addColorStop(1, 'blue');
      context.beginPath();
      context.lineWidth = 0.5;
      context.strokeStyle = gradient;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }
  }
}

function calculateAngleBetweenTwoPoints(point1: Point, point2: Point) {
  const delta_x = point1.x - point2.x;
  const delta_y = point1.y - point2.y;
  return Math.atan2(delta_y, delta_x);
}

function createPerspectiveCanvas(container: HTMLElement) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 800;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  let pointA = new Point(200, 400);
  let pointB = new Point(400, 600);

  container.appendChild(canvas);

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    pointA.render(canvas, context, pointB);
    pointB.render(canvas, context, pointA);
  }
  function addPoint(x: number, y: number) {
    pointB = new Point(x, y);
    render();
  }

  render();

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    addPoint(x, y);
  });
}

createPerspectiveCanvas(document.getElementById('app') as HTMLElement);
