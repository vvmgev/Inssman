import { getRecordedSessions, removeRecordedSession, removeRecordedSessionFile } from "../../../config/firebase";

export async function GET() {
  let isFaild = false;
  try {
    const recordedSessions: any[] = await getRecordedSessions();
    for (const recordedSession of recordedSessions) {
      const ttlDate = new Date(recordedSession.ttl);
      ttlDate.setDate(ttlDate.getDate() + 20);
      if (new Date().getTime() > ttlDate.getTime()) {
        await removeRecordedSession(recordedSession.docID);
        await removeRecordedSessionFile(recordedSession.docID);
      }
    }
  } catch (error) {
    isFaild = true;
  }

  return Response.json({ isFaild });
}
