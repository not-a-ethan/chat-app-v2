import Link from "next/link";

import styles from "../styles/home.module.css";

export default function Home() {
  const envFile = `NEXTAUTH_SECRET=<INFO https://next-auth.js.org/configuration/options#nextauth_secret>
NEXTAUTH_URL=<URL OF APPLICATION INCLUDING PROTOCAL>

githubClientId=<GITHUB AUTH ID>
githubClientSecret=<GITHUB AUTH SECRET>

pgHost=<postgresql hostname>
pgUser=<postgresql username>
pgName=<postgresql database name>
pgPassword=<postgresql password>
pgPort=<postgresql port>`;

  return (
    <main className={`${styles.main}`}>
      <h1>Chat App V2</h1>

      <p>This site is similer in concept to Discord and the second version I have made. The <Link href="https://github.com/not-a-ethan/chat-app">Github Repository</Link> can be viewed.</p>

      <p>If you are looking for the chat page it is located at <Link href="/chat">/chat</Link>.</p>

      <h2>Features</h2>

      <div className={`${styles.grid}`}>
        <div className={`${styles.col1} ${styles.row1}`}>
          <h3>Chatting</h3>

          <ul className={`${styles.list}`}>
            <li>Sending Message</li>
            <li>Editing Message</li>
            <li>Delete messages</li>
            <li>React to messages</li>
          </ul>
        </div>

        <div className={`${styles.col2} ${styles.row1}`}>
          <h3>Users</h3>

          <ul className={`${styles.list}`}>
            <li>Editing name</li>
            <li>Editing and Deleting Profile Picture</li>
            <li>Github integration</li>
          </ul>
        </div>

        <div className={`${styles.col1} ${styles.row2}`}>
          <h3>Rooms</h3>

          <ul className={`${styles.list}`}>
            <li>Create rooms</li>
            <li>Changing room name</li>
            <li>Add and Remove users</li>
            <li>Delete room</li>
          </ul>
        </div>

        <div className={`${styles.col2} ${styles.row2}`}>
          <h3>Moderation</h3>

          <ul className={`${styles.list}`}>
            <h4>Room Owners Only</h4>

            <ul className={`${styles.list}`}>
              <li>Promote moderators</li>
              <li>Demote Moderators</li>
              <li>Delete rooms</li>
              <li>Change owner</li>

              <h4>All moderators (including room owners)</h4>

              <ul className={`${styles.list}`}>
                <li>Delete any message</li>
                <li>Kick any user</li>
                <li>Demote themselves</li>
              </ul>
            </ul>
          </ul>
        </div>
      </div>

      <h2>Devloper Info</h2>

      <p>This project uses a varity of tools to make the devlopment proccess easier.</p>

      <ul className={`${styles.list}`}>
        <li>Next.js</li>
        <li>HeroUI</li>
        <li>
          Nextauth

          <ul className={`${styles.list} ${styles.subList}`}>
            <li>Github Integration</li>  
          </ul> 
        </li>

        <li>PostgreSQL</li>

        <h3>Envirment varibles</h3>

        <p>The <code>.env</code> file should be formatted as such:</p>

        <br />

        <div className={`${styles.envFile}`}>
          <code>{envFile}</code>
        </div>
      </ul>

      <p>Some API docs are located in the <Link href="https://github.com/not-a-ethan/chat-app-v2/tree/main/docs"><code>/docs</code></Link> folder. They are not complete and are still a work in progress.</p>
    </main>
  );
};