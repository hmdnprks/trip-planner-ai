import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [destination, setDestination] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "/api/generateTrip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ destination }),
        }
      );

      // get answer info
      const answer = await response.json();

      // display trip plan info
      if (answer.data) {
        console.log(answer);
        setAnswer(answer.data);
        setLoading(false);
      } else {
        setError("Unable to get trip plan info");
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  function handleClear(event) {
    event.preventDefault();
    setDestination("");
  }

  return (
    <>
      <Head>
        <title>Trip Planner</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h2>Trip Planner</h2>
        <form className={styles.form}>
          <div className={styles.input}>
            <textarea value={destination} placeholder="enter your destination and how many days" onChange={e => setDestination(e.currentTarget.value)}></textarea>
          </div>
          <button type="submit" onClick={handleSubmit}>Submit</button>
          <button type="reset" onClick={handleClear}>Clear</button>
        </form>
        {loading ? <div>Loading...</div> : (
          <div className={styles.answer}>
            {answer && (
              <>
                <p>Here the trip plan for your destination: </p>
                <p>{answer}</p>
              </>
            )}
          </div>
        )}
        {error && <p>{error}</p>}
      </main>
    </>
  )
}
