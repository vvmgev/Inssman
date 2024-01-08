// @ts-nocheck
import { FC } from "react";
import Link from "next/link";
import Section from "../section/section";
import SessionPlayer from "../sessionPlayer/sessionPlayer";
import Loading from "../../components/loading/loading";

const timeDifference = (timestamp: number, startTimestamp?: number) => {
  const elapsedMilliseconds = (startTimestamp || Date.now()) - timestamp;

  const days = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24)); // 1 day = 86400000 milliseconds
  const hours = Math.floor(elapsedMilliseconds / 3600000); // 1 hour = 3600000 milliseconds
  const minutes = Math.floor((elapsedMilliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds
  const seconds = Math.floor((elapsedMilliseconds % 60000) / 1000); // 1 second = 1000 milliseconds

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

const getDuration = (session: any) => {
  if (!session) return "";
  try {
    const { minutes, seconds } = timeDifference(
      session.events[0].timestamp,
      session.events[session.events.length - 1].timestamp
    );
    return `${minutes > 0 ? `${minutes}m` : ""} ${seconds}s `;
  } catch (error) {
    return "";
  }
};
const SharedRecordedSession: FC<any> = ({ session, error }) => {
  return (
    <Section classes="flex-1 flex flex-col gap-14 h-full rounded-none">
      <div className="flex gap-5">
        <Section classes="rounded flex gap-2 max-w-[300px] whitespace-nowrap	">
          <span className="text-slate-400">URL: </span>
          <span>{session?.url}</span>
        </Section>
        <Section classes="rounded flex gap-2">
          <span className="text-slate-400">Recorded at: </span>
          <span>{session?.date}</span>
        </Section>
        <Section classes="rounded flex gap-2">
          <span className="text-slate-400">Duraction: </span>
          <span>{getDuration(session)}</span>
        </Section>
      </div>
      {error && (
        <div>
          {error === "notFound" && (
            <div>
              <p className="text-lg">The Session You're Looking For Does Not Exist. </p>
              <p className="leading-7 text-slate-400">Please Ensure That You Have Entered The Correct URL.</p>
              <p className="leading-7 text-slate-400">Or Contact The Session Owner For Assistance.</p>
              <Link href="/app" className="p-1 rounded bg-sky-600 hover:bg-sky-400">
                Go Main Page
              </Link>
              <div className="flex justify-center w-full">
                <span className="px-2 tracking-widest text-white rounded bg-sky-600 text-9xl">404</span>
              </div>
            </div>
          )}
          {error !== "notFound" && <div>{error}</div>}
        </div>
      )}
      <div className="flex justify-center">
        {!!session ? (
          <SessionPlayer playerOptions={{ width: 800, height: 600 }} session={session} />
        ) : (
          !error && <Loading />
        )}
      </div>
    </Section>
  );
};

export default SharedRecordedSession;
