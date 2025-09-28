
export const buttonImagesCreator = (shapes, ctx, rect) => {

  const buttons = {};
  for (let shape in shapes) {
    buttons[shape] = { normal: null, highlight: null, select: null };
  }

  function rectangleImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, 30, 30);
    /// fill the gap between buttons (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(30, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.strokeRect(5, 5, 20, 20);
  }


  rectangleImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttons.rectangle.normal = ctx.getImageData(0, 0, 32, 30);
  rectangleImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttons.rectangle.highlight = ctx.getImageData(0, 0, 32, 30);
  rectangleImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttons.rectangle.select = ctx.getImageData(0, 0, 32, 30);


  function circleImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(32, 0, 30, 30);
    /// fill the gap between buttons (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(62, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.arc(47, 15, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
  }

  circleImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttons.circle.normal = ctx.getImageData(32, 0, 32, 30);
  circleImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttons.circle.highlight = ctx.getImageData(32, 0, 32, 30);
  circleImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttons.circle.select = ctx.getImageData(32, 0, 32, 30);

  function lineImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(64, 0, 30, 30);
    /// fill the gap between buttons (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(94, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.moveTo(69, 5);
    ctx.lineTo(89, 25);
    ctx.stroke();
    ctx.beginPath();
  }

  lineImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttons.line.normal = ctx.getImageData(64, 0, 32, 30);
  lineImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttons.line.highlight = ctx.getImageData(64, 0, 32, 30);
  lineImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttons.line.select = ctx.getImageData(64, 0, 32, 30);

  function pencilImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(96, 0, 30, 30);

    /// fill the gap between buttons (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(126, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
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
  }

  pencilImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttons.pencil.normal = ctx.getImageData(96, 0, 32, 30);
  pencilImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttons.pencil.highlight = ctx.getImageData(96, 0, 32, 30);
  pencilImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttons.pencil.select = ctx.getImageData(96, 0, 32, 30);

  function colorImage({ bgcolor, iconcolor, color }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(128, 0, 30, 30);
    ctx.fillStyle = color;
    ctx.fillRect(133, 5, 20, 20);
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.moveTo(133, 5);
    ctx.lineTo(153, 5);
    ctx.lineTo(153, 25);
    ctx.lineTo(133, 25);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
  }

  colorImage({ bgcolor: "lightgrey", iconcolor: "black", color: "black" })
  buttons.color.normal = ctx.getImageData(128, 0, 30, 30);
  colorImage({ bgcolor: "lightgrey", iconcolor: "white", color: "black" })
  buttons.color.highlight = ctx.getImageData(128, 0, 30, 30);
  colorImage({ bgcolor: "darkgrey", iconcolor: "black", color: "black" })
  buttons.color.select = ctx.getImageData(128, 0, 30, 30);

  function xImage({ bgcolor, iconcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(rect.width - 30, 0, 30, 30);
    ctx.font = "20px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = iconcolor;
    ctx.fillText("x", rect.width - 15, 15);
  }
  xImage({ bgcolor: "lightgrey", iconcolor: "black" })
  buttons.x.normal = ctx.getImageData(rect.width - 30, 0, 30, 30);
  xImage({ bgcolor: "lightgrey", iconcolor: "white" })
  buttons.x.highlight = ctx.getImageData(rect.width - 30, 0, 30, 30);
  xImage({ bgcolor: "darkgrey", iconcolor: "black" })
  buttons.x.select = ctx.getImageData(rect.width - 30, 0, 30, 30);


  return buttons;
}




export const buttonRender = (ctx, rect, buttons, { normal = false, highlight = false, select = false }, shape = "all") => {


  if (shape === "rectangle" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttons.rectangle.normal, 0, 0);
    } else if (highlight) {
      ctx.putImageData(buttons.rectangle.highlight, 0, 0);
    } else if (select) {
      ctx.putImageData(buttons.rectangle.select, 0, 0);
    }
  }

  if (shape === "circle" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttons.circle.normal, 32, 0);
    } else if (highlight) {
      ctx.putImageData(buttons.circle.highlight, 32, 0);
    } else if (select) {
      ctx.putImageData(buttons.circle.select, 32, 0);
    }
  }

  if (shape === "line" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttons.line.normal, 64, 0);
    } else if (highlight) {
      ctx.putImageData(buttons.line.highlight, 64, 0);
    } else if (select) {
      ctx.putImageData(buttons.line.select, 64, 0);
    }
  }

  if (shape === "pencil" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttons.pencil.normal, 96, 0);
    } else if (highlight) {
      ctx.putImageData(buttons.pencil.highlight, 96, 0);
    } else if (select) {
      ctx.putImageData(buttons.pencil.select, 96, 0);
    }
  }

  if (shape === "color" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttons.color.normal, 128, 0);
    } else if (highlight) {
      ctx.putImageData(buttons.color.highlight, 128, 0);
    } else if (select) {
      ctx.putImageData(buttons.color.select, 128, 0);
    }
  }

  if (shape === "x" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttons.x.normal, rect.width - 30, 0);
    } else if (highlight) {
      ctx.putImageData(buttons.x.highlight, rect.width - 30, 0);
    } else if (select) {
      ctx.putImageData(buttons.x.select, rect.width - 30, 0);
    }
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

export const drawPencil = (ctx, { clientX, clientY }, initCoord) => {

  //  clientX(drawing's) - (clientX(moveTo's) - initialMoveToX(ctx)) , clientY(drawing's) - (clientY(moveTo's) - initialMoveToY(ctx)) -> substitute below
  ctx.lineTo(clientX - (initCoord.xClient - initCoord.xOffset), clientY - (initCoord.yClient - initCoord.yOffset));
  ctx.stroke();
}

export const drawDot = (ctx, { offsetX, offsetY }) => {
  ctx.fillRect(offsetX, offsetY, 2, 2);
}

export const drawRectangle = (ctx, { clientX, clientY }, initCoord) => {
  ctx.strokeRect(initCoord.xOffset, initCoord.yOffset, clientX - initCoord.xClient, clientY - initCoord.yClient);
}


export const drawCircle = (ctx, { clientX, clientY }, initCoord) => {
  // clientX, clientY is your Mousecoordinates while drawing -from the top left corner of Windows as (0,0)
  ctx.beginPath();
  // dynamic center - having your circumference starting from the initialCoord. If you want static center, then only give xOffset and yOffset
  ctx.arc(initCoord.xOffset + (clientX - initCoord.xClient), initCoord.yOffset + (clientY - initCoord.yClient),
    Math.sqrt((clientX - initCoord.xClient) ** 2 + (clientY - initCoord.yClient) ** 2), 0, 2 * Math.PI);
  ctx.stroke();

}

export const drawLine = (ctx, { clientX, clientY }, initCoord) => {
  ctx.beginPath();
  ctx.moveTo(initCoord.xOffset, initCoord.yOffset);
  ctx.lineTo(clientX - (initCoord.xClient - initCoord.xOffset), clientY - (initCoord.yClient - initCoord.yOffset));
  ctx.stroke();
}
