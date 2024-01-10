import html2canvas from "html2canvas";

export const htmlToImage = async (element: HTMLElement): Promise<any> => {
  try {
    const canvas = await html2canvas(element);
    const cropX = 0;
    const cropY = 0;
    const cropWidth = 2000;
    const cropHeight = 2000;

    // Create a new canvas to store the cropped image
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d") as CanvasRenderingContext2D;
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;

    croppedCtx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    // Replace the original canvas with the cropped canvas
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.drawImage(croppedCanvas, 0, 0, cropWidth, cropHeight);

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.log("error", error);
  }
};
