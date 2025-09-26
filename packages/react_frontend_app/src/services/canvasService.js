
export const buttonRender = (ctx, rect, { bgcolor = "lightgrey", textcolor = "black", color = "black", shape = "all" } = {}) => {
  ctx.fillStyle = `${bgcolor}`;

  if (shape === "rectangle" || shape === "all") {
    ctx.clearRect(0, 0, 30, 30);
    ctx.fillRect(0, 0, 30, 30);

    ctx.save(); // To not get affected by lineWidth set in startDrawing function
    ctx.lineWidth = 1;
    ctx.strokeStyle = `${textcolor}`;
    ctx.strokeRect(5, 5, 20, 20);
    ctx.restore();

  }
  if (shape === "circle" || shape === "all") {
    ctx.clearRect(32, 0, 30, 30);
    ctx.fillRect(32, 0, 30, 30);

    ctx.save(); // To not get affected by lineWidth set in startDrawing function
    ctx.lineWidth = 1;
    ctx.strokeStyle = `${textcolor}`;
    ctx.beginPath();
    ctx.arc(47, 15, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.restore();

  }
  if (shape === "line" || shape === "all") {
    ctx.clearRect(64, 0, 30, 30);
    ctx.fillRect(64, 0, 30, 30);

    ctx.save(); // To not get affected by lineWidth set in startDrawing function
    ctx.lineWidth = 1;
    ctx.strokeStyle = `${textcolor}`;
    ctx.beginPath();
    ctx.moveTo(69, 5);
    ctx.lineTo(89, 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.restore();

  }
  if (shape === "pencil" || shape === "all") {
    ctx.clearRect(96, 0, 30, 30);
    ctx.fillRect(96, 0, 30, 30);

    ctx.save(); // To not get affected by lineWidth set in startDrawing function
    ctx.lineWidth = 1;
    ctx.strokeStyle = `${textcolor}`;
    ctx.beginPath();
    ctx.moveTo(101, 13);
    ctx.lineTo(117, 13);
    ctx.lineTo(121, 15);
    ctx.lineTo(117, 17);
    ctx.lineTo(101, 17);
    ctx.lineTo(101, 13);

    ctx.moveTo(104, 13);
    ctx.lineTo(104, 17);
    ctx.stroke();
    ctx.beginPath();
    ctx.restore();

  }
  if (shape === "color" || shape === "all") {
    ctx.save();
    ctx.clearRect(128, 0, 30, 30);
    ctx.fillRect(128, 0, 30, 30);
    ctx.fillStyle = `${color}`;
    ctx.fillRect(133, 5, 20, 20);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `${textcolor}`
    ctx.beginPath();
    ctx.moveTo(133, 5);
    ctx.lineTo(153, 5);
    ctx.lineTo(153, 25);
    ctx.lineTo(133, 25);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.restore();

  }
  if (shape === "x" || shape === "all") {
    ctx.fillStyle = `${bgcolor}`;
    ctx.fillRect(rect.width - 30, 0, 30, 30);
    ctx.font = "20px georgia";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = textcolor;
    ctx.fillText("x", rect.width - 15, 15);

  }
}


export const isInsideButtonRegion = ({ x0, x1, y0, y1 }, { offsetX, offsetY }) => {
  if (offsetX >= x0 && offsetX <= x1 && offsetY >= y0 && offsetY <= y1) {
    return true;
  }
  return false;
}

export const buttonFinder = (mouseCoord, rect, isInsideButtonRegion) => {

  switch (true) {
    case isInsideButtonRegion({ x0: rect.width - 30, x1: rect.width, y0: 0, y1: 30 },
      { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY }):
      return "x";

    case isInsideButtonRegion({ x0: 0, x1: 30, y0: 0, y1: 30 },
      { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY }):
      return "rectangle";

    case isInsideButtonRegion({ x0: 32, x1: 62, y0: 0, y1: 30 },
      { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY }):
      return "circle";

    case isInsideButtonRegion({ x0: 64, x1: 94, y0: 0, y1: 30 },
      { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY }):
      return "line";

    case isInsideButtonRegion({ x0: 96, x1: 126, y0: 0, y1: 30 },
      { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY }):
      return "pencil";

    case isInsideButtonRegion({ x0: 128, x1: 158, y0: 0, y1: 30 },
      { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY }):
      return "color";

    default:
      return null;
  }


}

export const isOutsideButton = (buttonName, mouseCoord, rect, isInsideButtonRegion) => {
  switch (buttonName) {
    case "x":
      return !isInsideButtonRegion({ x0: rect.width - 30, x1: rect.width, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "rectangle":
      return !isInsideButtonRegion({ x0: 0, x1: 30, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "circle":
      return !isInsideButtonRegion({ x0: 32, x1: 62, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "line":
      return !isInsideButtonRegion({ x0: 64, x1: 94, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "pencil":
      return !isInsideButtonRegion({ x0: 96, x1: 126, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "color":
      return !isInsideButtonRegion({ x0: 128, x1: 158, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });
  }
}

// CANVAS MANIPULATION SERVICES

export const clearCanvas = (ctx, rect) => {
  //clearing only the drawable canvas
  ctx.clearRect(158, 0, rect.width - 188, 30);
  ctx.clearRect(0, 30, rect.width, rect.height - 30);
}

export const setDrawProps = (ctx, { lineWidth, color }) => {
  ctx.lineWidth = lineWidth;
  // color
  // etc.. properties
}

export const startPencilDraw = (ctx, { offsetX, offsetY }) => {
  //native event is the event of DOM
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY)
}

export const drawPencil = (ctx, { offsetX, offsetY }) => {

  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
}

export const drawDot = (ctx, { offsetX, offsetY }) => {
  ctx.fillRect(offsetX, offsetY, 2, 2);
}

export const drawRectangle = (ctx, rect, { offsetX, offsetY }, initCoord, clearCanvas) => {
  ctx.strokeRect(initCoord.x, initCoord.y, offsetX - initCoord.x, offsetY - initCoord.y);
}
