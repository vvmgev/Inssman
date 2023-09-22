import { MimeType } from "src/models/formFieldModel";

export const downloadFile = (data: unknown = {}, type: string = MimeType.JSON): void => {
    const link = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], { type });
    link.href = URL.createObjectURL(file);
    link.download = "rules.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };
