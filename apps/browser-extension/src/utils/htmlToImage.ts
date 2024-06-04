import html2canvas from "html2canvas";

export const htmlToImage = async (element: HTMLElement): Promise<string | undefined> => {
  try {
    const canvas = await html2canvas(element, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    return canvas.toDataURL("image/png");
  } catch (error) {}
};
